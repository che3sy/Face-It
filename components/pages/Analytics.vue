<script lang="ts" setup>
	import {
		Card,
		CardContent,
		CardDescription,
		CardFooter,
		CardHeader,
		CardTitle,
	} from "@/components/ui/card";
	import { Separator } from "@/components/ui/separator";
	const {
		getIncome,
		getExpenses,
		getBalance,
		getPeriodData,
		getRecentTransactions,
		getTopCategories,
		getIncomeCategories,
		getExpenseCategories,
		predictFutureData,
	} = useFinancialData();

	interface Transaction {
		type: "income" | "expense";
		category: string;
		amount: number;
		date_transaction: string;
		date_created: string;
	}

	const isLoading = ref(true);
	const income = ref(0);
	const expenses = ref(0);
	const balance = ref(0);
	const periodData = ref<{ name: string; income: number; expenses: number }[]>(
		[]
	);

	const futureData = ref<
		{ name: string; income: number; expenses: number; balance: number }[]
	>([]);

	const recentTransactions = ref<Transaction[]>([]);
	const topCategory = ref<[string, number] | null>(null);

	const periodName = ref("week");
	const incomeChange = ref(0);
	const expensesChange = ref(0);
	const balanceChange = ref(0);

	const refreshData = async () => {
		isLoading.value = true;
		recentTransactions.value = await getRecentTransactions();
		income.value = getIncome();
		expenses.value = getExpenses();
		balance.value = getBalance();
		topCategory.value = getTopCategories();

		isLoading.value = false;

		periodData.value = getPeriodData();
		futureData.value = predictFutureData(periodData.value, 5);

		if (periodData.value.length > 1) {
			const lastPeriod = periodData.value[periodData.value.length - 1];
			const previousPeriod = periodData.value[periodData.value.length - 2];

			incomeChange.value =
				previousPeriod.income !== 0
					? ((lastPeriod.income - previousPeriod.income) /
							previousPeriod.income) *
					  100
					: 0;
			expensesChange.value =
				previousPeriod.expenses !== 0
					? ((lastPeriod.expenses - previousPeriod.expenses) /
							previousPeriod.expenses) *
					  100
					: 0;

			const lastPeriodBalance = lastPeriod.income - lastPeriod.expenses;
			const previousPeriodBalance =
				previousPeriod.income - previousPeriod.expenses;

			balanceChange.value =
				previousPeriodBalance !== 0
					? ((lastPeriodBalance - previousPeriodBalance) /
							Math.abs(previousPeriodBalance)) *
					  100
					: 0;
		} else {
			incomeChange.value = 0;
			expensesChange.value = 0;
			balanceChange.value = 0;
		}
	};

	onMounted(() => {
		refreshData();
	});
	watch(
		() => [useDateRangeStore().start, useDateRangeStore().end],
		() => {
			refreshData();
		}
	);
	watch(
		() => useDateRangeStore().period,
		() => {
			refreshData();
		}
	);
	import { DonutChart } from "@/components/ui/chart-donut";

	const incomeCategoryData = computed(() => {
		const categories = getIncomeCategories();
		return Object.values(categories);
	});

	const expenseCategoryData = computed(() => {
		const categories = getExpenseCategories();
		return Object.values(categories);
	});

	const defaultColors = (count: number = 3) => {
		const quotient = Math.floor(count / 2);
		const remainder = count % 2;

		const primaryCount = quotient + remainder;
		const secondaryCount = quotient;
		return [
			...Array.from(new Array(primaryCount).keys()).map(
				(i) => `hsl(var(--destructive) / ${1 - (1 / primaryCount) * i})`
			),
			...Array.from(new Array(secondaryCount).keys()).map(
				(i) => `hsl(var(--yellow) / ${1 - (1 / secondaryCount) * i})`
			),
		];
	};

	const expenseColors = computed(() => {
		return defaultColors(expenseCategoryData.value.length);
	});

	import { LineChart } from "@/components/ui/chart-line";
</script>
<template>
	<div class="relative flex flex-row items-center justify-center py-2">
		<div
			class="absolute inset-0 h-full w-full bg-background bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] -z-10"></div>

		<Card>
			<CardHeader
				class="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle class="text-4xl font-bold flex flex-row items-center">
					Balance:
					<div class="ml-2"> ${{ balance.toFixed(2) }} </div>
				</CardTitle>
			</CardHeader>
			<CardContent>
				<p
					class="text-xs"
					:class="
						balanceChange > 0
							? 'text-primary'
							: balanceChange < 0
							? 'text-destructive'
							: 'text-gray-400'
					">
					{{ balanceChange >= 0 ? "+" : "" }}{{ balanceChange.toFixed(1) }}%
					from last week
				</p>
			</CardContent>
		</Card>
	</div>
	<Separator
		orientation="vertical"
		class="mb-4 w-full py-[0.5px]" />
	<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
		<Card class="col-span-1">
			<CardHeader>
				<CardTitle>Income Categories</CardTitle>
			</CardHeader>
			<CardContent class="pl-2">
				<DonutChart
					v-if="!isLoading"
					index="name"
					:category="'amount'"
					:data="incomeCategoryData"
					:value-formatter="
						(tick) =>
							typeof tick === 'number'
								? `$ ${new Intl.NumberFormat('us').format(tick).toString()}`
								: ''
					" />
			</CardContent>
		</Card>
		<Card class="col-span-2">
			<CardHeader>
				<CardTitle>Income vs. Expenses</CardTitle>
			</CardHeader>
			<CardDescription class="pl-6"
				>Line chart version of Income vs. Expenses
			</CardDescription>
			<CardContent class="pl-2">
				<LineChart
					v-if="!isLoading"
					index="name"
					:data="periodData"
					:categories="['income', 'expenses']"
					:y-formatter="
						(tick) => {
							return typeof tick === 'number'
								? `$ ${new Intl.NumberFormat('us').format(tick).toString()}`
								: '';
						}
					"
					:rounded-corners="4"
					:colors="['hsl(var(--primary))', 'hsl(var(--destructive))']" />
			</CardContent>
		</Card>
		<Card class="col-span-1">
			<CardHeader>
				<CardTitle>Expense Categories</CardTitle>
			</CardHeader>
			<CardContent class="pl-2">
				<DonutChart
					v-if="!isLoading"
					index="name"
					:category="'amount'"
					:data="expenseCategoryData"
					:colors="expenseColors"
					:value-formatter="
						(tick) =>
							typeof tick === 'number'
								? `$ ${new Intl.NumberFormat('us').format(tick).toString()}`
								: ''
					" />
			</CardContent>
		</Card>
		<Card class="col-span-2">
			<CardHeader>
				<CardTitle>Income vs. Expenses </CardTitle>
			</CardHeader>
			<CardDescription class="pl-6"
				>Bar chart version of Income vs. Expenses
			</CardDescription>
			<CardContent class="pl-2">
				<BarChart
					v-if="!isLoading"
					index="name"
					:data="periodData"
					:categories="['income', 'expenses']"
					:y-formatter="
						(tick, i) => {
							return typeof tick === 'number'
								? `$ ${new Intl.NumberFormat('us').format(tick).toString()}`
								: '';
						}
					"
					:rounded-corners="4"
					:colors="['hsl(var(--primary))', 'hsl(var(--destructive))']" />
			</CardContent>
		</Card>
		<Card class="col-span-2">
			<CardHeader>
				<CardTitle>Category Spending</CardTitle>
			</CardHeader>
			<CardContent class="pl-2">
				<BarChart
					v-if="!isLoading"
					index="name"
					:data="[...incomeCategoryData, ...expenseCategoryData]"
					:categories="['amount']"
					:y-formatter="
						(tick, i) => {
							return typeof tick === 'number'
								? `$ ${new Intl.NumberFormat('us').format(tick).toString()}`
								: '';
						}
					"
					:rounded-corners="4" />
			</CardContent>
		</Card>
		<Card class="col-span-4">
			<CardHeader>
				<CardTitle>Predicted Trends</CardTitle>
			</CardHeader>
			<CardContent class="pl-2">
				<LineChart
					v-if="!isLoading"
					index="name"
					:data="futureData"
					:categories="['income', 'expenses', 'balance']"
					:y-formatter="
						(tick) => {
							return typeof tick === 'number'
								? `$ ${new Intl.NumberFormat('us').format(tick).toString()}`
								: '';
						}
					"
					:rounded-corners="4"
					:colors="[
						'hsl(var(--primary))',
						'hsl(var(--destructive))',
						'hsl(var(--yellow))',
					]" />
			</CardContent>
		</Card>
	</div>
</template>
