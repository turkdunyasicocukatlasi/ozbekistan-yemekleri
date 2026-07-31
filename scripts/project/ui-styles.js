import { MENU_LAYOUT } from "./menu-layout.js";

export function installStyles()
{
	if (document.getElementById("uzbek-game-styles"))
		return;

	const style = document.createElement("style");
	style.id = "uzbek-game-styles";
	style.textContent = `
		.uz-game-root{position:fixed;inset:0;z-index:1000;pointer-events:none;font-family:"Trebuchet MS",Arial,sans-serif;color:#fff5d8;overflow:hidden}
		.uz-canvas-ui{position:absolute;pointer-events:none;overflow:hidden}
		.uz-control,.uz-start,.uz-menu-card,.uz-close,.uz-remove{border:0;background:transparent;padding:0;cursor:pointer;pointer-events:auto}
		.uz-control{position:absolute;transition:transform .18s,filter .18s;filter:drop-shadow(0 8px 9px rgba(0,0,0,.35))}
		.uz-control:hover,.uz-menu-card:hover,.uz-close:hover{transform:scale(1.05);filter:brightness(1.08)}
		.uz-control img,.uz-close img{width:100%;height:auto;display:block}
		.uz-food{position:absolute;pointer-events:none;transform:translate(-50%,-50%);transition:transform .18s,filter .18s;filter:drop-shadow(0 12px 9px rgba(0,0,0,.35));animation:uzServe .45s cubic-bezier(.18,.89,.28,1.2)}
		.uz-food.hover{transform:translate(-50%,-50%) scale(1.06);filter:brightness(1.08) drop-shadow(0 12px 9px rgba(0,0,0,.4))}
		.uz-food img{width:100%;height:100%;object-fit:contain;display:block}
		.uz-food-hit{position:absolute;border:0;background:transparent;padding:0;border-radius:50%;cursor:pointer;pointer-events:auto}
		@keyframes uzServe{from{opacity:0;transform:translate(-50%,-85%) scale(.35)}to{opacity:1;transform:translate(-50%,-50%) scale(1)}}
		.uz-instruction{position:absolute;left:50%;top:2%;transform:translateX(-50%);width:46%;padding:.55% 1%;border:2px solid #d6a43b;border-radius:999px;background:rgba(12,65,105,.9);text-align:center;font-weight:800;font-size:clamp(13px,1.05vw,20px)}
		.uz-progress{position:absolute;left:50%;bottom:2%;transform:translateX(-50%);padding:.55% 1%;border:2px solid #d6a43b;border-radius:999px;background:rgba(12,65,105,.94);font-weight:900;white-space:nowrap}
		.uz-toast{display:none;position:absolute;left:50%;bottom:10%;transform:translateX(-50%);padding:12px 20px;border:2px solid #f2d483;border-radius:999px;background:#0a6684;font-weight:900}
		.uz-toast.show{display:block}
		.uz-overlay{position:fixed;inset:0;z-index:1010;display:none;align-items:center;justify-content:center;padding:1.5vw;background:rgba(5,25,45,.82);backdrop-filter:blur(4px);pointer-events:auto}
		.uz-overlay.open{display:flex}
		.uz-menu-panel{position:relative;width:${MENU_LAYOUT.panelWidth};height:${MENU_LAYOUT.panelHeight};padding:86px 25px 18px;border:4px solid #d6a43b;border-radius:28px;background:linear-gradient(145deg,#0b7893,#123f73);overflow:auto}
		.uz-menu-panel h2{position:absolute;left:34px;top:18px;margin:0;font:800 clamp(30px,3vw,54px) Georgia,serif}
		.uz-close{position:absolute;right:16px;top:12px;width:70px;z-index:2}
		.uz-grid{display:grid;grid-template-columns:repeat(${MENU_LAYOUT.columns},minmax(0,${MENU_LAYOUT.cardMaxWidth}));justify-content:space-evenly;gap:${MENU_LAYOUT.gap}}
		.uz-menu-card{position:relative;width:100%;overflow:hidden;border-radius:12px}
		.uz-menu-card img{display:block;width:100%;height:auto}
		.uz-menu-card.served{filter:grayscale(.65) brightness(.6);cursor:default}
		.uz-menu-card:nth-child(9){grid-column:${MENU_LAYOUT.lastRowStartColumn}}
		.uz-menu-card:nth-child(10){grid-column:${MENU_LAYOUT.lastRowStartColumn + 1}}
		.uz-ribbon{display:none;position:absolute;left:0;right:0;bottom:10%;padding:7px;background:rgba(12,65,105,.94);text-align:center;font-weight:900}
		.uz-menu-card.served .uz-ribbon{display:block}
		.uz-detail-panel{position:relative;width:min(1500px,95vw);display:grid;grid-template-columns:minmax(0,1fr) minmax(220px,32%);align-items:center;gap:18px}
		.uz-detail-card,.uz-detail-food{display:block;width:100%;max-height:84vh;object-fit:contain}
		.uz-detail-food{width:120%;max-width:none;transform:translateX(-8%);filter:drop-shadow(0 18px 18px rgba(0,0,0,.45))}
		.uz-remove{position:absolute;right:2%;bottom:2%;padding:13px 23px;border:3px solid #f2d483;border-radius:999px;background:#0a6684;color:#fff;font-weight:900}
		.uz-intro{position:fixed;inset:0;z-index:1020;display:grid;place-items:center;background:#000;pointer-events:auto;overflow:hidden}
		.uz-intro-video{position:absolute;inset:0;z-index:0;width:100%;height:100%;object-fit:cover;background:#000}
		.uz-intro-shade{position:absolute;inset:0;z-index:1;background:rgba(0,0,0,.312);pointer-events:none;transition:background .22s ease}
		.uz-intro.playing .uz-intro-shade{background:rgba(0,0,0,.08)}
		.uz-intro.ready .uz-intro-shade{background:rgba(0,0,0,.52)}
		.uz-intro-video-play{position:relative;grid-area:1/1;z-index:3;display:grid;place-items:center;width:clamp(96px,11vw,150px);aspect-ratio:1;border:4px solid #f2d483;border-radius:50%;background:linear-gradient(#178fa5,#0a607e);box-shadow:0 8px 0 #123f73,0 18px 32px rgba(0,0,0,.42);animation:uzPulse 1.35s ease-in-out infinite;transition:transform .16s ease,filter .16s ease}
		.uz-intro-video-play::before{content:"";width:0;height:0;margin-left:9%;border-top:clamp(20px,2.4vw,32px) solid transparent;border-bottom:clamp(20px,2.4vw,32px) solid transparent;border-left:clamp(31px,3.6vw,48px) solid #fff5d8;filter:drop-shadow(0 3px 3px rgba(0,0,0,.28))}
		.uz-intro-video-play:hover{animation-play-state:paused;filter:brightness(1.12);transform:scale(1.08)}
		.uz-skip-intro{position:absolute;right:clamp(16px,3vw,42px);bottom:clamp(16px,3vw,34px);z-index:4;padding:12px 18px 13px;border:2px solid #f2d483;border-radius:10px;background:rgba(12,65,105,.88);color:#fff5d8;font-weight:900;font-size:clamp(15px,1.25vw,20px);text-shadow:0 2px 5px rgba(0,0,0,.72);box-shadow:0 12px 26px rgba(0,0,0,.38);opacity:0;pointer-events:none;transition:opacity .18s ease,transform .16s ease,filter .16s ease}
		.uz-skip-intro:hover{transform:translateY(-2px);filter:brightness(1.08)}
		.uz-intro.playing .uz-skip-intro{opacity:1;pointer-events:auto}
		.uz-intro.playing .uz-intro-video-play,.uz-intro.ready .uz-intro-video-play{opacity:0;pointer-events:none}
		.uz-intro-card{position:relative;grid-area:1/1;z-index:2;width:min(980px,94vw);aspect-ratio:3/2;opacity:0;pointer-events:none;transform:translateY(10px) scale(.98);transition:opacity .24s ease,transform .24s ease}
		.uz-intro.ready .uz-intro-card{opacity:1;pointer-events:auto;transform:translateY(0) scale(1)}
		.uz-intro-card>img{width:100%;height:100%;object-fit:contain}
		.uz-intro-content{position:absolute;inset:14% 13%;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;color:#123f73}
		.uz-intro h1{margin:0;font:800 clamp(42px,6vw,86px)/1 Georgia,serif}
		.uz-intro p{font-size:clamp(17px,2vw,28px);font-weight:700}
		.uz-start{padding:15px 48px;border:4px solid #f2d483;border-radius:999px;background:linear-gradient(#178fa5,#0a607e);color:#fff;font-size:clamp(22px,2.2vw,34px);font-weight:900;box-shadow:0 8px 0 #123f73;animation:uzPulse 1.35s ease-in-out infinite}
		.uz-start:hover{animation-play-state:paused;filter:brightness(1.12)}
		@keyframes uzPulse{0%,100%{transform:scale(.94)}50%{transform:scale(1.12)}}
		@media(max-width:${MENU_LAYOUT.mobileBreakpoint}px){
			.uz-grid{grid-template-columns:repeat(2,minmax(0,1fr))}
			.uz-menu-card:nth-child(9),.uz-menu-card:nth-child(10){grid-column:auto}
			.uz-detail-panel{grid-template-columns:1fr}.uz-detail-food{display:none}
			.uz-instruction{top:14%;width:76%}
		}
	`;
	document.head.append(style);
}
