import React, { useState, useEffect, useRef } from 'react';
import { usePrimVoices } from './PrimVoicesProviderContext';

interface AdvancedAudioConversationProps {
  onMessage?: (message: string) => void;
  onError?: (error: string) => void;
  autoConnect?: boolean;
  welcomeMessage?: string;
  agentName?: string;
  userName?: string;
  containerClassName?: string;
  chatClassName?: string;
  buttonClassName?: string;
}

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

/**
 * AdvancedAudioConversation
 * 
 * An advanced component with a chat-like interface and audio visualization.
 * This component provides a more complete conversation experience.
 */
export const AdvancedAudioConversation: React.FC<AdvancedAudioConversationProps> = ({
  onMessage,
  onError,
  autoConnect = false,
  welcomeMessage = 'Hello! How can I help you today?',
  agentName = 'Assistant',
  userName = 'You',
  containerClassName = '',
  chatClassName = '',
  buttonClassName = '',
}) => {
  const {
    connect,
    disconnect,
    startListening,
    stopListening,
    sendTextMessage,
    isConnected,
    isListening,
    isPlaying,
    messages,
    audioStats,
    error,
  } = usePrimVoices();

  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [textInput, setTextInput] = useState<string>('');
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  // Auto-connect if specified
  useEffect(() => {
    if (autoConnect && !isConnected) {
      connect();
    }
    
    // Add welcome message
    if (welcomeMessage) {
      setChatMessages([{
        id: 'welcome',
        text: welcomeMessage,
        isUser: false,
        timestamp: new Date(),
      }]);
    }
    
    // Clean up animation on unmount
    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [autoConnect, connect, isConnected, welcomeMessage]);

  // Handle new messages
  useEffect(() => {
    if (messages.length > 0) {
      const newMessage = messages[messages.length - 1];
      
      setChatMessages(prev => [
        ...prev,
        {
          id: `agent-${Date.now()}`,
          text: newMessage,
          isUser: false,
          timestamp: new Date(),
        }
      ]);
      
      if (onMessage) {
        onMessage(newMessage);
      }
    }
  }, [messages, onMessage]);

  // Handle errors
  useEffect(() => {
    if (error && onError) {
      onError(error);
    }
  }, [error, onError]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // Handle toggling the microphone
  const handleToggleMicrophone = async () => {
    if (!isConnected) {
      connect();
      return;
    }

    if (isListening) {
      stopListening();
    } else {
      await startListening();
      
      // Add a user message placeholder
      setChatMessages(prev => [
        ...prev,
        {
          id: `user-${Date.now()}`,
          text: '🎤 Listening...',
          isUser: true,
          timestamp: new Date(),
        }
      ]);
    }
  };

  // Handle sending text message
  const handleSendTextMessage = () => {
    if (!textInput.trim()) return;
    
    if (!isConnected) {
      connect();
    }
    
    // Add user message to chat
    setChatMessages(prev => [
      ...prev,
      {
        id: `user-text-${Date.now()}`,
        text: textInput,
        isUser: true,
        timestamp: new Date(),
      }
    ]);
    
    // Send message via API
    sendTextMessage(textInput);
    
    // Clear input field
    setTextInput('');
  };

  // Handle text input keypress
  const handleTextInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendTextMessage();
    }
  };

  // Get button text based on state
  const getButtonText = () => {
    if (!isConnected) return 'Connect';
    if (isListening) return 'Stop';
    return 'Start';
  };

  // Draw audio visualization
  useEffect(() => {
    if (!canvasRef.current || !audioStats) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const drawVisualization = () => {
      const width = canvas.width;
      const height = canvas.height;
      
      // Clear canvas
      ctx.clearRect(0, 0, width, height);
      
      if (isListening) {
        // Draw audio level
        const level = audioStats?.level || 0;
        const barWidth = 3;
        const barSpacing = 1;
        const barCount = Math.floor(width / (barWidth + barSpacing));
        const barHeightMultiplier = height * 0.8;
        
        // First gradient for not speaking
        const baseGradient = ctx.createLinearGradient(0, height, 0, 0);
        baseGradient.addColorStop(0, '#4a90e2');
        baseGradient.addColorStop(1, '#64b5f6');
        
        // Second gradient for speaking
        const activeGradient = ctx.createLinearGradient(0, height, 0, 0);
        activeGradient.addColorStop(0, '#4CAF50');
        activeGradient.addColorStop(1, '#81C784');
        
        ctx.fillStyle = audioStats?.isSpeaking ? activeGradient : baseGradient;
        
        for (let i = 0; i < barCount; i++) {
          // Create a "sound wave" effect
          const x = i * (barWidth + barSpacing);
          const amplitude = level * barHeightMultiplier;
          const variance = Math.sin(i * 0.2 + Date.now() * 0.005) * amplitude * 0.3;
          const barHeight = Math.max(2, amplitude + variance);
          
          ctx.fillRect(x, height - barHeight, barWidth, barHeight);
        }
      } else if (isPlaying) {
        // Draw a different visualization for playback
        const time = Date.now() * 0.001;
        const waveCount = 3;
        
        ctx.strokeStyle = '#4CAF50';
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        for (let x = 0; x < width; x++) {
          const t = x / width;
          const y = height / 2 + 
                   Math.sin(t * Math.PI * 2 * waveCount + time * 3) * (height * 0.2) + 
                   Math.sin(t * Math.PI * 2 * waveCount * 2 + time * 5) * (height * 0.05);
          
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        
        ctx.stroke();
      } else {
        // Draw idle state
        ctx.strokeStyle = '#ccc';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, height / 2);
        ctx.lineTo(width, height / 2);
        ctx.stroke();
      }
    };
    
    const animate = () => {
      drawVisualization();
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isListening, isPlaying, audioStats]);

  return (
    <div className={`prim-voices-advanced-container ${containerClassName}`} style={{ 
      borderRadius: '12px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
      maxWidth: '500px',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      height: '600px',
      backgroundColor: '#fff',
      border: '1px solid #e0e0e0',
    }}>
      {/* Header */}
      <div style={{ 
        padding: '16px',
        backgroundColor: '#f8f8f8',
        borderBottom: '1px solid #e0e0e0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ fontWeight: 'bold' }}>
          {agentName}
        </div>
        <div style={{
          fontSize: '12px',
          color: isConnected ? '#4CAF50' : '#e25555',
          display: 'flex',
          alignItems: 'center'
        }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: isConnected ? '#4CAF50' : '#e25555',
            marginRight: '4px'
          }} />
          {isConnected ? 'Connected' : 'Disconnected'}
        </div>
      </div>
      
      {/* Chat messages */}
      <div 
        ref={chatContainerRef}
        className={`prim-voices-chat ${chatClassName}`} 
        style={{
          padding: '16px',
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}
      >
        {chatMessages.map((msg) => (
          <div 
            key={msg.id}
            style={{
              alignSelf: msg.isUser ? 'flex-end' : 'flex-start',
              maxWidth: '75%',
              padding: '12px 16px',
              borderRadius: msg.isUser ? '18px 18px 0 18px' : '18px 18px 18px 0',
              backgroundColor: msg.isUser ? '#E3F2FD' : '#f0f0f0',
              color: '#333',
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
            }}
          >
            <div style={{ 
              fontWeight: 'bold', 
              fontSize: '12px', 
              marginBottom: '4px',
              color: msg.isUser ? '#1976D2' : '#555'
            }}>
              {msg.isUser ? userName : agentName}
            </div>
            <div>{msg.text}</div>
            <div style={{ fontSize: '10px', textAlign: 'right', marginTop: '4px', color: '#888' }}>
              {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        ))}
        
        {error && (
          <div style={{
            alignSelf: 'center',
            padding: '8px 16px',
            borderRadius: '16px',
            backgroundColor: '#ffebee',
            color: '#c62828',
            fontSize: '12px',
            margin: '8px 0',
            maxWidth: '80%',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}
      </div>
      
      {/* Audio visualization */}
      <div style={{ 
        padding: '8px 16px',
        borderTop: '1px solid #e0e0e0',
        backgroundColor: '#f8f8f8',
      }}>
        <canvas 
          ref={canvasRef}
          width={468}
          height={60}
          style={{ 
            width: '100%', 
            height: '60px',
            backgroundColor: '#fff',
            borderRadius: '8px'
          }}
        />
      </div>
      
      {/* Control bar */}
      <div style={{ 
        padding: '16px',
        borderTop: '1px solid #e0e0e0',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <button
          className={`prim-voices-button ${buttonClassName}`}
          onClick={handleToggleMicrophone}
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            border: 'none',
            backgroundColor: isListening ? '#e25555' : '#4CAF50',
            color: 'white',
            fontWeight: 'bold',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
            flexShrink: 0
          }}
        >
          {isListening ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
              <line x1="12" y1="19" x2="12" y2="22"></line>
            </svg>
          )}
        </button>
        
        <div style={{
          flex: 1,
          display: 'flex',
          gap: '8px'
        }}>
          <input
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            onKeyPress={handleTextInputKeyPress}
            placeholder="Type a message..."
            style={{
              flex: 1,
              borderRadius: '24px',
              border: '1px solid #e0e0e0',
              padding: '12px 16px',
              fontSize: '14px',
              outline: 'none',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1) inset'
            }}
          />
          <button
            onClick={handleSendTextMessage}
            disabled={!textInput.trim()}
            style={{
              borderRadius: '50%',
              border: 'none',
              backgroundColor: textInput.trim() ? '#1976D2' : '#e0e0e0',
              color: 'white',
              width: '48px',
              height: '48px',
              cursor: textInput.trim() ? 'pointer' : 'default',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: textInput.trim() ? '0 2px 8px rgba(0, 0, 0, 0.2)' : 'none',
              transition: 'background-color 0.2s ease',
              flexShrink: 0
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdvancedAudioConversation; 
