import { useEffect, useRef } from "react";

function RealTimeWidget({ type }) {
	const container = useRef();
	useEffect(() => {
		const script = document.createElement("script");
		script.async = true;
		script.src = "https://s3.tradingview.com/tv.js";
		container.current.appendChild(script);
	}, []);

	useEffect(() => {
		function Chart() {
			const script = document.createElement("script");
			script.type = "text/javascript";
			script.innerHTML = `
      new TradingView.widget(
        {
          "width":"100%",
          "height":"100%",
          "symbol": "TVC:${type}",
          "interval": "240",
          "timezone": "Etc/UTC",
          "theme": "dark",
          "style": "1",
          "locale": "en",
          "toolbar_bg": "#f1f3f6",
          "enable_publishing": false,
          "hide_top_toolbar": true,
          "allow_symbol_change": true,
          "container_id": "tradingview_c79c7"
        })`;
      container.current?.appendChild(script);
		}
    setTimeout(() => {
      // container.current.appendChild(script);
      Chart();
    }, 3000);
		
	}, []);

    console.log(type);
	return (
		<>
			<div id="tradingview-widget-container" ref={container} className="mb-8">
				<div id="tradingview_c79c7"></div>
			</div>
		</>
	);
}

export default RealTimeWidget;
