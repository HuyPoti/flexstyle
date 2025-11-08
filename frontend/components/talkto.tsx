import React from "react";
import Script from "next/script";

function talkto() {
  return (
    <div>
      <Script
        id="tawk-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
                        var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
                        (function(){
                          var s1=document.createElement("script"),
                          s0=document.getElementsByTagName("script")[0];
                          s1.async=true;
                          s1.src='https://embed.tawk.to/68e7afe5194a94194f2e030b/1j74ge6hq';
                          s1.charset='UTF-8';
                          s1.setAttribute('crossorigin','*');
                          s0.parentNode.insertBefore(s1,s0);
                        })();
                      `,
        }}
      />
    </div>
  );
}

export default talkto;
