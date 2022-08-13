import { useEffect } from "react";

function Newsticker() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
    script.async = true;
    script.innerHTML = `
      {
        "symbols": [
          {
            "description": "",
            "proName": "TVC:GOLD"
          },
          {
            "description": "",
            "proName": "TVC:USOIL"
          },
          {
            "description": "",
            "proName": "TVC:SILVER"
          },
          {
            "description": "",
            "proName": "TVC:UKOIL"
          }
        ],
        "showSymbolLogo": true,
        "colorTheme": "dark",
        "isTransparent": false,
        "displayMode": "adaptive",
        "locale": "en"
      }
      `;
    document.getElementById("tradingview-widget-container").appendChild(script);
  }, []);

  return (
    <>
      <div id="tradingview-widget-container">
        <div className="tradingview-widget-container__widget" />
      </div>
    </>
  );
}
export default Newsticker;
