export const useFinancialData = () => {
	const client = useSupabaseClient<{
		data: {
			type: "income" | "expense";
			category: string;
			amount: number;
			date_transaction: string;
		};
	}>();
	const dateRangeStore = useDateRangeStore();

	interface Transaction {
		type: "income" | "expense";
		category: string;
		amount: number;
		date_transaction: string;
	}

	const transactions = ref<Transaction[]>([]);
	const income = ref(0);
	const expenses = ref(0);
	const balance = ref(0);

	const fetchTransactions = async () => {
		let query = client
			.from("data")
			.select("*")
			.order("date_transaction", { ascending: false });

		if (dateRangeStore.start !== 0 && dateRangeStore.end !== 0) {
			query = query
				.gte(
					"date_transaction",
					new Date(dateRangeStore.start * 1000).toISOString()
				)
				.lte(
					"date_transaction",
					new Date(dateRangeStore.end * 1000).toISOString()
				);
		}

		const { data } = await query;
		transactions.value = data || [];
		calculateFinancials();
	};

	const calculateFinancials = () => {
		income.value = transactions.value
			.filter((transaction) => transaction.type === "income")
			.reduce((sum, transaction) => sum + transaction.amount, 0);

		expenses.value = transactions.value
			.filter((transaction) => transaction.type === "expense")
			.reduce((sum, transaction) => sum + transaction.amount, 0);

		balance.value = income.value - expenses.value;
	};

	const getIncome = () => income.value;
	const getExpenses = () => expenses.value;
	const getBalance = () => balance.value;
	const getRecentTransactions = () => transactions.value;

	const getWeeklyData = () => {
		const weeklyData = [];
		const startDate =
			dateRangeStore.start !== 0
				? new Date(dateRangeStore.start * 1000)
				: new Date(
						transactions.value[transactions.value.length - 1]
							?.date_transaction || Date.now()
				  );
		const endDate =
			dateRangeStore.end !== 0
				? new Date(dateRangeStore.end * 1000)
				: new Date(transactions.value[0]?.date_transaction || Date.now());
		const currentDate = new Date(startDate);

		while (currentDate <= endDate) {
			const weekEnd = new Date(currentDate);
			weekEnd.setDate(weekEnd.getDate() + 6);

			const weekIncome = transactions.value
				.filter(
					(transaction) =>
						transaction.type === "income" &&
						new Date(transaction.date_transaction) >= currentDate &&
						new Date(transaction.date_transaction) <= weekEnd
				)
				.reduce((sum, transaction) => sum + transaction.amount, 0);

			const weekExpenses = transactions.value
				.filter(
					(transaction) =>
						transaction.type === "expense" &&
						new Date(transaction.date_transaction) >= currentDate &&
						new Date(transaction.date_transaction) <= weekEnd
				)
				.reduce((sum, transaction) => sum + transaction.amount, 0);

			weeklyData.push({
				name: `${currentDate.toLocaleDateString()} - ${weekEnd.toLocaleDateString()}`,
				income: weekIncome,
				expenses: weekExpenses,
			});

			currentDate.setDate(currentDate.getDate() + 7);
		}

		return weeklyData;
	};

	const addTransaction = async (
		type: "income" | "expense",
		category: string,
		amount: number,
		date_transaction: string
	) => {
		const { data: userData, error: userError } =
			await client.auth.getUserIdentities();

		if (userError) {
			console.error("Error getting user identities:", userError);
			return;
		}

		const user_id = userData?.identities?.[0]?.user_id;

		if (!user_id) {
			console.error("User ID not found");
			return;
		}

		const { data, error } = await client
			.from("data")
			.insert([{ type, category, amount, date_transaction, user_id }]);

		if (error) {
			console.error("Error adding transaction:", error);
			return;
		}

		// Fetch the updated transactions after adding the new one
		await fetchTransactions();
	};

	const getTopCategories = () => {
		const incomeCategories = transactions.value
			.filter((transaction) => transaction.type === "income")
			.reduce((acc, transaction) => {
				acc[transaction.category] =
					(acc[transaction.category] || 0) + transaction.amount;
				return acc;
			}, {} as Record<string, number>);

		const expenseCategories = transactions.value
			.filter((transaction) => transaction.type === "expense")
			.reduce((acc, transaction) => {
				acc[transaction.category] =
					(acc[transaction.category] || 0) + transaction.amount;
				return acc;
			}, {} as Record<string, number>);

		const topIncomeCategory = Object.entries(incomeCategories).sort(
			(a, b) => b[1] - a[1]
		)[0];

		const topExpenseCategory = Object.entries(expenseCategories).sort(
			(a, b) => b[1] - a[1]
		)[0];

		return { topIncomeCategory, topExpenseCategory };
	};
	watch(() => dateRangeStore.start, fetchTransactions);
	watch(() => dateRangeStore.end, fetchTransactions);

	// Initial fetch
	fetchTransactions();

	return {
		getIncome,
		getExpenses,
		getBalance,
		getWeeklyData,
		getRecentTransactions,
		addTransaction,
		getTopCategories,
	};
};
