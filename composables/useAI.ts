import { GoogleGenerativeAI } from "@google/generative-ai";
import { useFinancialData } from "./useFinancialData";

export const useAI = async () => {
	try {
		const { getRecentTransactions } = useFinancialData();
		const transactions = await getRecentTransactions();

		const financialData = transactions
			.map(
				(transaction) =>
					`${transaction.date_transaction}: ${transaction.type} - ${transaction.category} - $${transaction.amount}`
			)
			.join("\n");

		const genAI = new GoogleGenerativeAI(
			"AIzaSyDwtY-22oCf2FrZxHVbIaHteBLR2Qm6EpE"
		);
		const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

		const prompt = `Below I have some financial data, I want to save more money. Can you give me bullet points (max 5) on what I should do to help me save more money (just give points nothing else, make sure its connected to my data so I can get specific information on what to change)?\n\n${financialData}`;

		const result = await model.generateContent(prompt);

		return result.response.text();
	} catch (error) {
		console.error("Error fetching AI response:", error);
		return "Sorry, AI is unavailable right now.";
	}
};
