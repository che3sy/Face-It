import { jsPDF } from "jspdf";
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
			topCategoryText = `${topCategory[0]} - $${topCategory[1]}`;
		}

		// Add content to the PDF
		doc.setFontSize(18);
		doc.text("Financial Report", 10, 10);

		doc.setFontSize(12);
		doc.text(`Period: ${dateRangeStore.periodName}`, 10, 20);
		doc.text(`Income: $${income}`, 10, 30);
		doc.text(`Expenses: $${expenses}`, 10, 40);
		doc.text(`Balance: $${balance}`, 10, 50);
		doc.text(`Top Category: ${topCategoryText}`, 10, 60);

		doc.text("Period Data:", 10, 70);
		periodData.forEach((data, index) => {
			doc.text(
				`${data.name}: Income - $${data.income}, Expenses - $${data.expenses}`,
				10,
				80 + index * 10
			);
		});

		docRef.value = doc;
	};
	const generateReportPDF = () => {
		// Generate doc and save directly
		generateReportDoc();
		if (docRef.value) {
			const pdfBlob = docRef.value.output("blob");
			saveAs(pdfBlob, "financial_report.pdf");
		}
	};
	return {
		generateReportPDF,
		generateReportDoc,
		docRef,
	};
};
