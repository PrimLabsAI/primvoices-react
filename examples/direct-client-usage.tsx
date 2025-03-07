import React, { useEffect, useRef, useState } from 'react';
import { WebSocketClient, AudioStats } from '../src';

export const DirectClientExample: React.FC = () => {
  const clientRef = useRef<WebSocketClient | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [audioStats, setAudioStats] = useState<AudioStats | null>(null);

  // Initialize WebSocketClient
  useEffect(() => {
    // Create the client
    const client = new WebSocketClient({
      agentId: 'your-agent-id',
      versionStatus: 'staged',
      debug: true,
    });

    // Set up callbacks
    client.setCallbacks({
      onOpen: () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        setError(null);
      },
      onClose: () => {
        console.log('WebSocket disconnected');
        setIsConnected(false);
        setIsListening(false);
        setIsPlaying(false);
      },
      onError: () => {
        console.error('WebSocket error');
        setError('Connection error occurred');
      },
      onMessage: (message) => {
        console.log('Message received:', message);
        setMessages(prev => [...prev, message]);
      },
      onListeningStart: () => {
        console.log('Started listening');
        setIsListening(true);
      },
      onListeningStop: () => {
        console.log('Stopped listening');
        setIsListening(false);
      },
      onAudioStart: () => {
        console.log('Started playing audio');
        setIsPlaying(true);
      },
      onAudioStop: () => {
        console.log('Stopped playing audio');
        setIsPlaying(false);
      },
      onAudioStats: (stats) => {
        // Update audio level visualization
        setAudioStats(stats);
      },
    });

    // Store the client instance
    clientRef.current = client;

    // Clean up on component unmount
    return () => {
      if (clientRef.current) {
        clientRef.current.disconnect();
      }
    };
  }, []);

  // Connect to the server
  const handleConnect = () => {
    if (clientRef.current && !isConnected) {
      clientRef.current.connect();
    }
  };

  // Disconnect from the server
  const handleDisconnect = () => {
    if (clientRef.current && isConnected) {
      clientRef.current.disconnect();
    }
  };

  // Start listening (recording from microphone)
  const handleStartListening = async () => {
    if (clientRef.current && isConnected && !isListening) {
      try {
        await clientRef.current.startListening();
      } catch (err) {
        setError('Error starting microphone: ' + (err instanceof Error ? err.message : String(err)));
      }
    }
  };

  // Stop listening
  const handleStopListening = () => {
    if (clientRef.current && isListening) {
      clientRef.current.stopListening();
    }
  };

  // Clear messages
  const handleClearMessages = () => {
    setMessages([]);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Direct WebSocketClient Usage Example</h1>
      <p>This example shows how to use the WebSocketClient directly without React components.</p>

      {/* Connection controls */}
      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={handleConnect}
          disabled={isConnected}
          style={{
            padding: '8px 16px',
            marginRight: '10px',
            backgroundColor: isConnected ? '#ccc' : '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isConnected ? 'default' : 'pointer',
          }}
        >
          Connect
        </button>
        <button
          onClick={handleDisconnect}
          disabled={!isConnected}
          style={{
            padding: '8px 16px',
            backgroundColor: !isConnected ? '#ccc' : '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: !isConnected ? 'default' : 'pointer',
          }}
        >
          Disconnect
        </button>
        <span style={{ marginLeft: '15px', color: isConnected ? 'green' : 'red' }}>
          {isConnected ? 'Connected' : 'Disconnected'}
        </span>
      </div>

      {/* Microphone controls */}
      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={isListening ? handleStopListening : handleStartListening}
          disabled={!isConnected}
          style={{
            padding: '8px 16px',
            backgroundColor: !isConnected
              ? '#ccc'
              : isListening
              ? '#f44336'
              : '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: !isConnected ? 'default' : 'pointer',
          }}
        >
          {isListening ? 'Stop Listening' : 'Start Listening'}
        </button>
        <span style={{ marginLeft: '15px' }}>
          {isListening && (
            <span style={{ color: '#2196F3' }}>Listening...</span>
          )}
          {isPlaying && (
            <span style={{ color: '#9c27b0', marginLeft: '10px' }}>Playing audio...</span>
          )}
        </span>
      </div>

      {/* Audio level visualization */}
      {audioStats && (
        <div style={{ marginBottom: '20px' }}>
          <div style={{ 
            height: '20px', 
            width: `${Math.min(audioStats.level * 100, 100)}%`, 
            backgroundColor: audioStats.isSpeaking ? '#ff9800' : '#4CAF50',
            borderRadius: '3px',
            transition: 'width 0.1s ease-in-out'
          }} />
          <div style={{ fontSize: '12px', marginTop: '5px' }}>
            {audioStats.isSpeaking ? 'Speech detected' : 'No speech detected'}
          </div>
        </div>
      )}

      {/* Error display */}
      {error && (
        <div
          style={{
            padding: '10px',
            marginBottom: '20px',
            backgroundColor: '#ffebee',
            color: '#c62828',
            borderRadius: '4px',
          }}
        >
          Error: {error}
        </div>
      )}

      {/* Messages display */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: '0 0 10px 0' }}>Messages:</h3>
          <button
            onClick={handleClearMessages}
            style={{
              padding: '5px 10px',
              backgroundColor: '#607d8b',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
            }}
          >
            Clear Messages
          </button>
        </div>
        <div
          style={{
            maxHeight: '300px',
            overflowY: 'auto',
            border: '1px solid #ddd',
            borderRadius: '4px',
            padding: '10px',
          }}
        >
          {messages.length === 0 ? (
            <p style={{ color: '#757575' }}>No messages yet</p>
          ) : (
            messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  padding: '8px',
                  margin: '5px 0',
                  backgroundColor: '#f5f5f5',
                  borderRadius: '4px',
                }}
              >
                {msg}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Technical notes */}
      <div
        style={{
          padding: '10px',
          backgroundColor: '#e3f2fd',
          borderRadius: '4px',
          fontSize: '14px',
        }}
      >
        <h4 style={{ margin: '0 0 10px 0' }}>Implementation Notes:</h4>
        <ul style={{ margin: '0', paddingLeft: '20px' }}>
          <li>WebSocketClient is initialized in useEffect</li>
          <li>Callbacks are registered to update React state</li>
          <li>The client instance is stored in a ref to persist across renders</li>
          <li>Cleanup is handled when the component unmounts</li>
        </ul>
      </div>
    </div>
  );
};

export default DirectClientExample; 
