import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './navigation/AppNavigator';
import { ClerkProvider, ClerkLoaded } from '@clerk/clerk-expo';
import { tokenCache } from './cache';
import { navigationRef } from './RootNavigation'; // Ensure the path is correct
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import i18n from "./i18n";
import { I18nextProvider } from 'react-i18next'; // Make sure to import I18nextProvider
import { TranslationProvider } from './translations/TranslationContext';
import { LanguageProvider } from "./translations/LanguageProvider"; // Import LanguageProvider

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

if (!publishableKey) {
  throw new Error(
    'Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env'
  );
}

export default function App() {
  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
      <ClerkLoaded>
        <I18nextProvider i18n={i18n}>
          <LanguageProvider> 
            <TranslationProvider>
              <SafeAreaProvider>
                <NavigationContainer ref={navigationRef}>
                  <AppNavigator />
                </NavigationContainer>
              </SafeAreaProvider>
            </TranslationProvider>
          </LanguageProvider>
        </I18nextProvider>
      </ClerkLoaded>
    </ClerkProvider>
  );
}
