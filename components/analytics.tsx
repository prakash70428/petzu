import Script from "next/script";

/**
 * Google Analytics 4 (proposal section 9). Loads nothing unless
 * NEXT_PUBLIC_GA_ID is set, and never sends advertising signals.
 */
export function Analytics() {
  const id = process.env.NEXT_PUBLIC_GA_ID?.trim();
  if (!id || !/^G-[A-Z0-9]+$/.test(id)) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${id}`} strategy="afterInteractive" />
      <Script id="ga4" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag("js",new Date());gtag("config","${id}",{allow_google_signals:false,allow_ad_personalization_signals:false});`}
      </Script>
    </>
  );
}
