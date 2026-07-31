import { startUzbekFoodGame } from "./game-controller.js";

runOnStartup(async runtime =>
{
	runtime.addEventListener("beforeprojectstart", () =>
	{
		hideEditorFoodInstances(runtime);
	});

	runtime.addEventListener("afterprojectstart", async () =>
	{
		await startUzbekFoodGame(runtime);
	});
});

function hideEditorFoodInstances(runtime)
{
	const editorFoodTypes = [
		"plov01hafifonden",
		"saslik02yuksektenegimli",
		"manti01hafifonden",
		"hanum01hafifonden",
		"samsa01hafifonden",
		"tukhumbarak02yuksektenegimli",
		"mashhurda02yuksektenegimli",
		"dolma02yuksektenegimli",
		"laghman02yuksektenegimli",
		"helva02yuksektenegimli"
	];

	for (const objectName of editorFoodTypes)
	{
		const objectClass = runtime.objects[objectName];
		if (!objectClass)
			continue;

		for (const instance of objectClass.getAllInstances())
			instance.isVisible = false;
	}
}
