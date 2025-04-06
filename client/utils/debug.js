import { LogBox } from 'react-native';

// Helper to enable more detailed logs in development
export const initDebugMode = () => {
    if (__DEV__) {
        // Keep these warnings visible
        LogBox.ignoreLogs([
            'Remote debugger',
            'Require cycle:',
        ]);

        // Add global error handler to catch and log all JS errors
        const originalConsoleError = console.error;
        console.error = (...args) => {
            // Check if this is a Text strings warning we want to handle specially
            const errorMessage = args.join(' ');
            if (errorMessage.includes('Text strings must be rendered within a <Text>')) {
                console.log('⚠️ TEXT ERROR: Make sure all text is within Text components!');
                console.log('Error context:', errorMessage);
            }

            // Always call original handler
            originalConsoleError(...args);
        };
    }
};
