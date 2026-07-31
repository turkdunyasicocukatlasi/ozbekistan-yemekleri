/*
 * BUTON YERLEŞİMİ
 * Yeni oyunlarda sadece görsel yollarını veya konum değerlerini değiştirin.
 */
export const BUTTON_LAYOUT = Object.freeze({
	menu:       { asset: "btn-menu.png",       left: "1.2%", top: "2%", width: "12.5%" },
	home:       { asset: "btn-home.png",       right: "1.2%", top: "2%", width: "6.5%" },
	fullscreen: { asset: "btn-fullscreen.png", right: "1.2%", top: "17%", width: "6.5%" },
	music:      { onAsset: "btn-music-on-v2.png", offAsset: "btn-music-off-v2.png", right: "1.2%", top: "32%", width: "6.5%" },
	finish:     { asset: "btn-finish.png",     left: "1.2%", bottom: "2%", width: "12.5%" },
	close:      { asset: "btn-close.png" },
	restart:    { asset: "btn-restart.png" }
});
