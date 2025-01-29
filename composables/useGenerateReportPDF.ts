import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { saveAs } from "file-saver";
import { useFinancialData } from "./useFinancialData";
import { useDateRangeStore } from "../stores/dateRange";

interface PeriodData {
	name: string;
	income: number;
	expenses: number;
}

export const useGenerateReportPDF = () => {
	const {
		getIncome,
		getExpenses,
		getBalance,
		getPeriodData,
		getTopCategories,
	} = useFinancialData();
	const dateRangeStore = useDateRangeStore();
	const docRef = ref<jsPDF | null>(null);

	const generateReportDoc = async () => {
		const doc = new jsPDF();

		// Fetch the necessary data
		const periodData: PeriodData[] = getPeriodData() as PeriodData[];
		const income = getIncome();
		const expenses = getExpenses();
		const balance = getBalance();
		const topCategory = getTopCategories();

		// Ensure topCategory is of the correct type
		let topCategoryText = "N/A";
		if (topCategory && typeof topCategory[1] === "number") {
			topCategoryText = `${topCategory[0]} - $${topCategory[1].toFixed(2)}`;
		}

		// Load the image
		const img = new Image();
		img.src = "/favicon.ico";
		await new Promise((resolve) => {
			img.onload = resolve;
		});

		// Add content to the PDF
		doc.setFontSize(18);
		doc.text("Financial Report", 10, 10);
		doc.addImage(img, "PNG", 150, 5, 40, 40); // Adjust the position and size as needed

		doc.setFontSize(12);
		doc.text(`Period Split: ${dateRangeStore.periodName}`, 10, 20);
		doc.text(`Total Income: $${income.toFixed(2)}`, 10, 30);
		doc.text(`Total Expenses: $${expenses.toFixed(2)}`, 10, 40);
		doc.text(`Current Balance: $${balance.toFixed(2)}`, 10, 50);
		doc.text(`Category With the Biggest Impact: ${topCategoryText}`, 10, 60);

		doc.setFontSize(10);
		doc.setTextColor("green");
		doc.setFont("courier", "bold");
		doc.text("Provided by Face-It", 150, 50); // Adjust the position as needed

		// Filter out rows where both income and expenses are 0
		const filteredPeriodData = periodData.filter(
			(data) => data.income !== 0 || data.expenses !== 0
		);

		// Add table for period data
		autoTable(doc, {
			startY: 70,
			head: [["Period", "Income", "Expenses"]],
			body: filteredPeriodData.map((data) => [
				data.name,
				`$${data.income.toFixed(2)}`,
				`$${data.expenses.toFixed(2)}`,
			]),
		});

		docRef.value = doc;
	};

	const generateReportPDF = () => {
		// Generate doc and save directly
		generateReportDoc().then(() => {
			if (docRef.value) {
				const pdfBlob = docRef.value.output("blob");
				saveAs(pdfBlob, "financial_report.pdf");
			}
		});
	};

	return {
		generateReportPDF,
		generateReportDoc,
		docRef,
	};
};
