import "@/styles/globals.css";
import Head from "next/head";
import { useState, useEffect } from "react";
import type { AppProps } from "next/app";
import { AnonAadhaarProvider } from "@anon-aadhaar/react";
import { Header } from "../components/Header";
import { Footer } from "@/components/Footer";

export default function App({ Component, pageProps }: AppProps) {
  const [isDisplayed, setIsDisplayed] = useState<boolean>(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  return (
    <>
      <Head>
        <title>Devcon7 - Anon Aadhaar</title>
        <meta property="og:title" content="Anon Aadhaar Example" key="title" />
        <meta
          property="og:image"
          content="https://anon-aadhaar-example.vercel.app/AnonAadhaarBanner.png"
          key="image"
        />
        <meta
          property="og:description"
          name="description"
          content="A Next.js example app that integrate the Anon Aadhaar SDK."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {ready ? (
        <AnonAadhaarProvider>
          <div className="relative min-h-screen flex flex-col justify-between">
            <div className="flex-grow">
              <Header />
              <Component {...pageProps} />
            </div>
            <Footer isDisplayed={isDisplayed} setIsDisplayed={setIsDisplayed} />
          </div>
        </AnonAadhaarProvider>
      ) : null}
    </>
  );
}
