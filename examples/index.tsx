import React, { useState } from 'react';

import { BasicExample } from './BasicExample';
import { BasicExampleSnippet } from './snippets';

type ExampleWrapperProps = {
  title: string;
  description: string;
  snippet: string;
  options: { name: string; description: string; default?: string }[];
  children: React.ReactNode;
};

const ExampleWrapper = ({ title, description, snippet, options, children }: ExampleWrapperProps) => {
  const [showCode, setShowCode] = useState(false);
  
  return (
    <div style={styles.exampleWrapper}>
      <h2 style={styles.exampleTitle}>{title}</h2>
      
      <div style={styles.descriptionBox}>
        <h3 style={styles.descriptionTitle}>Description</h3>
        <p style={styles.descriptionText}>{description}</p>
      </div>

      <div style={styles.tabContainer}>
        <button 
          onClick={() => setShowCode(false)} 
          style={{
            ...styles.tabButton,
            ...(showCode ? {} : styles.activeTabButton)
          }}
        >
          Implementation
        </button>
        <button 
          onClick={() => setShowCode(true)} 
          style={{
            ...styles.tabButton,
            ...(showCode ? styles.activeTabButton : {})
          }}
        >
          Code Snippet
        </button>
      </div>
      
      <div style={styles.contentBox}>
        {showCode ? (
          <div style={styles.codeSnippet}>
            <pre>
              <code>{snippet}</code>
            </pre>
          </div>
        ) : (
          <div style={styles.implementationContainer}>
            {children}
          </div>
        )}
      </div>
      
      {options.length > 0 && (
        <div style={styles.optionsContainer}>
          <h3 style={styles.optionsTitle}>Available Options</h3>
          <table style={styles.optionsTable}>
            <thead>
              <tr>
                <th style={styles.optionHeader}>Option</th>
                <th style={styles.optionHeader}>Description</th>
                <th style={styles.optionHeader}>Default</th>
              </tr>
            </thead>
            <tbody>
              {options.map((option, index) => (
                <tr key={index} style={index % 2 === 0 ? styles.optionRowEven : styles.optionRowOdd}>
                  <td style={styles.optionName}>{option.name}</td>
                  <td style={styles.optionDescription}>{option.description}</td>
                  <td style={styles.optionDefault}>{option.default || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// Example navigation component
const ExamplesIndex: React.FC = () => {
  const [activeExample, setActiveExample] = useState<string | null>(null);

  // List of available examples with descriptions, code snippets, and options
  const examples = [
    { 
      id: 'basic', 
      name: 'Basic Component', 
      component: BasicExample,
      description: 'The simplest way to add voice capabilities to your app using the BasicAudioConversation component.',
      snippet: BasicExampleSnippet,
      options: []
    },
  ];

  // Find the current active example component and metadata
  const activeExampleData = examples.find(ex => ex.id === activeExample);
  
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>PrimVoices React Examples</h1>
        <p style={styles.description}>
          A collection of examples demonstrating how to use the primvoices-react library
          for voice-enabled applications.
        </p>
      </header>

      <div style={styles.content}>
        <nav style={styles.sidebar}>
          <h2 style={styles.sidebarTitle}>Examples</h2>
          <ul style={styles.exampleList}>
            {examples.map(example => (
              <li key={example.id} style={styles.exampleItem}>
                <button
                  onClick={() => setActiveExample(example.id)}
                  style={{
                    ...styles.exampleButton,
                    ...(activeExample === example.id ? styles.activeExampleButton : {})
                  }}
                >
                  {example.name}
                </button>
              </li>
            ))}
          </ul>

          <div style={styles.sidebarInfo}>
            <h3 style={styles.infoTitle}>About These Examples</h3>
            <p style={styles.infoText}>
              These examples demonstrate various ways to use the primvoices-react library in your applications.
              From basic usage to advanced configurations, you'll find patterns that you can adapt for your own projects.
            </p>
            <p style={styles.infoText}>
              Remember to replace the placeholder URLs and IDs with your actual PrimVoices API credentials.
            </p>
          </div>
        </nav>

        <main style={styles.mainContent}>
          {activeExample ? (
            activeExampleData ? (
              <React.Fragment>
                <button
                  onClick={() => setActiveExample(null)}
                  style={styles.backButton}
                >
                  ← Back to Examples List
                </button>
                <div style={styles.exampleContainer}>
                  <ExampleWrapper
                    title={activeExampleData.name}
                    description={activeExampleData.description}
                    snippet={activeExampleData.snippet}
                    options={activeExampleData.options}
                  >
                    <activeExampleData.component />
                  </ExampleWrapper>
                </div>
              </React.Fragment>
            ) : (
              <div style={styles.errorMessage}>
                Example not found
              </div>
            )
          ) : (
            <div style={styles.welcomeScreen}>
              {examples.map(example => (
                <div 
                  key={example.id} 
                  style={styles.exampleCard}
                  onClick={() => setActiveExample(example.id)}
                >
                  <h4 style={styles.cardTitle}>{example.name}</h4>
                  <p style={styles.cardDescription}>
                    {example.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      <footer style={styles.footer}>
        <p>PrimVoices React Library Examples — For more information, check the <a href="https://github.com/PrimLabsAI/primvoices-react" style={styles.link}>GitHub repository</a>.</p>
      </footer>
    </div>
  );
};

// Styles
const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    color: '#333',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
  },
  header: {
    textAlign: 'center' as const,
    marginBottom: '30px',
    borderBottom: '1px solid #eee',
    paddingBottom: '20px',
  },
  title: {
    fontSize: '28px',
    color: '#2196F3',
    margin: '0 0 10px 0',
  },
  description: {
    fontSize: '16px',
    color: '#666',
    margin: 0,
  },
  content: {
    display: 'flex' as const,
    flexDirection: 'row' as const,
    gap: '30px',
  },
  sidebar: {
    width: '250px',
    flexShrink: 0,
    borderRight: '1px solid #eee',
    paddingRight: '20px',
    position: 'sticky' as const,
    top: '20px',
    height: 'fit-content',
    maxHeight: 'calc(100vh - 120px)',
    overflowY: 'auto' as const
  },
  sidebarTitle: {
    fontSize: '18px',
    margin: '0 0 15px 0',
    color: '#444',
  },
  exampleList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  exampleItem: {
    marginBottom: '10px',
  },
  exampleButton: {
    display: 'block',
    width: '100%',
    padding: '10px 15px',
    border: 'none',
    backgroundColor: '#f5f5f5',
    borderRadius: '4px',
    fontSize: '14px',
    textAlign: 'left' as const,
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  activeExampleButton: {
    backgroundColor: '#e3f2fd',
    borderLeft: '3px solid #2196F3',
    fontWeight: 'bold',
  },
  sidebarInfo: {
    marginTop: '30px',
    padding: '15px',
    backgroundColor: '#f9f9f9',
    borderRadius: '4px',
    fontSize: '14px',
  },
  infoTitle: {
    fontSize: '16px',
    margin: '0 0 10px 0',
    color: '#555',
  },
  infoText: {
    margin: '0 0 10px 0',
    lineHeight: '1.4',
    color: '#666',
  },
  mainContent: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: '8px',
    overflow: 'hidden',
    position: 'relative' as const,
  },
  backButton: {
    position: 'absolute' as const,
    top: '15px',
    left: '15px',
    padding: '8px 12px',
    backgroundColor: '#f5f5f5',
    border: 'none',
    borderRadius: '4px',
    fontSize: '14px',
    cursor: 'pointer',
    zIndex: 10,
  },
  exampleContainer: {
    padding: '15px',
    paddingTop: '60px', // Space for back button
    overflowY: 'auto' as const,
  },
  errorMessage: {
    padding: '30px',
    textAlign: 'center' as const,
    color: '#f44336',
    fontSize: '18px',
  },
  welcomeScreen: {
    padding: '30px',
  },
  welcomeTitle: {
    fontSize: '24px',
    margin: '0 0 20px 0',
    color: '#2196F3',
    textAlign: 'center' as const,
  },
  welcomeText: {
    textAlign: 'center' as const,
    fontSize: '16px',
    color: '#666',
    marginBottom: '30px',
  },
  examplesOverview: {
    marginTop: '20px',
  },
  overviewTitle: {
    fontSize: '18px',
    marginBottom: '15px',
    color: '#444',
  },
  exampleCard: {
    padding: '15px',
    backgroundColor: '#f5f5f5',
    borderRadius: '4px',
    marginBottom: '15px',
    borderLeft: '3px solid #2196F3',
  },
  cardTitle: {
    margin: '0 0 10px 0',
    fontSize: '16px',
    color: '#333',
  },
  cardDescription: {
    margin: 0,
    fontSize: '14px',
    color: '#666',
    lineHeight: '1.4',
  },
  footer: {
    marginTop: '40px',
    textAlign: 'center' as const,
    padding: '20px',
    borderTop: '1px solid #eee',
    fontSize: '14px',
    color: '#666',
  },
  link: {
    color: '#2196F3',
    textDecoration: 'none',
  },
  exampleWrapper: {
    padding: '20px',
  },
  exampleTitle: {
    fontSize: '24px',
    marginTop: 0,
    marginBottom: '20px',
    color: '#2196F3',
  },
  descriptionBox: {
    backgroundColor: '#f5f5f5',
    padding: '15px',
    borderRadius: '4px',
    marginBottom: '20px',
  },
  descriptionTitle: {
    fontSize: '18px',
    margin: '0 0 10px 0',
    color: '#333',
  },
  descriptionText: {
    margin: 0,
    lineHeight: '1.5',
    color: '#555',
  },
  tabContainer: {
    display: 'flex' as const,
    marginBottom: '10px',
    borderBottom: '1px solid #ddd',
  },
  tabButton: {
    padding: '10px 15px',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#666',
  },
  activeTabButton: {
    borderBottom: '2px solid #2196F3',
    color: '#2196F3',
  },
  contentBox: {
    border: '1px solid #ddd',
    borderRadius: '4px',
    padding: '20px',
    backgroundColor: 'white',
    minHeight: '300px',
  },
  implementationContainer: {
    // Implementation container styles
  },
  optionsContainer: {
    marginTop: '30px',
  },
  optionsTitle: {
    fontSize: '18px',
    margin: '0 0 15px 0',
    color: '#333',
  },
  optionsTable: {
    width: '100%',
    borderCollapse: 'collapse' as const,
    border: '1px solid #e0e0e0',
  },
  optionHeader: {
    padding: '10px 15px',
    textAlign: 'left' as const,
    backgroundColor: '#f5f5f5',
    borderBottom: '1px solid #e0e0e0',
  },
  optionRowEven: {
    backgroundColor: 'white',
  },
  optionRowOdd: {
    backgroundColor: '#f9f9f9',
  },
  optionName: {
    padding: '10px 15px',
    borderBottom: '1px solid #e0e0e0',
    fontFamily: 'monospace',
    fontWeight: 'bold',
  },
  optionDescription: {
    padding: '10px 15px',
    borderBottom: '1px solid #e0e0e0',
  },
  optionDefault: {
    padding: '10px 15px',
    borderBottom: '1px solid #e0e0e0',
    fontFamily: 'monospace',
    color: '#666',
  },
  codeSnippet: {
    backgroundColor: '#f8f8f8',
    border: '1px solid #e0e0e0',
    borderRadius: '4px',
    padding: '10px',
    overflowX: 'auto' as const,
    maxHeight: '500px',
    overflowY: 'auto' as const,
  },
};

export default ExamplesIndex; 
