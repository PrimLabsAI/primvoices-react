# PrimVoices React Examples

This directory contains usage examples for the primvoices-react library.

## Running the Examples

You can run the examples with a simple npm command:

```bash
npm run examples
```

This will start a development server and open your browser to the examples page.

## Building the Examples

To build the examples for deployment:

```bash
npm run build:examples
```

This will create a production-ready build in the `examples-dist` directory.

## Available Examples

1. **Basic Usage**
   - Shows the basic setup with the three component types
   - Basic, headless, and advanced audio conversation components

2. **Direct Client Usage**
   - Demonstrates how to use the WebSocketClient directly without React components
   - Complete control over the WebSocket connection

3. **Hook Usage**
   - Shows how to use the usePrimVoices hook to build custom UI components
   - Chat-like interface with transcript history

4. **Configuration Options**
   - Interactive form to experiment with different configuration options
   - Shows how to configure and instantiate components with custom settings

## Development

If you want to modify the examples:

1. Make your changes to the example files
2. The development server will automatically reload with your changes

## Notes

- The examples use placeholder server URLs and IDs
- Replace them with your actual PrimVoices API credentials in real applications
- Some examples include additional notes about implementation details 
