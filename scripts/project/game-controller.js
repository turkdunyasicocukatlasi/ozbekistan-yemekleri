import { FOODS, AUDIO_ASSETS, INTRO_ASSET } from "./game-data.js";
import { BUTTON_LAYOUT } from "./button-layout.js";
import { TABLE_CAPACITY, TABLE_SLOTS, LAYOUT_SIZE, layoutPercent } from "./table-layout.js";
import { installStyles } from "./ui-styles.js";

export async function startUzbekFoodGame(runtime)
{
	installStyles();
	const urls = await resolveAssetUrls(runtime);
	if (window.__uzbekFoodGame?.music)
	{
		window.__uzbekFoodGame.music.pause();
		window.__uzbekFoodGame.music.muted = true;
	}
	const game = new UzbekFoodGame(runtime, urls);
	window.__uzbekFoodGame = game;
	await game.init();
}

class UzbekFoodGame
{
	constructor(runtime, urls)
	{
		this.runtime = runtime;
		this.urls = urls;
		this.served = [];
		this.selectedId = null;
		this.musicEnabled = true;
		this.musicButton = null;
		this.root = null;
		this.canvasUI = null;
		this.introState = "initial";
		this.music = AUDIO_ASSETS.music ? new Audio(urls[AUDIO_ASSETS.music]) : null;
		this.instructionAudio = AUDIO_ASSETS.instruction ? new Audio(urls[AUDIO_ASSETS.instruction]) : null;
		this.narration = new Audio();
		if (this.music)
		{
			this.music.loop = true;
			this.music.volume = .24;
		}
	}

	async init()
	{
		this.buildInterface();
		this.bindAudio();
		this.startCanvasSyncLoop();
		window.addEventListener("resize", () => this.syncCanvasBounds(true));
		document.addEventListener("fullscreenchange", () => this.syncCanvasBounds(true));
		window.visualViewport?.addEventListener("resize", () => this.syncCanvasBounds(true));
		new ResizeObserver(() => this.syncCanvasBounds(true)).observe(document.body);
	}

	buildInterface()
	{
		this.root = element("div", "uz-game-root");
		this.canvasUI = element("div", "uz-canvas-ui");
		this.root.append(this.canvasUI);
		document.body.append(this.root);

		this.buildGameScreen();
		this.buildMenu();
		this.buildDetail();
		this.buildIntro();
		this.render();
	}

	buildGameScreen()
	{
		this.canvasUI.append(
			textElement("div", "uz-instruction", "Menüden yemek seçin; sofradaki yemeğe dokunarak ayrıntısını görün veya kaldırın.")
		);

		for (const [id, config] of Object.entries(BUTTON_LAYOUT))
		{
			if (!["menu", "home", "fullscreen", "music", "finish"].includes(id))
				continue;
			const asset = id === "music" ? config.onAsset : config.asset;
			const button = imageButton("uz-control", this.urls[asset], id);
			Object.assign(button.style, config);
			if (id === "music")
			{
				button.classList.add("uz-music-control");
				button.addEventListener("pointerdown", event =>
				{
					event.preventDefault();
					event.stopPropagation();
					this.toggleMusic();
				});
				button.addEventListener("click", event =>
				{
					if (event.detail === 0)
						this.toggleMusic();
				});
			}
			else
				button.addEventListener("click", () => this.handleControl(id));
			this.canvasUI.append(button);
			if (id === "music")
				this.musicButton = button;
		}

		this.progress = element("div", "uz-progress");
		this.toast = textElement("div", "uz-toast", "Sofra dolu. Yeni yemek için bir tabağı kaldırın.");
		this.canvasUI.append(this.progress, this.toast);
	}

	buildMenu()
	{
		this.menuOverlay = element("section", "uz-overlay");
		const panel = element("div", "uz-menu-panel");
		panel.append(textElement("h2", "", "Özbek Yemekleri"));
		const close = imageButton("uz-close", this.urls[BUTTON_LAYOUT.close.asset], "Menüyü kapat");
		close.addEventListener("click", () => this.closeMenu());
		panel.append(close);
		this.grid = element("div", "uz-grid");
		panel.append(this.grid);
		this.menuOverlay.append(panel);
		document.body.append(this.menuOverlay);
	}

	buildDetail()
	{
		this.detailOverlay = element("section", "uz-overlay");
		const panel = element("div", "uz-detail-panel");
		const close = imageButton("uz-close", this.urls[BUTTON_LAYOUT.close.asset], "Ayrıntıyı kapat");
		close.addEventListener("click", () => this.closeDetail());
		this.detailCard = element("img", "uz-detail-card");
		this.detailFood = element("img", "uz-detail-food");
		const remove = textElement("button", "uz-remove", "Sofradan Kaldır");
		remove.addEventListener("click", () => this.removeSelected());
		panel.append(close, this.detailCard, this.detailFood, remove);
		this.detailOverlay.append(panel);
		document.body.append(this.detailOverlay);
	}

	buildIntro()
	{
		this.intro = element("section", "uz-intro");
		this.introVideo = element("video", "uz-intro-video");
		this.introVideo.src = "intro.mp4";
		this.introVideo.preload = "auto";
		this.introVideo.playsInline = true;
		const shade = element("div", "uz-intro-shade");
		const videoPlay = element("button", "uz-intro-video-play");
		videoPlay.type = "button";
		videoPlay.setAttribute("aria-label", "Tanıtımı oynat");
		videoPlay.addEventListener("click", () => this.startIntroVideo());
		const card = element("div", "uz-intro-card");
		const image = element("img");
		image.src = this.urls[INTRO_ASSET];
		const content = element("div", "uz-intro-content");
		content.innerHTML = "<h1>Özbekistan<br>Yemekleri</h1><p>Geleneksel Özbek sofrasını birlikte hazırlayalım.</p>";
		const start = textElement("button", "uz-start", "BAŞLA");
		start.addEventListener("click", () => this.start());
		content.append(start);
		card.append(image, content);
		const skip = textElement("button", "uz-skip-intro", "Tanıtımı Geç");
		skip.addEventListener("click", () => this.showIntroReady());
		this.introVideo.addEventListener("ended", () => this.showIntroReady());
		this.intro.append(this.introVideo, shade, videoPlay, card, skip);
		document.body.append(this.intro);
		document.getElementById("preConstructCover")?.remove();
	}

	setIntroState(state)
	{
		this.introState = state;
		this.intro.classList.toggle("playing", state === "playing");
		this.intro.classList.toggle("ready", state === "ready");
	}

	startIntroVideo()
	{
		this.setIntroState("playing");
		this.introVideo.playbackRate = .8;
		this.introVideo.currentTime = 0;
		if (this.music && this.musicEnabled)
		{
			this.music.currentTime = 0;
			this.music.muted = false;
			this.music.defaultMuted = false;
			this.music.volume = .24;
			safePlay(this.music, "Fon müziği");
		}
		this.introVideo.play().catch(() => this.showIntroReady());
	}

	seekIntroToLastFrame()
	{
		if (!Number.isFinite(this.introVideo.duration) || this.introVideo.duration <= 0)
			return;
		const finalFrameTime = Math.max(0, this.introVideo.duration - .06);
		if (typeof this.introVideo.fastSeek === "function")
			this.introVideo.fastSeek(finalFrameTime);
		else
			this.introVideo.currentTime = finalFrameTime;
	}

	showIntroReady()
	{
		this.introVideo.pause();
		this.seekIntroToLastFrame();
		this.setIntroState("ready");
	}

	bindAudio()
	{
		this.narration.addEventListener("ended", () => { if (this.music) this.music.volume = .24; });
		this.narration.addEventListener("error", () => { if (this.music) this.music.volume = .24; });
		if (this.instructionAudio)
		{
			this.instructionAudio.addEventListener("play", () => { if (this.music) this.music.volume = .08; });
			this.instructionAudio.addEventListener("ended", () => { if (this.music) this.music.volume = .24; });
		}
		document.addEventListener("keydown", event =>
		{
			if (event.key !== "Escape")
				return;
			if (this.detailOverlay.classList.contains("open"))
				this.closeDetail();
			else
				this.closeMenu();
		});
	}

	start()
	{
		this.reset();
		this.intro.style.display = "none";
		this.introVideo.pause();
		if (this.music && this.musicEnabled) safePlay(this.music, "Fon müziği");
		if (this.instructionAudio) safePlay(this.instructionAudio, "Yönerge");
	}

	handleControl(id)
	{
		if (id === "menu") this.openMenu();
		else if (id === "home" || id === "finish") this.goHome();
		else if (id === "fullscreen") toggleFullscreen();
		else if (id === "music") this.toggleMusic();
	}

	toggleMusic()
	{
		if (!this.music)
			return;
		this.musicEnabled = !this.musicEnabled;
		if (this.musicEnabled)
		{
			this.music.muted = false;
			this.music.defaultMuted = false;
			this.music.volume = this.narration.paused && (!this.instructionAudio || this.instructionAudio.paused) ? .24 : .08;
			safePlay(this.music, "Fon müziği");
		}
		else
		{
			this.music.muted = true;
			this.music.defaultMuted = true;
			this.music.volume = 0;
			this.music.pause();
		}
		const config = BUTTON_LAYOUT.music;
		const image = this.musicButton?.querySelector("img");
		if (image)
			image.src = this.urls[this.musicEnabled ? config.onAsset : config.offAsset];
		this.musicButton?.setAttribute("aria-label", this.musicEnabled ? "Müziği kapat" : "Müziği aç");
	}

	openMenu()
	{
		this.renderMenu();
		this.menuOverlay.querySelector(".uz-menu-panel").scrollTop = 0;
		this.menuOverlay.classList.add("open");
	}

	closeMenu() { this.menuOverlay.classList.remove("open"); }

	serve(foodId)
	{
		if (this.served.includes(foodId))
			return;
		if (this.served.length >= TABLE_CAPACITY)
		{
			this.closeMenu();
			this.toast.classList.add("show");
			setTimeout(() => this.toast.classList.remove("show"), 2200);
			return;
		}
		this.served.push(foodId);
		this.closeMenu();
		this.render();
	}

	openDetail(foodId)
	{
		const food = FOODS.find(item => item.id === foodId);
		this.selectedId = foodId;
		this.detailCard.src = this.urls[food.detailCard];
		this.detailFood.src = this.urls[food.tableImage];
		if (this.instructionAudio) this.instructionAudio.pause();
		this.narration.pause();
		this.narration.currentTime = 0;
		if (food.narration)
		{
			this.narration.src = this.urls[food.narration];
			if (this.music) this.music.volume = .08;
			safePlay(this.narration, `${food.name} seslendirmesi`);
		}
		this.detailOverlay.classList.add("open");
	}

	closeDetail()
	{
		this.detailOverlay.classList.remove("open");
		this.narration.pause();
		this.narration.currentTime = 0;
		if (this.music) this.music.volume = .24;
		this.selectedId = null;
	}

	removeSelected()
	{
		if (!this.selectedId)
			return;
		this.served.splice(this.served.indexOf(this.selectedId), 1);
		this.closeDetail();
		this.render();
	}

	goHome()
	{
		this.reset();
		if (this.music)
		{
			this.music.pause();
			this.music.currentTime = 0;
		}
		this.intro.style.display = "grid";
		this.showIntroReady();
	}

	reset()
	{
		this.served.length = 0;
		this.closeMenu();
		this.closeDetail();
		this.render();
	}

	render()
	{
		for (const node of this.canvasUI.querySelectorAll(".uz-food"))
			node.remove();

		this.served.forEach((foodId, index) =>
		{
			const food = FOODS.find(item => item.id === foodId);
			const slot = TABLE_SLOTS[index];
			const holder = element("div", "uz-food");
			const image = element("img");
			image.src = this.urls[food.tableImage];
			image.alt = "";
			const hit = element("button", "uz-food-hit");
			hit.type = "button";
			hit.setAttribute("aria-label", `${food.name} ayrıntısını aç`);
			Object.assign(hit.style, food.hitArea);
			const size = food.constructSize * slot.scale;
			holder.style.left = layoutPercent(slot.x, "width");
			holder.style.top = layoutPercent(slot.y, "height");
			holder.style.width = layoutPercent(size, "width");
			holder.style.height = layoutPercent(size, "height");
			holder.style.zIndex = String(20 + Math.round(slot.y));
			hit.addEventListener("mouseenter", () => holder.classList.add("hover"));
			hit.addEventListener("mouseleave", () => holder.classList.remove("hover"));
			hit.addEventListener("click", () => this.openDetail(foodId));
			holder.append(image, hit);
			this.canvasUI.append(holder);
		});

		this.progress.textContent = `Sofrada ${this.served.length}/${TABLE_CAPACITY}`;
		this.renderMenu();
	}

	renderMenu()
	{
		this.grid.replaceChildren();
		for (const food of FOODS)
		{
			const served = this.served.includes(food.id);
			const button = imageButton(`uz-menu-card${served ? " served" : ""}`, this.urls[food.menuCard], food.name);
			button.disabled = served;
			const ribbon = textElement("span", "uz-ribbon", "Sofrada");
			button.append(ribbon);
			button.addEventListener("click", () => this.serve(food.id));
			this.grid.append(button);
		}
	}

	startCanvasSyncLoop()
	{
		const update = () =>
		{
			this.syncCanvasBounds();
			requestAnimationFrame(update);
		};
		requestAnimationFrame(update);
	}

	syncCanvasBounds(force = false)
	{
		const canvas = document.querySelector("canvas");
		if (!canvas)
			return;
		const rect = canvas.getBoundingClientRect();
		const signature = `${rect.left}|${rect.top}|${rect.width}|${rect.height}`;
		if (!force && signature === this.lastCanvasSignature)
			return;
		this.lastCanvasSignature = signature;
		Object.assign(this.canvasUI.style, {
			left: `${rect.left}px`,
			top: `${rect.top}px`,
			width: `${rect.width}px`,
			height: `${rect.height}px`
		});
	}
}

async function resolveAssetUrls(runtime)
{
	const projectPaths = new Set([INTRO_ASSET]);
	const mediaPaths = new Set(Object.values(AUDIO_ASSETS).filter(Boolean));
	for (const value of Object.values(BUTTON_LAYOUT))
	{
		if (value.asset) projectPaths.add(value.asset);
		if (value.onAsset) projectPaths.add(value.onAsset);
		if (value.offAsset) projectPaths.add(value.offAsset);
	}
	for (const food of FOODS)
	{
		projectPaths.add(food.tableImage).add(food.menuCard).add(food.detailCard);
		if (food.narration) mediaPaths.add(food.narration);
	}

	const entries = await Promise.all([
		...[...projectPaths].map(async path => [path, await runtime.assets.getProjectFileUrl(path)]),
		...[...mediaPaths].map(async path => [path, await runtime.assets.getMediaFileUrl(path)])
	]);
	return Object.fromEntries(entries);
}

function element(tag, className = "")
{
	const node = document.createElement(tag);
	if (className) node.className = className;
	return node;
}

function textElement(tag, className, text)
{
	const node = element(tag, className);
	node.textContent = text;
	return node;
}

function imageButton(className, src, label)
{
	const button = element("button", className);
	button.type = "button";
	button.setAttribute("aria-label", label);
	const image = element("img");
	image.src = src;
	image.alt = label;
	button.append(image);
	return button;
}

function safePlay(audio, label)
{
	audio.play().catch(error => console.warn(`${label} oynatılamadı:`, error.message));
}

function toggleFullscreen()
{
	const promise = document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen();
	promise.catch(error => console.warn("Tam ekran değiştirilemedi:", error.message));
}
