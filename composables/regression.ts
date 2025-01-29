export function linearRegression(data: { x: number; y: number }[]) {
	const n = data.length;
	const sumX = data.reduce((sum, point) => sum + point.x, 0);
	const sumY = data.reduce((sum, point) => sum + point.y, 0);
	const sumXY = data.reduce((sum, point) => sum + point.x * point.y, 0);
	const sumX2 = data.reduce((sum, point) => sum + point.x * point.x, 0);

	const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
	const intercept = (sumY - slope * sumX) / n;

	return { slope, intercept };
}

export function predict(
	{ slope, intercept }: { slope: number; intercept: number },
	x: number
) {
	return Math.round((slope * x + intercept) * 100) / 100;
}
