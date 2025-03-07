import React, { useEffect, useRef } from 'react';
import { usePrimVoices } from './PrimVoicesProviderContext';

interface HeadlessAudioConversationProps {
  onConnect?: () => void;
  onDisconnect?: () => void;
  onListeningStart?: () => void;
  onListeningStop?: () => void;
  onPlayingStart?: () => void;
  onPlayingStop?: () => void;
  onMessage?: (message: string) => void;
  onError?: (error: string) => void;
  autoConnect?: boolean;
  autoStartListening?: boolean;
}

/**
 * HeadlessAudioConversation
 * 
 * A component that provides audio conversation functionality without any UI.
 * Use this component when you want to implement your own custom UI.
 */
export const HeadlessAudioConversation: React.FC<HeadlessAudioConversationProps> = ({
  onConnect,
  onDisconnect,
  onListeningStart,
  onListeningStop,
  onPlayingStart,
  onPlayingStop,
  onMessage,
  onError,
  autoConnect = false,
  autoStartListening = false,
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
    error,
  } = usePrimVoices();

  // Track the previous states to detect changes
  const prevIsConnected = useRef(isConnected);
  const prevIsListening = useRef(isListening);
  const prevIsPlaying = useRef(isPlaying);
  const prevMessagesLength = useRef(messages.length);
  const prevError = useRef(error);

  // Auto-connect if specified
  useEffect(() => {
    if (autoConnect && !isConnected) {
      connect();
    }
  }, [autoConnect, connect, isConnected]);

  // Auto-start listening if specified and connected
  useEffect(() => {
    if (autoStartListening && isConnected && !isListening) {
      startListening();
    }
  }, [autoStartListening, isConnected, isListening, startListening]);

  // Trigger callbacks on state changes
  useEffect(() => {
    // Connection state changed
    if (prevIsConnected.current !== isConnected) {
      if (isConnected && onConnect) {
        onConnect();
      } else if (!isConnected && onDisconnect) {
        onDisconnect();
      }
      prevIsConnected.current = isConnected;
    }

    // Listening state changed
    if (prevIsListening.current !== isListening) {
      if (isListening && onListeningStart) {
        onListeningStart();
      } else if (!isListening && onListeningStop) {
        onListeningStop();
      }
      prevIsListening.current = isListening;
    }

    // Playing state changed
    if (prevIsPlaying.current !== isPlaying) {
      if (isPlaying && onPlayingStart) {
        onPlayingStart();
      } else if (!isPlaying && onPlayingStop) {
        onPlayingStop();
      }
      prevIsPlaying.current = isPlaying;
    }

    // New message received
    if (prevMessagesLength.current !== messages.length && messages.length > 0) {
      const newMessage = messages[messages.length - 1];
      if (onMessage) {
        onMessage(newMessage);
      }
      prevMessagesLength.current = messages.length;
    }

    // Error changed
    if (prevError.current !== error && error && onError) {
      onError(error);
      prevError.current = error;
    }
  }, [
    isConnected,
    isListening,
    isPlaying,
    messages,
    error,
    onConnect,
    onDisconnect,
    onListeningStart,
    onListeningStop,
    onPlayingStart,
    onPlayingStop,
    onMessage,
    onError,
  ]);

  // This is a headless component, so it doesn't render anything
  return null;
};

export default HeadlessAudioConversation; 
