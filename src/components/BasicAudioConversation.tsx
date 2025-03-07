import React, { useState, useEffect } from 'react';
import { usePrimVoices } from './PrimVoicesProviderContext';

interface BasicAudioConversationProps {
  onMessage?: (message: string) => void;
  onError?: (error: string) => void;
  autoConnect?: boolean;
  welcomeMessage?: string;
  containerClassName?: string;
  buttonClassName?: string;
  messageClassName?: string;
  errorClassName?: string;
}

/**
 * BasicAudioConversation
 * 
 * A simple component that provides audio conversation functionality with minimal UI.
 * This component renders a button to start/stop listening and displays messages.
 */
export const BasicAudioConversation: React.FC<BasicAudioConversationProps> = ({
  onMessage,
  onError,
  autoConnect = false,
  welcomeMessage = 'Click the button to start talking',
  containerClassName = '',
  buttonClassName = '',
  messageClassName = '',
  errorClassName = '',
}) => {
  const {
    connect,
    disconnect,
    startListening,
    stopListening,
    isConnected,
    isListening,
    isPlaying,
    messages,
    audioStats,
    error,
  } = usePrimVoices();

  const [lastMessage, setLastMessage] = useState<string>(welcomeMessage);

  // Auto-connect if specified
  useEffect(() => {
    if (autoConnect && !isConnected) {
      connect();
    }
  }, [autoConnect, connect, isConnected]);

  // Handle new messages
  useEffect(() => {
    if (messages.length > 0) {
      const newMessage = messages[messages.length - 1];
      setLastMessage(newMessage);
      
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
    }
  };

  // Get button text based on state
  const getButtonText = () => {
    if (!isConnected) return 'Connect';
    if (isListening) return 'Stop Listening';
    return 'Start Listening';
  };

  // Get button color based on state
  const getButtonStyle = () => {
    if (!isConnected) return { backgroundColor: '#4a90e2' };
    if (isListening) return { backgroundColor: '#e25555' };
    return { backgroundColor: '#4CAF50' };
  };

  // Calculate audio level visual
  const getAudioLevelStyle = () => {
    if (!isListening || !audioStats) return { width: '0%' };
    return { width: `${Math.min(100, audioStats.level * 100)}%` };
  };

  return (
    <div className={`prim-voices-container ${containerClassName}`} style={{ 
      padding: '16px',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
      maxWidth: '400px',
      margin: '0 auto'
    }}>
      {/* Audio level indicator */}
      <div style={{ 
        height: '10px', 
        backgroundColor: '#f0f0f0', 
        borderRadius: '5px',
        overflow: 'hidden',
        marginBottom: '16px'
      }}>
        <div style={{
          height: '100%',
          backgroundColor: isListening ? '#4CAF50' : '#4a90e2',
          borderRadius: '5px',
          transition: 'width 0.1s ease-out',
          ...getAudioLevelStyle()
        }} />
      </div>

      {/* Message display */}
      <div className={`prim-voices-message ${messageClassName}`} style={{
        padding: '16px',
        backgroundColor: '#f9f9f9',
        borderRadius: '8px',
        marginBottom: '16px',
        minHeight: '60px'
      }}>
        {lastMessage}
      </div>

      {/* Error display */}
      {error && (
        <div className={`prim-voices-error ${errorClassName}`} style={{
          padding: '8px',
          backgroundColor: '#ffebee',
          color: '#c62828',
          borderRadius: '4px',
          marginBottom: '16px'
        }}>
          {error}
        </div>
      )}

      {/* Control button */}
      <button
        className={`prim-voices-button ${buttonClassName}`}
        onClick={handleToggleMicrophone}
        style={{
          padding: '12px 24px',
          border: 'none',
          borderRadius: '4px',
          color: 'white',
          fontWeight: 'bold',
          cursor: 'pointer',
          width: '100%',
          ...getButtonStyle()
        }}
      >
        {getButtonText()}
      </button>

      {/* Status indicators */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        marginTop: '8px',
        fontSize: '12px',
        color: '#666'
      }}>
        <div>
          {isConnected ? '✓ Connected' : '✗ Disconnected'}
        </div>
        <div>
          {isPlaying ? '🔊 Playing' : ''}
        </div>
      </div>
    </div>
  );
};

export default BasicAudioConversation; 
