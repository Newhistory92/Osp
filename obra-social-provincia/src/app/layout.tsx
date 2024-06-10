'use client'


import { Provider } from "react-redux";
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from "./redux/Store/store";
import { ClerkProvider} from '@clerk/nextjs'
import { dark,shadesOfPurple } from '@clerk/themes';
import {NextUIProvider} from "@nextui-org/react";
import { notoSerif, mavenPro, sedanSC } from './fonts';
import '@fontsource-variable/onest';
import "./globals.css";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider appearance={{baseTheme: shadesOfPurple}}>
    <html lang="es">
   
    <body className={`${notoSerif.variable} ${mavenPro.variable} ${sedanSC.variable} font-onest`}>
       <PersistGate loading={null} persistor={persistor}>
       <Provider store={store}>
       <NextUIProvider>
        {children}
    </NextUIProvider>
      </Provider>
      </PersistGate>
      </body>
    </html>
     </ClerkProvider>
  );
}
