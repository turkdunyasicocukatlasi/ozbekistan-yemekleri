/*
 * CONSTRUCT SOFRA YERLEŞİMİ
 * Koordinatlar 1920 × 1080 Construct yerleşiminden alınmıştır.
 * Başka bir oyunda yalnızca bu dosyadaki x/y değerlerini değiştirin.
 */
export const LAYOUT_SIZE = Object.freeze({ width: 1920, height: 1080 });
export const TABLE_CAPACITY = 8;

export const TABLE_SLOTS = Object.freeze([
	{ id: "arka-sol",   x: 663,  y: 553, scale: 0.78, depth: "far" },
	{ id: "arka-orta",  x: 901,  y: 534, scale: 0.76, depth: "far" },
	{ id: "arka-sag",   x: 1142, y: 542, scale: 0.78, depth: "far" },
	{ id: "arka-uç",    x: 1370, y: 548, scale: 0.72, depth: "far" },
	{ id: "on-sol",     x: 590,  y: 651, scale: 1.00, depth: "front" },
	{ id: "on-sol-orta",x: 826,  y: 652, scale: 1.00, depth: "front" },
	{ id: "on-sag-orta",x: 1083, y: 664, scale: 1.00, depth: "front" },
	{ id: "on-sag",     x: 1314, y: 652, scale: 0.96, depth: "front" }
]);

export function layoutPercent(value, axis)
{
	return `${(value / LAYOUT_SIZE[axis] * 100).toFixed(4)}%`;
}
