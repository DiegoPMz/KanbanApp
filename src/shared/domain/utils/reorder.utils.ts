export const reorderAndResequence = <
	T extends { position: number; id: string },
>(
	models: T[],
	movedModel: T,
): T[] => {
	const result: T[] = [];
	let currentIndex = 1;

	const otherModels = models
		.filter((m) => m.id !== movedModel.id)
		.sort((a, b) => a.position - b.position);

	for (const model of otherModels) {
		if (currentIndex === movedModel.position) {
			result.push({ ...movedModel, position: currentIndex });
			currentIndex++;
		}

		result.push({ ...model, position: currentIndex });
		currentIndex++;
	}

	if (!result.some((m) => m.id === movedModel.id)) {
		result.push({ ...movedModel, position: currentIndex });
	}

	return result;
};
