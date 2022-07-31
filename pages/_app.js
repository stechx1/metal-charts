import Head from "next/head";
import "../styles/globals.css";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import Newsticker from "./components/Newsticker";
import { useState } from "react";

// react query
import { QueryClient, QueryClientProvider } from "react-query";
import AuthNav from "./components/AuthNav";
import Chat from "./components/Chat";

function MyApp({ Component, pageProps }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <Head>
        <title>Metal Charts</title>
      </Head>
      <Newsticker />
      <Navbar />
      <Component {...pageProps} />
      <Chat />
      <Footer />
    </QueryClientProvider>
  );
}

export default MyApp;
