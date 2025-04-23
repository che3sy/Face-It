// The linearRegression function calculates the line of best fit
// using the least squares method for a collection of (x,y) data points.
export function linearRegression(data: { x: number; y: number }[]) {
	// Total number of data points.
	const n = data.length;
	// Summing up all x values.
	const sumX = data.reduce((sum, point) => sum + point.x, 0);
	// Summing up all y values.
	const sumY = data.reduce((sum, point) => sum + point.y, 0);
	// Summing the product of each x and y.
	const sumXY = data.reduce((sum, point) => sum + point.x * point.y, 0);
	// Summing the squares of the x values.
	const sumX2 = data.reduce((sum, point) => sum + point.x * point.x, 0);

	// Calculate the slope (m) using the least squares formula:
	// m = (n * Σ(xy) - Σx * Σy) / (n * Σ(x^2) - (Σx)^2)
	const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
	// Calculate the intercept (b) using the formula:
	// b = (Σy - m * Σx) / n
	const intercept = (sumY - slope * sumX) / n;

	// Return the calculated slope and intercept.
	return { slope, intercept };
}

// The predict function uses a linear regression model to estimate
// the y-value for a given x-value.
export function predict(
	{ slope, intercept }: { slope: number; intercept: number },
	x: number
) {
	// Calculate the predicted y value using y = m * x + b,
	// then round to two decimal places.
	return Math.round((slope * x + intercept) * 100) / 100;
}
