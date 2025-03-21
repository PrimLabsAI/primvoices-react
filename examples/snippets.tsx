export const BasicExampleSnippet = `
import React from 'react';
import { PrimVoicesProvider, usePrimVoices } from 'primvoices-react';

const BasicExampleComponent = () => {
  const { connect, disconnect, startListening, stopListening, isConnected, isListening, audioStats } = usePrimVoices();
  
  const onClick = () => {
    if (isConnected) {
      disconnect();
    } else {
      connect();
    }
  };

  const onClickMic = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '10px' }}>
      <button onClick={onClick}>{isConnected ? 'Disconnect' : 'Connect'}</button>
      {isConnected && (
        <button onClick={onClickMic}>{isListening ? 'Stop Listening' : 'Start Listening'}</button>
      )}
      {audioStats && (
        <span>Audio Level: {(audioStats.level * 100).toFixed(0)}%</span>
      )}
    </div>
  );
}

export const BasicExample = () => {
  return (
    <PrimVoicesProvider 
      config={{
        agentId: '8e7367cc-bae3-4ccd-8baf-14824fa4595b',
        version: 'staged',
        logLevel: 'INFO',
      }}
    >
      <BasicExampleComponent />
    </PrimVoicesProvider>
  );
};
`;
