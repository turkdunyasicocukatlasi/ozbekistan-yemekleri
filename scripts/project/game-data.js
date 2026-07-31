/*
 * YEMEK VERİLERİ
 * Yeni ülke oyununda sadece bu diziyi ve assets klasörünü değiştirin.
 */
export const FOODS = Object.freeze([
	food("plov", "Plov (Pilav)", "01-plov-pilav.png", "plov.webm", 200, [5, 25, 90, 50]),
	food("saslik", "Şaşlık", "02-saslik.png", "şaşlık.webm", 200, [5, 20, 90, 60]),
	food("manti", "Mantı", "03-manti.png", "mantı.webm", 200, [5, 18, 90, 64]),
	food("hanum", "Hanum", "04-hanum.png", "hanum.webm", 350, [20, 32, 60, 35]),
	food("samsa", "Samsa", "05-samsa.png", "samsa.webm", 300, [18, 28, 64, 44]),
	food("tukhum-barak", "Tukhum Barak", "06-tukhum-barak.png", "tukhum barak.webm", 350, [19, 27, 62, 46]),
	food("mashhurda", "Mashhurda", "07-mashhurda.png", "mashurda.webm", 300, [21, 25, 58, 49]),
	food("dolma", "Dolma", "08-dolma.png", "dolma.webm", 300, [20, 24, 60, 52]),
	food("laghman", "Laghman", "09-laghman.png", "laghman.webm", 300, [22, 25, 56, 50]),
	food("helva", "Helva", "10-helva.png", "helva.webm", 300, [22, 27, 56, 45])
]);

function food(id, name, cardFile, narrationFile, constructSize, hitArea)
{
	return Object.freeze({
		id,
		name,
		tableImage: `table-${id}.png`,
		menuCard: `menu-${cardFile}`,
		detailCard: `detail-${cardFile}`,
		narration: narrationFile,
		constructSize,
		hitArea: Object.freeze({
			left: `${hitArea[0]}%`,
			top: `${hitArea[1]}%`,
			width: `${hitArea[2]}%`,
			height: `${hitArea[3]}%`
		})
	});
}

export const AUDIO_ASSETS = Object.freeze({
	music: "fon.webm",
	instruction: "yönerge.webm"
});

export const INTRO_ASSET = "intro-card.png";
