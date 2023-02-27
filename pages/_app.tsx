import type { AppProps } from 'next/app'
import { ThemeProvider, CssBaseline } from '@mui/material';
import { lightTheme } from '../themes';
import { UIProvider, CartProvider, AuthProvider } from '@/context';
import { SWRConfig } from 'swr/_internal';
import { SessionProvider } from "next-auth/react"
import { Session } from 'next-auth';
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider>
      <PayPalScriptProvider options={{ 'client-id': process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ||'' }}>
      <SWRConfig
        value={{
          fetcher : (resource, init) => fetch(resource, init).then(res => res.json())
        }}
      >
      <AuthProvider>
        <CartProvider>
          <UIProvider>
            <ThemeProvider theme={ lightTheme }>
              <CssBaseline />
              <Component {...pageProps} />
            </ThemeProvider>
          </UIProvider>
        </CartProvider>
      </AuthProvider>
    </SWRConfig>
      </PayPalScriptProvider>
    </SessionProvider>
  )
  
  
}
