# PrimVoices React Integration

A React library for integrating PrimVoices Agent functionality into your applications. This library provides a WebSocket-based client for real-time audio communication with the PrimVoices API.

## Features

- 🎤 Real-time microphone input capture
- 🔊 High-quality audio playback
- 📊 Audio level monitoring and speech detection
- ⚡ WebSocket-based communication
- 🎯 React Context integration

## Installation

```bash
npm install primvoices-react
# or
yarn add primvoices-react
```

## Quick Start

```jsx
import { PrimVoicesProvider, usePrimVoices } from 'primvoices-react';

// Configure the provider
const config = {
  agentId: 'your-agent-id',
  version: 'staged',
  logLevel: 'ERROR'
};

// Wrap your app with the provider
function App() {
  return (
    <PrimVoicesProvider config={config} autoConnect={true}>
      <YourComponent />
    </PrimVoicesProvider>
  );
}

// Use the hook in your components
function YourComponent() {
  const {
    connect,
    disconnect,
    startListening,
    stopListening,
    sendTextEvent,
    isConnected,
    isListening,
    isPlaying,
    audioStats,
    error
  } = usePrimVoices();

  // Your component logic here
}
```

## API Reference

### PrimVoicesProvider

The main provider component that sets up the WebSocket client and context.

#### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| config | WebSocketClientConfig | Yes | Configuration for the WebSocket client |
| autoConnect | boolean | No | Whether to connect automatically on mount |
| children | ReactNode | Yes | Child components |

#### WebSocketClientConfig

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| agentId | string | Yes | - | Your PrimVoices agent ID |
| version | string | No | 'staged' | API version to use |
| logLevel | 'DEBUG' \| 'INFO' \| 'WARN' \| 'ERROR' | No | 'ERROR' | Logging level |

### usePrimVoices Hook

The hook provides access to all PrimVoices functionality.

#### Returns

| Property | Type | Description |
|----------|------|-------------|
| connect | () => void | Connect to the WebSocket server |
| disconnect | () => void | Disconnect from the WebSocket server |
| startListening | () => Promise<void> | Start capturing audio from microphone |
| stopListening | () => void | Stop capturing audio from microphone |
| sendTextEvent | (text: string) => void | Send a text message to the server |
| isConnected | boolean | Connection status |
| isListening | boolean | Microphone capture status |
| isPlaying | boolean | Audio playback status |
| audioStats | AudioStats \| null | Current audio statistics |
| error | string \| null | Error message if any |

#### AudioStats Interface

```typescript
interface AudioStats {
  level: number;        // Audio level (0-1)
  isSpeaking: boolean;  // Speech detection status
  isPlayback?: boolean; // Whether stats are for playback
}
```

## Technical Details

### Audio Processing

- Input audio is captured at the system's native sample rate
- Automatically downsampled to 16kHz for transmission
- Converted to μ-law encoding for efficient transfer
- Real-time audio level monitoring and speech detection
- Supports both microphone input and audio playback

### WebSocket Communication

- Bi-directional audio streaming
- Automatic reconnection handling
- Session management with unique call and stream IDs
- Support for text events
- Error handling and status monitoring

## Example Usage

```jsx
function VoiceChat() {
  const {
    connect,
    startListening,
    stopListening,
    isConnected,
    isListening,
    audioStats
  } = usePrimVoices();

  useEffect(() => {
    // Connect on component mount
    connect();
    return () => disconnect();
  }, []);

  return (
    <div>
      <button
        onClick={() => isListening ? stopListening() : startListening()}
      >
        {isListening ? 'Stop' : 'Start'} Listening
      </button>
      
      {audioStats && (
        <div>
          Audio Level: {audioStats.level}
          Speaking: {audioStats.isSpeaking ? 'Yes' : 'No'}
        </div>
      )}
    </div>
  );
}
```

## Best Practices

1. Always wrap your application or the relevant component tree with `PrimVoicesProvider`
2. Handle connection errors appropriately
3. Clean up resources by calling `disconnect` when done
4. Monitor `audioStats` for audio level visualization
5. Use `isConnected` status to show connection state
6. Handle microphone permissions appropriately

## Browser Support

- Chrome 74+
- Firefox 75+
- Safari 14.1+
- Edge 79+

Requires browser support for:
- WebSocket API
- Web Audio API
- MediaDevices API
- AudioWorklet (with fallback to ScriptProcessorNode)

## License

MIT License
