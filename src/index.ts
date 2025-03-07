// Export WebSocket client and types
export { WebSocketClient } from './utils/WebSocketClient';
export type { 
  WebSocketClientConfig, 
  AudioStats, 
  AudioDataCallback, 
  MessageCallback, 
  StatusCallback, 
  AudioStatsCallback
} from './utils/WebSocketClient';

// Export context provider and hook
export { 
  PrimVoicesProvider, 
  usePrimVoices 
} from './components/PrimVoicesProviderContext';

// Export components
export { HeadlessAudioConversation } from './components/HeadlessAudioConversation';
export { BasicAudioConversation } from './components/BasicAudioConversation';
export { AdvancedAudioConversation } from './components/AdvancedAudioConversation';
