/**
 * WebSocketClient
 * 
 * A client for handling WebSocket communications with the PrimVoices TTS API.
 * This client supports:
 * - Establishing WebSocket connections
 * - Sending audio data from microphone
 * - Receiving and processing audio responses
 * - Managing the lifecycle of an audio conversation
 */

import { v4 as uuidv4 } from 'uuid';
import { Logger } from './Logger';

const logger = new Logger();

// Types for configuration and callbacks
export interface WebSocketClientConfig {
  serverUrl?: string;
  agentId?: string;
  versionStatus?: string;
  environment?: string;
  debug?: boolean;
}

export interface AudioStats {
  level: number;
  isSpeaking: boolean;
}

export type AudioDataCallback = (audioData: Float32Array) => void;
export type MessageCallback = (message: string) => void;
export type StatusCallback = () => void;
export type AudioStatsCallback = (stats: AudioStats) => void;

export class WebSocketClient {
  private socket: WebSocket | null = null;
  private audioContext: AudioContext | null = null;
  private mediaStream: MediaStream | null = null;
  private microphoneSource: MediaStreamAudioSourceNode | null = null;
  private audioWorklet: AudioWorkletNode | null = null;
  private analyser: AnalyserNode | null = null;
  private audioQueue: { data: Float32Array; sampleRate: number }[] = [];
  private currentAudioSource: AudioBufferSourceNode | null = null;
  private workletInitialized = false;
  private isListening = false;
  private isConnected = false;
  private isPlaying = false;
  private callSid = '';
  private streamSid = '';
  private config: WebSocketClientConfig;
  private speechDetected = false;
  private statsInterval: number | null = null;

  // Callbacks
  private onConnectionOpen: StatusCallback | null = null;
  private onConnectionClose: StatusCallback | null = null;
  private onConnectionError: StatusCallback | null = null;
  private onStartListening: StatusCallback | null = null;
  private onStopListening: StatusCallback | null = null;
  private onAgentMessage: MessageCallback | null = null;
  private onPlayStart: StatusCallback | null = null;
  private onPlayStop: StatusCallback | null = null;
  private onAudioStats: AudioStatsCallback | null = null;

  constructor(config: WebSocketClientConfig) {
    this.config = {
      serverUrl: 'wss://tts.primvoices.com/ws',
      debug: false,
      ...config,
    };

    logger.setLogLevel(this.config.debug ? 'DEBUG' : 'INFO');
    
    // Initialize the audio context
    this.initAudioContext();
  }

  /**
   * Set callbacks for different events
   */
  public setCallbacks({
    onOpen,
    onClose,
    onError,
    onMessage,
    onListeningStart,
    onListeningStop,
    onAudioStart,
    onAudioStop,
    onAudioStats,
  }: {
    onOpen?: StatusCallback;
    onClose?: StatusCallback;
    onError?: StatusCallback;
    onMessage?: MessageCallback;
    onListeningStart?: StatusCallback;
    onListeningStop?: StatusCallback;
    onAudioStart?: StatusCallback;
    onAudioStop?: StatusCallback;
    onAudioStats?: AudioStatsCallback;
  }): void {
    this.onConnectionOpen = onOpen || null;
    this.onConnectionClose = onClose || null;
    this.onConnectionError = onError || null;
    this.onAgentMessage = onMessage || null;
    this.onStartListening = onListeningStart || null;
    this.onStopListening = onListeningStop || null;
    this.onPlayStart = onAudioStart || null;
    this.onPlayStop = onAudioStop || null;
    this.onAudioStats = onAudioStats || null;
  }

  /**
   * Initialize the WebSocket connection
   */
  public connect(): void {        
    // Generate unique IDs for this session
    this.callSid = uuidv4();
    this.streamSid = uuidv4();
    
    // Close existing connection if there is one
    if (this.socket) {
      this.socket.close();
    }

    if (!this.config.serverUrl) {
      throw new Error('Server URL is required');
    }
    
    // Create and setup new WebSocket connection
    this.socket = new WebSocket(this.config.serverUrl);
    this.setupSocketHandlers();
  
    logger.debug(`[WebSocketClient] Connecting to ${this.config.serverUrl}`);
    logger.debug(`[WebSocketClient] Session IDs: call=${this.callSid}, stream=${this.streamSid}`);
  }

  /**
   * Setup WebSocket event handlers
   */
  private setupSocketHandlers(): void {
    if (!this.socket) return;
        
    this.socket.onopen = () => {
      this.isConnected = true;
      
      // Send start message following the format in audio.ts
      const startMessage = {
        start: {
          streamSid: this.streamSid,
          callSid: this.callSid,
          customParameters: {
            inputType: 'mic',
            agentId: this.config.agentId || 'default',
            versionStatus: this.config.versionStatus || 'staged',
          },
        },
      };
      
      // Send the start message
      this.socket?.send(JSON.stringify(startMessage));
    
      logger.debug('[WebSocketClient] Connection established');
      logger.debug('[WebSocketClient] Sent start message:', startMessage);
      
      if (this.onConnectionOpen) {
        this.onConnectionOpen();
      }
    };
    
    this.socket.onclose = () => {
      this.isConnected = false;
      if (this.config.debug) {
        console.log('[WebSocketClient] Connection closed');
      }
      if (this.onConnectionClose) {
        this.onConnectionClose();
      }
      this.stopListening();
    };
    
    this.socket.onerror = (error) => {
      if (this.config.debug) {
        console.error('[WebSocketClient] WebSocket error:', error);
      }
      if (this.onConnectionError) {
        this.onConnectionError();
      }
    };
    
    this.socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        // Handle different message types
        if (data.event === 'media') {
          this.handleAudioMessage(data);
        } else if (data.event === 'clear') {
          this.handleClearMessage(data);
        } else if (data.event === 'transcript') {
          if (this.onAgentMessage && data.text) {
            this.onAgentMessage(data.text);
          }
        }
      } catch (error) {
        if (this.config.debug) {
          console.error('[WebSocketClient] Error parsing message:', error);
        }
      }
    };
  }

  /**
   * Handle audio data received from the server
   */
  private handleAudioMessage(data: any): void {
    if (!data.media || !data.media.payload) return;
    
    // Decode base64 audio
    const base64 = data.media.payload;
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    
    // Always assume 24kHz audio (regardless of what format might be specified)
    // Make sure we have even number of bytes for 16-bit samples
    let int16Data: Int16Array;
    
    if (bytes.length % 2 !== 0) {
      // Create a properly aligned copy with even length
      const alignedBuffer = new ArrayBuffer(bytes.length + (bytes.length % 2));
      new Uint8Array(alignedBuffer).set(bytes);
      int16Data = new Int16Array(alignedBuffer);
    } else {
      // Buffer is already properly sized
      const alignedBuffer = new ArrayBuffer(bytes.length);
      new Uint8Array(alignedBuffer).set(bytes);
      int16Data = new Int16Array(alignedBuffer);
    }
    
    // Convert to Float32Array for Web Audio API
    const floatData = new Float32Array(int16Data.length);
    for (let i = 0; i < int16Data.length; i++) {
      floatData[i] = int16Data[i] / 32768.0;  // Scale to -1.0 to 1.0
    }
    
    // Add to audio queue for playback with 24kHz sample rate
    this.addToAudioQueue(floatData, 24000);
  }

  private handleClearMessage(data: any): void {
    if (this.config.debug) {
      console.log('[WebSocketClient] Received clear message:', data);
    }

    this.clearAudioQueue();
  }

  /**
   * Initialize the audio context and related components
   */
  private async initAudioContext(): Promise<void> {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 256;
      
      // Register the audio worklet for processing microphone input
      if (this.audioContext.audioWorklet && !this.workletInitialized) {
        const workletCode = `
          class AudioProcessor extends AudioWorkletProcessor {
            constructor() {
              super();
              this.port.onmessage = this.handleMessage.bind(this);
            }
          
            handleMessage(event) {
              if (event.data.command === 'stop') {
                // Handle stop command if needed
              }
            }
          
            process(inputs, outputs, parameters) {
              // Get input data from the microphone
              const input = inputs[0];
              if (input.length > 0 && input[0].length > 0) {
                const audioData = input[0];
                
                // Send audio data to the main thread
                this.port.postMessage({
                  audioData: audioData
                });
              }
              
              // Return true to keep the processor alive
              return true;
            }
          }
          
          registerProcessor('audio-processor', AudioProcessor);
        `;
        
        const blob = new Blob([workletCode], { type: 'application/javascript' });
        const blobURL = URL.createObjectURL(blob);
        
        await this.audioContext.audioWorklet.addModule(blobURL);
        URL.revokeObjectURL(blobURL);
        
        this.workletInitialized = true;
        
        if (this.config.debug) {
          console.log('[WebSocketClient] Audio worklet initialized');
        }
      }
    } catch (error) {
      if (this.config.debug) {
        console.error('[WebSocketClient] Error initializing audio context:', error);
      }
    }
  }

  /**
   * Start capturing audio from the microphone and sending it to the server
   */
  public async startListening(): Promise<void> {
    if (this.isListening || !this.isConnected) return;
    
    try {
      // Resume audio context if it's suspended
      if (this.audioContext?.state === 'suspended') {
        await this.audioContext.resume();
      }
      
      // Request microphone access
      this.mediaStream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
        video: false 
      });
      
      if (!this.audioContext) {
        throw new Error('Audio context not initialized');
      }
      
      // Create microphone source and connect it to the audio graph
      this.microphoneSource = this.audioContext.createMediaStreamSource(this.mediaStream);
      
      if (this.workletInitialized) {
        // Use the audio worklet for processing
        this.audioWorklet = new AudioWorkletNode(this.audioContext, 'audio-processor');
        this.microphoneSource.connect(this.audioWorklet);
        
        if (this.analyser) {
          this.microphoneSource.connect(this.analyser);
        }
        
        // Handle audio data from the worklet
        this.audioWorklet.port.onmessage = (event) => {
          if (event.data.audioData && this.isListening) {
            this.processAudioData(event.data.audioData);
          }
        };
      } else {
        // Fallback to ScriptProcessorNode (deprecated but more widely supported)
        if (this.config.debug) {
          console.log('[WebSocketClient] Using ScriptProcessorNode fallback');
        }
        const bufferSize = 4096;
        const scriptProcessor = this.audioContext.createScriptProcessor(bufferSize, 1, 1);
        this.microphoneSource.connect(scriptProcessor);
        scriptProcessor.connect(this.audioContext.destination);
        
        if (this.analyser) {
          this.microphoneSource.connect(this.analyser);
        }
        
        scriptProcessor.onaudioprocess = (event) => {
          if (this.isListening) {
            const inputData = event.inputBuffer.getChannelData(0);
            this.processAudioData(inputData);
          }
        };
      }
      
      this.isListening = true;
      
      // Start audio stats monitoring
      this.startAudioStatsMonitoring();
      
      if (this.onStartListening) {
        this.onStartListening();
      }
      
      if (this.config.debug) {
        console.log('[WebSocketClient] Started listening');
      }
    } catch (error) {
      if (this.config.debug) {
        console.error('[WebSocketClient] Error starting microphone:', error);
      }
      this.isListening = false;
    }
  }

  /**
   * Stop capturing audio from the microphone
   */
  public stopListening(): void {
    if (!this.isListening) return;
    
    // Stop all media tracks
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = null;
    }
    
    // Disconnect audio nodes
    if (this.microphoneSource) {
      this.microphoneSource.disconnect();
      this.microphoneSource = null;
    }
    
    if (this.audioWorklet) {
      this.audioWorklet.disconnect();
      this.audioWorklet = null;
    }
    
    this.isListening = false;
    
    // Stop audio stats monitoring
    this.stopAudioStatsMonitoring();
    
    if (this.onStopListening) {
      this.onStopListening();
    }
    
    if (this.config.debug) {
      console.log('[WebSocketClient] Stopped listening');
    }
  }

  /**
   * Send a text message to the server
   */
  public sendText(text: string): void {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) return;
    this.socket.send(JSON.stringify({ event: 'text', text }));
  }

  /**
   * Close the WebSocket connection and clean up resources
   */
  public disconnect(): void {
    this.stopListening();
    
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    
    this.isConnected = false;
    this.clearAudioQueue();
    
    if (this.config.debug) {
      console.log('[WebSocketClient] Disconnected');
    }
  }

  /**
   * Process captured audio data and send it to the server
   */
  private processAudioData(inputData: Float32Array): void {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) return;
    
    try {
      // Sample rate of the incoming audio data
      const sampleRate = this.audioContext?.sampleRate || 48000;
      
      // Twilio expects 16kHz μ-law encoded audio, as in audio.ts
      const targetSampleRate = 16000;
      
      if (this.config.debug) {
        // Check if there's sound in the input data
        const hasSound = inputData.some((value) => Math.abs(value) > 0.01);
        console.log(`[WebSocketClient] Processing audio frame: ${inputData.length} samples at ${sampleRate}Hz ${hasSound ? "(has sound)" : "(silent)"}`);
      }
      
      // Downsample to 16kHz as in audio.ts
      // This directly returns Int16Array scaled to 16-bit range
      const int16Data = this.downsampleBuffer(inputData, sampleRate, targetSampleRate);
      
      if (this.config.debug) {
        console.log(`[WebSocketClient] Downsampled to ${int16Data.length} samples at ${targetSampleRate}Hz`);
      }
      
      // Convert PCM to μ-law as in audio.ts
      const muLawData = this.linearToMuLaw(int16Data);
      
      if (this.config.debug) {
        console.log(`[WebSocketClient] Converted to μ-law format: ${muLawData.length} bytes`);
      }
      
      // Encode to base64
      const base64Data = this.arrayBufferToBase64(muLawData.buffer);
      
      // Send via WebSocket - match format in audio.ts exactly
      const message = {
        event: 'media',
        streamSid: this.streamSid,
        media: {
          payload: base64Data
        },
      };
      
      this.socket.send(JSON.stringify(message));
      
      if (this.config.debug) {
        console.log(`[WebSocketClient] Sent μ-law encoded audio: ${base64Data.length} base64 chars`);
      }
    } catch (error) {
      if (this.config.debug) {
        console.error('[WebSocketClient] Error processing or sending audio:', error);
      }
    }
  }

  /**
   * Convert array buffer to base64
   */
  private arrayBufferToBase64(buffer: ArrayBufferLike): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  /**
   * Convert linear PCM to muLaw - matches audio.ts implementation
   */
  private linearToMuLaw(pcmData: Int16Array): Uint8Array {
    const BIAS = 33;
    const CLIP = 32635;
    const result = new Uint8Array(pcmData.length);

    for (let i = 0; i < pcmData.length; i++) {
      // Get the sample value
      let sample = pcmData[i];

      // Get the sign bit
      const sign = sample < 0 ? 0x80 : 0;

      // Get absolute value of sample
      if (sign) {
        sample = -sample;
      }

      // Clip the sample
      sample = Math.min(sample, CLIP);

      // Add bias
      sample += BIAS;

      // Compute logarithm
      let exponent = 7;
      let compressedSample = 0;

      // Find the first bit that is set
      for (let j = 10; j >= 0; j--) {
        if ((sample & (1 << j)) !== 0) {
          exponent = Math.floor(j / 2);
          break;
        }
      }

      // Get mantissa (the 4 bits that follow the implicit 1)
      const mantissa = (sample >> (exponent + 3)) & 0x0f;

      // Combine exponent and mantissa
      compressedSample = (exponent << 4) | mantissa;

      // Apply sign bit and invert (μ-law specific)
      result[i] = ~(sign | compressedSample) & 0xff;
    }

    return result;
  }

  /**
   * Downsample audio buffer - matches audio.ts implementation
   */
  private downsampleBuffer(buffer: Float32Array, originalSampleRate: number, targetSampleRate: number): Int16Array {
    if (targetSampleRate > originalSampleRate) {
      throw new Error("downsampling rate should be lower than original sample rate");
    }
    
    const sampleRateRatio = originalSampleRate / targetSampleRate;
    const newLength = Math.round(buffer.length / sampleRateRatio);
    const result = new Int16Array(newLength);

    let lastIndex = 0;
    for (let i = 0; i < newLength; i++) {
      const nextIndex = Math.round((i + 1) * sampleRateRatio);
      let accum = 0,
        count = 0;
      
      for (let j = lastIndex; j < nextIndex && j < buffer.length; j++) {
        accum += buffer[j];
        count++;
      }
      
      result[i] = count > 0 ? Math.round((accum / count) * 32767) : 0;
      lastIndex = nextIndex;
    }
    
    return result;
  }

  /**
   * Add audio data to the playback queue
   */
  private addToAudioQueue(audioData: Float32Array, sampleRate = 16000): void {
    this.audioQueue.push({ data: audioData, sampleRate });
    
    // Start playing if not already playing
    if (!this.isPlaying) {
      this.playNextInQueue();
    }
  }

  /**
   * Clear the audio playback queue
   */
  private clearAudioQueue(): void {
    this.audioQueue = [];
    
    // Stop current playback
    if (this.currentAudioSource) {
      this.currentAudioSource.stop();
      this.currentAudioSource.disconnect();
      this.currentAudioSource = null;
    }
    
    this.isPlaying = false;
  }

  /**
   * Play the next audio chunk in the queue
   */
  private playNextInQueue(): void {
    if (!this.audioContext || this.audioQueue.length === 0) {
      this.isPlaying = false;
      
      if (this.onPlayStop) {
        this.onPlayStop();
      }
      
      return;
    }
    
    // Get the next audio chunk from the queue
    const audioItem = this.audioQueue.shift();
    if (!audioItem) return;
    
    const { data: audioData, sampleRate } = audioItem;
    
    // Create an audio buffer with the appropriate sample rate
    const audioBuffer = this.audioContext.createBuffer(1, audioData.length, sampleRate);
    audioBuffer.getChannelData(0).set(audioData);
    
    // Create a source node and connect it to the destination
    this.currentAudioSource = this.audioContext.createBufferSource();
    this.currentAudioSource.buffer = audioBuffer;
    this.currentAudioSource.connect(this.audioContext.destination);
    
    // When this chunk finishes playing, play the next one
    this.currentAudioSource.onended = () => {
      if (this.currentAudioSource) {
        this.currentAudioSource.disconnect();
        this.currentAudioSource = null;
      }
      
      this.playNextInQueue();
    };
    
    // Start playback
    this.currentAudioSource.start();
    this.isPlaying = true;
    
    // Trigger callback if this is the start of playback
    if (this.onPlayStart && this.audioQueue.length === 0) {
      this.onPlayStart();
    }
  }

  /**
   * Get the current audio level (volume) from the analyzer
   */
  public getAudioLevel(): number {
    if (!this.analyser) return 0;
    
    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(dataArray);
    
    // Calculate average volume
    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
      sum += dataArray[i];
    }
    
    return sum / dataArray.length / 255; // Normalize to 0-1 range
  }

  /**
   * Start monitoring audio levels for speech detection
   */
  private startAudioStatsMonitoring(): void {
    if (this.statsInterval) {
      clearInterval(this.statsInterval);
    }
    
    // Monitor audio levels at 100ms intervals
    this.statsInterval = window.setInterval(() => {
      const level = this.getAudioLevel();
      const isSpeaking = level > 0.1; // Simple threshold detection
      
      // Fire callback with audio stats
      if (this.onAudioStats) {
        this.onAudioStats({
          level,
          isSpeaking
        });
      }
      
      // Optional speech detection logic could go here
      if (isSpeaking !== this.speechDetected) {
        this.speechDetected = isSpeaking;
        // Trigger speech events if needed
      }
    }, 100);
  }

  /**
   * Stop audio stats monitoring
   */
  private stopAudioStatsMonitoring(): void {
    if (this.statsInterval) {
      clearInterval(this.statsInterval);
      this.statsInterval = null;
    }
  }

  /**
   * Utility methods to check current state
   */
  public isCurrentlyConnected(): boolean {
    return this.isConnected;
  }

  public isCurrentlyListening(): boolean {
    return this.isListening;
  }

  public isCurrentlyPlaying(): boolean {
    return this.isPlaying;
  }
} 
