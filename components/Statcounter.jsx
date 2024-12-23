// components/Statcounter.jsx
import Script from 'next/script'

export default function Statcounter() {
  return (
    <>
      <Script 
        id="statcounter-setup"
        strategy="afterInteractive"
      >
        {`
          var sc_project=13071665; 
          var sc_invisible=1; 
          var sc_security="5317e0c0";
        `}
      </Script>
      <Script
        src="https://www.statcounter.com/counter/counter.js"
        strategy="afterInteractive"
        id="statcounter-main"
      />
      <noscript>
        <div className="statcounter">
          <a 
            title="Web Analytics Made Easy - Statcounter" 
            href="https://statcounter.com/" 
            target="_blank"
            rel="noopener noreferrer"
          >
            <img 
              className="statcounter"
              src="https://c.statcounter.com/13071665/0/5317e0c0/1/"
              alt="Web Analytics Made Easy - Statcounter"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </a>
        </div>
      </noscript>
    </>
  )
}