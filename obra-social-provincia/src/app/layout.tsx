'use client'


import { Provider } from "react-redux";
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from "./redux/Store/store";
import { ClerkProvider, SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import { dark } from '@clerk/themes';
import '@fontsource-variable/onest';
import "./globals.css";



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider appearance={{baseTheme: dark}}>
    <html lang="es">
      <body className="font-variable-onest">
       <PersistGate loading={null} persistor={persistor}>
       <Provider store={store}>
        {children}
      </Provider>
      </PersistGate>
      </body>
    </html>
     </ClerkProvider>
  );
}
