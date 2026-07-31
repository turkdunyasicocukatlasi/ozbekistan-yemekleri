const C3 = self.C3;
self.C3_GetObjectRefTable = function () {
	return [
		C3.Plugins.Sprite
	];
};
self.C3_JsPropNameTable = [
	{Sprite: 0},
	{plov01hafifonden: 0},
	{saslik02yuksektenegimli: 0},
	{manti01hafifonden: 0},
	{hanum01hafifonden: 0},
	{samsa01hafifonden: 0},
	{tukhumbarak02yuksektenegimli: 0},
	{mashhurda02yuksektenegimli: 0},
	{dolma02yuksektenegimli: 0},
	{laghman02yuksektenegimli: 0},
	{helva02yuksektenegimli: 0},
	{plovpilav: 0}
];

self.InstanceType = {
	Sprite: class extends self.ISpriteInstance {},
	plov01hafifonden: class extends self.ISpriteInstance {},
	saslik02yuksektenegimli: class extends self.ISpriteInstance {},
	manti01hafifonden: class extends self.ISpriteInstance {},
	hanum01hafifonden: class extends self.ISpriteInstance {},
	samsa01hafifonden: class extends self.ISpriteInstance {},
	tukhumbarak02yuksektenegimli: class extends self.ISpriteInstance {},
	mashhurda02yuksektenegimli: class extends self.ISpriteInstance {},
	dolma02yuksektenegimli: class extends self.ISpriteInstance {},
	laghman02yuksektenegimli: class extends self.ISpriteInstance {},
	helva02yuksektenegimli: class extends self.ISpriteInstance {},
	plovpilav: class extends self.ISpriteInstance {}
}