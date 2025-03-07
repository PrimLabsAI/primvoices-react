import React, { useState, useEffect } from 'react';
import { PrimVoicesProvider, usePrimVoices } from '../src';

// Custom component using the usePrimVoices hook
const VoiceChat: React.FC = () => {
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

  const [transcript, setTranscript] = useState<{ text: string; isUser: boolean }[]>([
    { text: 'Hello! How can I help you today?', isUser: false },
  ]);

  // Auto-connect when component mounts
  useEffect(() => {
    if (!isConnected) {
      connect();
    }
    
    return () => {
      if (isConnected) {
        disconnect();
      }
    };
  }, [connect, disconnect, isConnected]);

  // Update transcript when new messages arrive
  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      setTranscript(prev => [...prev, { text: lastMessage, isUser: false }]);
    }
  }, [messages]);

  // Toggle listening state
  const handleToggleListening = async () => {
    if (isListening) {
      stopListening();
      // Simulate user message after stopping listening
      setTranscript(prev => [...prev, { 
        text: 'I just said something (this is a placeholder for actual transcription)',
        isUser: true 
      }]);
    } else {
      await startListening();
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <div 
        style={{ 
          padding: '20px',
          backgroundColor: '#f9f9f9',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0 }}>Voice Chat</h2>
          <div>
            <span 
              style={{ 
                display: 'inline-block',
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: isConnected ? '#4CAF50' : '#f44336',
                marginRight: '5px'
              }} 
            />
            <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
          </div>
        </div>
        
        {/* Conversation area */}
        <div 
          style={{ 
            height: '300px',
            overflowY: 'auto',
            border: '1px solid #ddd',
            borderRadius: '4px',
            padding: '10px',
            marginBottom: '20px',
            backgroundColor: 'white'
          }}
        >
          {transcript.map((entry, index) => (
            <div 
              key={index} 
              style={{
                margin: '8px 0',
                textAlign: entry.isUser ? 'right' : 'left',
              }}
            >
              <div 
                style={{
                  display: 'inline-block',
                  padding: '8px 12px',
                  borderRadius: '16px',
                  maxWidth: '80%',
                  wordBreak: 'break-word',
                  backgroundColor: entry.isUser ? '#e3f2fd' : '#f1f1f1',
                  border: entry.isUser ? '1px solid #bbdefb' : '1px solid #e0e0e0',
                }}
              >
                {entry.text}
              </div>
            </div>
          ))}
        </div>

        {/* Audio level indicator (only when listening or playing) */}
        {(isListening || isPlaying) && audioStats && (
          <div style={{ marginBottom: '15px' }}>
            <div style={{ height: '4px', backgroundColor: '#e0e0e0', borderRadius: '2px', overflow: 'hidden' }}>
              <div 
                style={{ 
                  height: '100%', 
                  width: `${Math.min(audioStats.level * 100, 100)}%`, 
                  backgroundColor: audioStats.isSpeaking ? '#ff9800' : '#2196F3',
                  transition: 'width 0.1s ease-out' 
                }} 
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#757575', marginTop: '2px' }}>
              <span>{isListening ? 'Listening...' : ''}</span>
              <span>{isPlaying ? 'Playing response...' : ''}</span>
              <span>{audioStats.isSpeaking ? 'Speech detected' : ''}</span>
            </div>
          </div>
        )}
        
        {/* Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <button 
            onClick={isConnected ? disconnect : connect}
            style={{
              padding: '10px 15px',
              backgroundColor: isConnected ? '#f44336' : '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            {isConnected ? 'Disconnect' : 'Connect'}
          </button>
          
          <button 
            onClick={handleToggleListening}
            disabled={!isConnected}
            style={{
              padding: '10px 15px',
              backgroundColor: !isConnected 
                ? '#cccccc' 
                : isListening 
                  ? '#f44336' 
                  : '#2196F3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: isConnected ? 'pointer' : 'default',
              flex: 1,
              margin: '0 10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Microphone icon */}
            <svg 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              style={{ marginRight: '8px' }}
            >
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
              <line x1="12" y1="19" x2="12" y2="23"></line>
              <line x1="8" y1="23" x2="16" y2="23"></line>
            </svg>
            {isListening ? 'Stop Listening' : 'Start Listening'}
          </button>
          
          <button
            onClick={() => setTranscript([{ text: 'Hello! How can I help you today?', isUser: false }])}
            style={{
              padding: '10px 15px',
              backgroundColor: '#757575',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Clear Chat
          </button>
        </div>
        
        {/* Error display */}
        {error && (
          <div 
            style={{ 
              marginTop: '15px',
              padding: '10px', 
              backgroundColor: '#ffebee', 
              color: '#c62828',
              borderRadius: '4px',
              fontSize: '14px'
            }}
          >
            Error: {error}
          </div>
        )}
      </div>

      {/* Implementation notes */}
      <div 
        style={{ 
          marginTop: '30px',
          padding: '15px',
          border: '1px solid #e0e0e0',
          borderRadius: '8px',
          backgroundColor: '#f5f5f5',
        }}
      >
        <h3 style={{ margin: '0 0 10px 0', color: '#424242' }}>How this example works:</h3>
        <ul style={{ margin: 0, paddingLeft: '20px', color: '#616161' }}>
          <li>Uses the <code>usePrimVoices</code> hook to access the context</li>
          <li>Auto-connects to the WebSocket server when mounted</li>
          <li>Maintains a transcript of the conversation</li>
          <li>Shows status indicators for connection and audio activity</li>
          <li>Provides controls for connecting, disconnecting, and listening</li>
          <li>This example doesn't handle actual transcription (would come from backend)</li>
        </ul>
      </div>
    </div>
  );
};

// Provider wrapper component
export const HookUsageExample: React.FC = () => {
  return (
    <PrimVoicesProvider 
      config={{
        agentId: 'your-agent-id',
        versionStatus: 'staged',
        debug: true,
      }}
    >
      <div style={{ padding: '20px' }}>
        <h1>usePrimVoices Hook Example</h1>
        <p>This example demonstrates how to use the usePrimVoices hook to build a custom UI.</p>
        <VoiceChat />
      </div>
    </PrimVoicesProvider>
  );
};

export default HookUsageExample; 
