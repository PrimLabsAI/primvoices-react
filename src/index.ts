// Export WebSocket client and types
export { WebSocketClient } from './utils/WebSocketClient';

export type { 
  AudioDataCallback, 
  AudioStats, 
  AudioStatsCallback,
  StatusCallback, 
  WebSocketClientConfig, 
} from './utils/WebSocketClient';

// Export context provider and hook
export { 
  PrimVoicesProvider, 
  usePrimVoices,
} from './components/PrimVoicesProviderContext';
