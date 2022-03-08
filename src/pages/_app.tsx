import { AppProps } from 'next/app';
import { Provider as NextAuthProvider } from 'next-auth/client';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';

import './../styles/global.scss';

import Header from '../components/Header';

const initialOptions = {
  "client-id": "Ac4klIL0g9DiIyt05u02GyDO-K-6sCZCx6ZE8d1Ru51Jc5UQjxxrT_EgC21juYRBDWJLjqKjL8XBPojV",
  currency: "BRL",
  intent: "capture",
};

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <NextAuthProvider session={pageProps.session}>
      <PayPalScriptProvider options={initialOptions}>
        <Header />
        <Component {...pageProps} />
      </PayPalScriptProvider>
    </NextAuthProvider>
  );
}

export default MyApp
