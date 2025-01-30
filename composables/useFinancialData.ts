export const useFinancialData = () => {
	if (import.meta.env.SSR) {
		return {
			getIncome: () => 0,
			getExpenses: () => 0,
			getBalance: () => 0,
			getPeriodData: () => [],
			getRecentTransactions: async () => [],
			addTransaction: async () => {},
			editTransaction: async () => {},
			deleteTransaction: async () => {},
			getTopCategories: () => undefined,
			getIncomeCategories: () => ({}),
			getExpenseCategories: () => ({}),
			predictFutureData: () => [],
		};
	}

	const client = useSupabaseClient<{
		data: {
			type: "income" | "expense";
			category: string;
			amount: number;
			date_transaction: string;
			date_created: string;
		};
	}>();
	const dateRangeStore = useDateRangeStore();
	const triggerStore = useTriggerStore();

	interface Transaction {
		type: "income" | "expense";
		category: string;
		amount: number;
		date_transaction: string;
		date_created: string;
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
	const getRecentTransactions = async (): Promise<Transaction[]> => {
		await fetchTransactions();
		return transactions.value;
	};

	const getPeriodData = () => {
		const periodData = [];
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

		const period = dateRangeStore.period;

		const getNextDate = (date: Date) => {
			const newDate = new Date(date);
			switch (period) {
				case "daily":
					newDate.setDate(newDate.getDate() + 1);
					break;
				case "weekly":
					newDate.setDate(newDate.getDate() + 7);
					break;
				case "monthly":
					newDate.setMonth(newDate.getMonth() + 1);
					break;
				case "yearly":
					newDate.setFullYear(newDate.getFullYear() + 1);
					break;
			}
			return newDate;
		};

		while (currentDate <= endDate) {
			const nextDate = getNextDate(currentDate);

			const periodIncome = transactions.value
				.filter(
					(transaction) =>
						transaction.type === "income" &&
						new Date(transaction.date_transaction) >= currentDate &&
						new Date(transaction.date_transaction) < nextDate
				)
				.reduce((sum, transaction) => sum + transaction.amount, 0);

			const periodExpenses = transactions.value
				.filter(
					(transaction) =>
						transaction.type === "expense" &&
						new Date(transaction.date_transaction) >= currentDate &&
						new Date(transaction.date_transaction) < nextDate
				)
				.reduce((sum, transaction) => sum + transaction.amount, 0);

			periodData.push({
				name: `${currentDate.toLocaleDateString()} - ${nextDate.toLocaleDateString()}`,
				income: periodIncome,
				expenses: periodExpenses,
			});

			currentDate.setTime(nextDate.getTime());
		}

		return periodData;
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
		triggerStore.toggelTrigger();
	};

	const editTransaction = async (
		id: number,
		updatedTransaction: Partial<Transaction>
	) => {
		const { data, error } = await client
			.from("data")
			.update({
				type: updatedTransaction.type,
				category: updatedTransaction.category,
				amount: updatedTransaction.amount,
				date_transaction: updatedTransaction.date_transaction,
			})
			.eq("id", id);

		if (error) {
			console.error("Error editing transaction:", error);
			return;
		}

		// Fetch the updated transactions after editing the transaction
		await fetchTransactions();
		triggerStore.toggelTrigger();
	};

	const deleteTransaction = async (id: number) => {
		const { data, error } = await client.from("data").delete().eq("id", id);

		if (error) {
			console.error("Error deleting transaction:", error);
			return;
		}

		// Fetch the updated transactions after deleting the transaction
		await fetchTransactions();
		triggerStore.toggelTrigger();
	};

	const getTopCategories = () => {
		const categories = transactions.value.reduce((acc, transaction) => {
			acc[transaction.category] =
				(acc[transaction.category] || 0) + transaction.amount;
			return acc;
		}, {} as Record<string, number>);

		const topCategory = Object.entries(categories).sort(
			(a, b) => b[1] - a[1]
		)[0];

		return topCategory;
	};

	const getIncomeCategories = () => {
		const incomeCategories: Record<string, number> = transactions.value
			.filter((transaction) => transaction.type === "income")
			.reduce((acc, transaction) => {
				acc[transaction.category] =
					(acc[transaction.category] || 0) + transaction.amount;
				return acc;
			}, {} as Record<string, number>);

		const data = Object.entries(incomeCategories).map(([category, amount]) => ({
			category,
			amount,
		}));

		return data.reduce((acc, { category, amount }) => {
			acc[category] = {
				name: category,
				amount: amount,
			};
			return acc;
		}, {} as Record<string, { name: string; amount: number }>);
	};

	const getExpenseCategories = () => {
		const expenseCategories: Record<string, number> = transactions.value
			.filter((transaction) => transaction.type === "expense")
			.reduce((acc, transaction) => {
				acc[transaction.category] =
					(acc[transaction.category] || 0) + transaction.amount;
				return acc;
			}, {} as Record<string, number>);

		const data = Object.entries(expenseCategories).map(
			([category, amount]) => ({
				category,
				amount,
			})
		);

		return data.reduce((acc, { category, amount }) => {
			acc[category] = {
				name: category,
				amount: amount,
			};
			return acc;
		}, {} as Record<string, { name: string; amount: number }>);
	};

	const predictFutureData = (
		periodData: { name: string; income: number; expenses: number }[],
		periods: number
	) => {
		const incomeData = periodData.map((d, i) => ({ x: i, y: d.income }));
		const expensesData = periodData.map((d, i) => ({ x: i, y: d.expenses }));
		const balanceData = periodData.map((d, i) => ({
			x: i,
			y: d.income - d.expenses,
		}));

		const incomeRegression = linearRegression(incomeData);
		const expensesRegression = linearRegression(expensesData);
		const balanceRegression = linearRegression(balanceData);

		const futureData = [];
		for (let i = 0; i < periods; i++) {
			const x = periodData.length + i;
			const nextDate = new Date();
			switch (dateRangeStore.period) {
				case "daily":
					nextDate.setDate(nextDate.getDate() + i + 1);
					break;
				case "weekly":
					nextDate.setDate(nextDate.getDate() + (i + 1) * 7);
					break;
				case "monthly":
					nextDate.setMonth(nextDate.getMonth() + i + 1);
					break;
				case "yearly":
					nextDate.setFullYear(nextDate.getFullYear() + i + 1);
					break;
			}
			futureData.push({
				name: nextDate.toLocaleDateString(),
				income: predict(incomeRegression, x),
				expenses: predict(expensesRegression, x),
				balance: predict(balanceRegression, x),
			});
		}

		return futureData;
	};

	watch(() => dateRangeStore.start, fetchTransactions);
	watch(() => dateRangeStore.end, fetchTransactions);

	// Initial fetch
	fetchTransactions();

	return {
		getIncome,
		getExpenses,
		getBalance,
		getPeriodData,
		getRecentTransactions,
		addTransaction,
		getTopCategories,
		editTransaction,
		deleteTransaction,
		getIncomeCategories,
		getExpenseCategories,
		predictFutureData,
	};
};
