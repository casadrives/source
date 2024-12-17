import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from '@capacitor/app';
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar } from '@capacitor/status-bar';
import AppComponent from './App';
import { AppProvider } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import { validateMapboxToken } from './config/mapbox';
import './index.css';

// Initialize app
const initializeApp = async () => {
  try {
    // Validate Mapbox token
    const isMapboxValid = await validateMapboxToken();
    if (!isMapboxValid) {
      console.error('Invalid Mapbox configuration');
    }

    // Only initialize Capacitor plugins if running in native app context
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isNative = userAgent.includes('capacitor');

    if (isNative) {
      await StatusBar.setStyle({ style: 'dark' });
      await StatusBar.setBackgroundColor({ color: '#FFFFFF' });
      
      // Hide splash screen with fade
      await SplashScreen.hide({
        fadeOutDuration: 500
      });

      // Handle back button
      App.addListener('backButton', ({ canGoBack }) => {
        if (!canGoBack) {
          App.exitApp();
        }
      });
    }
  } catch (error) {
    // Log error but don't prevent app from loading
    console.warn('App initialization error:', error);
  }
};

// Initialize app
initializeApp().catch(console.warn);

const root = document.getElementById('root');

if (root) {
  createRoot(root).render(
    <StrictMode>
      <AuthProvider>
        <AppProvider>
          <AppComponent />
        </AppProvider>
      </AuthProvider>
    </StrictMode>
  );
}