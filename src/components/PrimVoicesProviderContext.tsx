import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { WebSocketClient, WebSocketClientConfig, AudioStats } from '../utils/WebSocketClient';

// Define the context shape
interface PrimVoicesContextType {
  connect: () => void;
  disconnect: () => void;
  startListening: () => Promise<void>;
  stopListening: () => void;
  sendTextMessage: (text: string) => void;
  isConnected: boolean;
  isListening: boolean;
  isPlaying: boolean;
  messages: string[];
  audioStats: AudioStats | null;
  error: string | null;
}

// Create the context with default values
const PrimVoicesContext = createContext<PrimVoicesContextType>({
  connect: () => {},
  disconnect: () => {},
  startListening: async () => {},
  stopListening: () => {},
  sendTextMessage: () => {},
  isConnected: false,
  isListening: false,
  isPlaying: false,
  messages: [],
  audioStats: null,
  error: null,
});

// Hook for using the context
export const usePrimVoices = () => useContext(PrimVoicesContext);

interface PrimVoicesProviderProps {
  children: React.ReactNode;
  config: WebSocketClientConfig;
  autoConnect?: boolean;
}

export const PrimVoicesProvider: React.FC<PrimVoicesProviderProps> = ({
  children,
  config,
  autoConnect = false,
}) => {
  // Client reference
  const clientRef = useRef<WebSocketClient | null>(null);
  
  // State
  const [isConnected, setIsConnected] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);
  const [audioStats, setAudioStats] = useState<AudioStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Initialize client on mount
  useEffect(() => {
    try {
      clientRef.current = new WebSocketClient(config);
      
      // Setup callbacks
      clientRef.current.setCallbacks({
        onOpen: () => {
          setIsConnected(true);
          setError(null);
        },
        onClose: () => {
          setIsConnected(false);
        },
        onError: () => {
          setError('Connection error occurred');
        },
        onMessage: (message) => {
          setMessages((prev) => [...prev, message]);
        },
        onListeningStart: () => {
          setIsListening(true);
        },
        onListeningStop: () => {
          setIsListening(false);
        },
        onAudioStart: () => {
          setIsPlaying(true);
        },
        onAudioStop: () => {
          setIsPlaying(false);
        },
        onAudioStats: (stats) => {
          setAudioStats(stats);
        },
      });
      
      // Connect automatically if configured
      if (autoConnect) {
        clientRef.current.connect();
      }
      
      // Cleanup on unmount
      return () => {
        if (clientRef.current) {
          clientRef.current.disconnect();
          clientRef.current = null;
        }
      };
    } catch (err) {
      setError('Failed to initialize client');
      console.error('Error initializing PrimVoices client:', err);
    }
  }, [config, autoConnect]);

  // Connect to websocket
  const connect = useCallback(() => {
    if (clientRef.current) {
      try {
        clientRef.current.connect();
      } catch (err) {
        setError('Failed to connect');
        console.error('Error connecting to PrimVoices:', err);
      }
    } else {
      setError('Client not initialized');
    }
  }, []);

  // Disconnect from websocket
  const disconnect = useCallback(() => {
    if (clientRef.current) {
      clientRef.current.disconnect();
    }
  }, []);

  // Start listening (recording from microphone)
  const startListening = useCallback(async () => {
    if (clientRef.current) {
      try {
        await clientRef.current.startListening();
      } catch (err) {
        setError('Failed to start microphone');
        console.error('Error starting microphone:', err);
      }
    } else {
      setError('Client not initialized');
    }
  }, []);

  // Stop listening
  const stopListening = useCallback(() => {
    if (clientRef.current) {
      clientRef.current.stopListening();
    }
  }, []);

  // Send text message
  const sendTextMessage = useCallback((text: string) => {
    if (clientRef.current && isConnected) {
      try {
        clientRef.current.sendText(text);
      } catch (err) {
        setError('Failed to send message');
        console.error('Error sending text message:', err);
      }
    } else {
      setError('Client not connected');
    }
  }, [isConnected]);

  // Clear messages
  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  // The context value to provide
  const contextValue: PrimVoicesContextType = {
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
  };

  return (
    <PrimVoicesContext.Provider value={contextValue}>
      {children}
    </PrimVoicesContext.Provider>
  );
};

export default PrimVoicesProvider; 
