import React from 'react';
import {
  PrimVoicesProvider,
  BasicAudioConversation,
  HeadlessAudioConversation,
  AdvancedAudioConversation
} from '../src';

// 1. Setup with default basic component
export const BasicExample: React.FC = () => {
  return (
    <PrimVoicesProvider 
      config={{
        serverUrl: 'ws://localhost:7860/ws',
        agentId: 'your-agent-id',
        versionStatus: 'staged',
        debug: true,
      }}
    >
      <div style={{ padding: '20px' }}>
        <h1>Basic Audio Conversation</h1>
        <BasicAudioConversation 
          autoConnect={true}
          welcomeMessage="Hello! I'm ready to chat. Click the button to start talking."
        />
      </div>
    </PrimVoicesProvider>
  );
};

// 2. Setup with headless component and custom UI
export const CustomExample: React.FC = () => {
  const [isListening, setIsListening] = React.useState(false);
  const [messages, setMessages] = React.useState<string[]>([]);
  const [isConnected, setIsConnected] = React.useState(false);
  
  const handleToggle = () => {
    if (!isConnected) return;
    setIsListening(prev => !prev);
  };
  
  return (
    <PrimVoicesProvider 
      config={{
        agentId: 'your-agent-id',
        versionStatus: 'staged',
        debug: true,
      }}
    >
      <div style={{ padding: '20px' }}>
        <h1>Custom UI with Headless Component</h1>
        
        {/* This headless component provides the functionality */}
        <HeadlessAudioConversation 
          autoConnect={true}
          onConnect={() => setIsConnected(true)}
          onDisconnect={() => setIsConnected(false)}
          onListeningStart={() => setIsListening(true)}
          onListeningStop={() => setIsListening(false)}
          onMessage={(msg) => setMessages(prev => [...prev, msg])}
        />
        
        {/* Your custom UI */}
        <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
          <button 
            onClick={handleToggle}
            disabled={!isConnected}
            style={{
              padding: '10px 20px',
              backgroundColor: isListening ? 'red' : 'green',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: isConnected ? 'pointer' : 'not-allowed',
            }}
          >
            {isListening ? 'Stop Listening' : 'Start Listening'}
          </button>
          
          <div style={{ marginTop: '20px' }}>
            <h3>Messages:</h3>
            <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #eee', padding: '10px' }}>
              {messages.length === 0 ? (
                <p>No messages yet</p>
              ) : (
                messages.map((msg, index) => (
                  <div key={index} style={{ marginBottom: '10px', padding: '10px', backgroundColor: '#f0f0f0' }}>
                    {msg}
                  </div>
                ))
              )}
            </div>
          </div>
          
          <div style={{ marginTop: '10px', fontSize: '12px', color: isConnected ? 'green' : 'red' }}>
            {isConnected ? 'Connected' : 'Disconnected'}
          </div>
        </div>
      </div>
    </PrimVoicesProvider>
  );
};

// 3. Advanced example
export const AdvancedExample: React.FC = () => {
  return (
    <PrimVoicesProvider 
      config={{
        serverUrl: 'ws://localhost:7860/ws',
        agentId: 'your-agent-id',
        versionStatus: 'staged',
        debug: true,
      }}
    >
      <div style={{ padding: '20px' }}>
        <h1>Advanced Audio Conversation</h1>
        <AdvancedAudioConversation 
          autoConnect={true}
          welcomeMessage="Hello! I'm your AI assistant. How can I help you today?"
          agentName="AI Assistant"
          userName="User"
        />
      </div>
    </PrimVoicesProvider>
  );
};

// You can export a component that uses any of these examples
export default function App() {
  return (
    <div>
      <h1>Basic Usage Examples</h1>
      <p style={{ marginBottom: '30px' }}>
        This page demonstrates three different ways to implement voice conversations in your React application.
      </p>
      
      <div style={{ marginBottom: '60px' }}>
        <h2>Example 1: Basic Component</h2>
        <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 500px' }}>
            <h3>Implementation</h3>
            <BasicExample />
          </div>
          <div style={{ flex: '1 1 500px' }}>
            <h3>Code Snippet</h3>
            <div style={{ backgroundColor: '#f8f8f8', padding: '15px', borderRadius: '4px', overflowX: 'auto' as const }}>
              <pre>
                <code>
{`import React from 'react';
import {
  PrimVoicesProvider,
  BasicAudioConversation
} from 'primvoices-react';

export const BasicExample = () => {
  return (
    <PrimVoicesProvider 
      config={{
        agentId: 'your-agent-id',
        versionStatus: 'staged',
        debug: true,
      }}
    >
      <BasicAudioConversation 
        autoConnect={true}
        welcomeMessage="Hello! I'm ready to chat. Click the button to start talking."
      />
    </PrimVoicesProvider>
  );
};`}
                </code>
              </pre>
            </div>
            <h3>Description</h3>
            <p>
              The simplest way to add voice capabilities to your app. The <code>BasicAudioConversation</code> component 
              provides a ready-to-use UI with a microphone button and message display.
            </p>
            <h3>Available Options</h3>
            <ul>
              <li><strong>autoConnect</strong>: Automatically connects to the WebSocket server when the component mounts</li>
              <li><strong>welcomeMessage</strong>: Initial message displayed in the conversation</li>
            </ul>
          </div>
        </div>
      </div>
      
      <hr style={{ margin: '40px 0' }} />
      
      <div style={{ marginBottom: '60px' }}>
        <h2>Example 2: Custom UI with Headless Component</h2>
        <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 500px' }}>
            <h3>Implementation</h3>
            <CustomExample />
          </div>
          <div style={{ flex: '1 1 500px' }}>
            <h3>Code Snippet</h3>
            <div style={{ backgroundColor: '#f8f8f8', padding: '15px', borderRadius: '4px', overflowX: 'auto' as const }}>
              <pre>
                <code>
{`import React from 'react';
import {
  PrimVoicesProvider,
  HeadlessAudioConversation
} from 'primvoices-react';

export const CustomExample = () => {
  const [isListening, setIsListening] = React.useState(false);
  const [messages, setMessages] = React.useState([]);
  const [isConnected, setIsConnected] = React.useState(false);
  
  const handleToggle = () => {
    if (!isConnected) return;
    setIsListening(prev => !prev);
  };
  
  return (
    <PrimVoicesProvider 
      config={{
        agentId: 'your-agent-id',
        versionStatus: 'staged',
        debug: true,
      }}
    >
      {/* This headless component provides the functionality */}
      <HeadlessAudioConversation 
        autoConnect={true}
        onConnect={() => setIsConnected(true)}
        onDisconnect={() => setIsConnected(false)}
        onListeningStart={() => setIsListening(true)}
        onListeningStop={() => setIsListening(false)}
        onMessage={(msg) => setMessages(prev => [...prev, msg])}
      />
      
      {/* Your custom UI */}
      <div>
        <button 
          onClick={handleToggle}
          disabled={!isConnected}
        >
          {isListening ? 'Stop Listening' : 'Start Listening'}
        </button>
        
        <div>
          <h3>Messages:</h3>
          <div>
            {messages.map((msg, index) => (
              <div key={index}>{msg}</div>
            ))}
          </div>
        </div>
      </div>
    </PrimVoicesProvider>
  );
};`}
                </code>
              </pre>
            </div>
            <h3>Description</h3>
            <p>
              Create your own UI while using the headless component to handle the voice functionality.
              The <code>HeadlessAudioConversation</code> component provides all the necessary callbacks
              for building a completely custom interface.
            </p>
            <h3>Available Options</h3>
            <ul>
              <li><strong>autoConnect</strong>: Automatically connects to the WebSocket server when the component mounts</li>
              <li><strong>onConnect</strong>: Callback when connection is established</li>
              <li><strong>onDisconnect</strong>: Callback when connection is closed</li>
              <li><strong>onListeningStart</strong>: Callback when listening begins</li>
              <li><strong>onListeningStop</strong>: Callback when listening ends</li>
              <li><strong>onMessage</strong>: Callback when a message is received</li>
            </ul>
          </div>
        </div>
      </div>
      
      <hr style={{ margin: '40px 0' }} />
      
      <div style={{ marginBottom: '60px' }}>
        <h2>Example 3: Advanced Component</h2>
        <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 500px' }}>
            <h3>Implementation</h3>
            <AdvancedExample />
          </div>
          <div style={{ flex: '1 1 500px' }}>
            <h3>Code Snippet</h3>
            <div style={{ backgroundColor: '#f8f8f8', padding: '15px', borderRadius: '4px', overflowX: 'auto' as const }}>
              <pre>
                <code>
{`import React from 'react';
import {
  PrimVoicesProvider,
  AdvancedAudioConversation
} from 'primvoices-react';

export const AdvancedExample = () => {
  return (
    <PrimVoicesProvider 
      config={{
        agentId: 'your-agent-id',
        versionStatus: 'staged',
        debug: true,
      }}
    >
      <AdvancedAudioConversation 
        autoConnect={true}
        welcomeMessage="Hello! I'm your AI assistant. How can I help you today?"
        agentName="AI Assistant"
        userName="User"
      />
    </PrimVoicesProvider>
  );
};`}
                </code>
              </pre>
            </div>
            <h3>Description</h3>
            <p>
              A more feature-rich conversation component with a modern chat interface.
              The <code>AdvancedAudioConversation</code> component provides customizable 
              agent and user names, visual indicators for listening and speaking states,
              and a more polished design.
            </p>
            <h3>Available Options</h3>
            <ul>
              <li><strong>autoConnect</strong>: Automatically connects to the WebSocket server when the component mounts</li>
              <li><strong>welcomeMessage</strong>: Initial message displayed in the conversation</li>
              <li><strong>agentName</strong>: Display name for the AI agent</li>
              <li><strong>userName</strong>: Display name for the user</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 
