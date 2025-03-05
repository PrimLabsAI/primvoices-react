# PrimVoices React

A React client library for integrating with the PrimVoices WebSocket API. This library provides components and utilities for creating voice-enabled applications that can send and receive audio over WebSockets.

## Features

- 🎤 Send microphone audio to PrimVoices API
- 🔊 Receive and play audio responses
- 💬 Handle conversation transcriptions
- 📊 Audio visualization and speech detection
- 🧩 Multiple components from headless to fully styled
- 🔌 Easy integration with existing React applications

## Installation

```bash
npm install primvoices-react
```

## Basic Usage

Here's a simple example of how to use the PrimVoices React components:

```jsx
import React from 'react';
import { PrimVoicesProvider, BasicAudioConversation } from 'primvoices-react';

function App() {
  return (
    <PrimVoicesProvider
      config={{
        serverUrl: 'wss://your-primvoices-server.com/socket',
        agentId: 'your-agent-id',
        voiceId: 'your-voice-id',
      }}
    >
      <div>
        <h1>Voice Chat Example</h1>
        <BasicAudioConversation 
          autoConnect={true}
          welcomeMessage="Hello! Click the button to start talking."
        />
      </div>
    </PrimVoicesProvider>
  );
}

export default App;
```

## Running the Examples

To run the examples and see the library in action:

```bash
git clone https://github.com/PrimLabsAI/primvoices-react.git
cd primvoices-react
npm install
npm run examples
```

This will start a development server and open the examples in your browser.

The examples showcase different components and usage patterns:
- Basic usage of the three main components
- Direct WebSocket client usage
- Hook-based custom UI components
- Configuration options

See the [examples directory](./examples/) for more details.

## Available Components

### 1. PrimVoicesProvider

The context provider that needs to wrap all PrimVoices components:

```jsx
<PrimVoicesProvider
  config={{
    agentId: 'default',
    voiceId: 'default',
    debug: false,
  }}
  autoConnect={false}
>
  {/* Your components here */}
</PrimVoicesProvider>
```

### 2. HeadlessAudioConversation

A headless component (no UI) that provides functionality you can build upon:

```jsx
<HeadlessAudioConversation
  autoConnect={true}
  autoStartListening={false}
  onConnect={() => console.log('Connected')}
  onDisconnect={() => console.log('Disconnected')}
  onListeningStart={() => console.log('Started listening')}
  onListeningStop={() => console.log('Stopped listening')}
  onPlayingStart={() => console.log('Started playing')}
  onPlayingStop={() => console.log('Stopped playing')}
  onMessage={(message) => console.log('New message:', message)}
  onError={(error) => console.error('Error:', error)}
/>
```

### 3. BasicAudioConversation

A simple component with minimal UI:

```jsx
<BasicAudioConversation
  autoConnect={true}
  welcomeMessage="Hello! I'm ready to chat."
  containerClassName="custom-container"
  buttonClassName="custom-button"
  messageClassName="custom-message"
  errorClassName="custom-error"
  onMessage={(message) => console.log('New message:', message)}
  onError={(error) => console.error('Error:', error)}
/>
```

### 4. AdvancedAudioConversation

A full-featured component with chat interface and audio visualization:

```jsx
<AdvancedAudioConversation
  autoConnect={true}
  welcomeMessage="Hello! How can I help you today?"
  agentName="Assistant"
  userName="You"
  containerClassName="custom-container"
  chatClassName="custom-chat"
  buttonClassName="custom-button"
  onMessage={(message) => console.log('New message:', message)}
  onError={(error) => console.error('Error:', error)}
/>
```

## Direct WebSocket Client Usage

If you need more control, you can use the WebSocketClient directly:

```jsx
import { WebSocketClient } from 'primvoices-react';

const client = new WebSocketClient({
  serverUrl: 'wss://your-server.com/socket',
  agentId: 'default',
  voiceId: 'default',
  debug: true,
});

// Set up callbacks
client.setCallbacks({
  onOpen: () => console.log('Connected'),
  onClose: () => console.log('Disconnected'),
  onError: () => console.log('Error occurred'),
  onMessage: (message) => console.log('Message received:', message),
  onListeningStart: () => console.log('Started listening'),
  onListeningStop: () => console.log('Stopped listening'),
  onAudioStart: () => console.log('Started playing audio'),
  onAudioStop: () => console.log('Stopped playing audio'),
  onAudioStats: (stats) => console.log('Audio stats:', stats),
});

// Connect to the server
client.connect();

// Start listening (recording from microphone)
client.startListening();

// Stop listening
client.stopListening();

// Disconnect
client.disconnect();
```

## Custom Integration with usePrimVoices Hook

For advanced use cases, you can use the hook to access the PrimVoices context:

```jsx
import React from 'react';
import { PrimVoicesProvider, usePrimVoices } from 'primvoices-react';

function MyCustomComponent() {
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

  return (
    <div>
      <button onClick={connect} disabled={isConnected}>
        Connect
      </button>
      <button onClick={disconnect} disabled={!isConnected}>
        Disconnect
      </button>
      <button 
        onClick={isListening ? stopListening : startListening}
        disabled={!isConnected}
      >
        {isListening ? 'Stop Listening' : 'Start Listening'}
      </button>
      
      <div>
        <h3>Messages:</h3>
        {messages.map((message, index) => (
          <div key={index}>{message}</div>
        ))}
      </div>
      
      {error && <div style={{ color: 'red' }}>Error: {error}</div>}
    </div>
  );
}

function App() {
  return (
    <PrimVoicesProvider
      config={{
        serverUrl: 'wss://your-server.com/socket',
        agentId: 'default',
        voiceId: 'default',
      }}
    >
      <MyCustomComponent />
    </PrimVoicesProvider>
  );
}

export default App;
```

## Configuration Options

The `WebSocketClientConfig` interface supports the following options:

| Property    | Type    | Description                                            | Default                    |
|-------------|---------|--------------------------------------------------------|----------------------------|
| serverUrl   | string  | WebSocket server URL                                   | 'wss://tts.primvoices.com' |
| agentId     | string  | Identifier for the AI agent                            | 'default'                  |
| voiceId     | string  | Voice to use for responses                             | 'default'                  |
| debug       | boolean | Enable debug logging                                   | false                      |

## Development

```bash
# Clone the repository
git clone https://github.com/PrimLabsAI/primvoices-react.git

# Install dependencies
cd primvoices-react
npm install

# Build the library
npm run build

# Run the examples
npm run examples

# Run tests
npm test
```

## Browser Compatibility

This library requires support for the Web Audio API and WebSockets. It has been tested and works with:

- Chrome 76+
- Firefox 70+
- Safari 13+
- Edge 79+

## License

MIT 
