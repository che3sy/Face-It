<script lang="ts" setup>
	import {
		Card,
		CardContent,
		CardDescription,
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
		topCategory.value = getTopCategories() || null;
		periodName.value = useDateRangeStore().periodName;

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

	type CategoryData = Record<string, any> & { amount: number };

	const incomeCategoryData = computed<CategoryData[]>(() => {
		const categories = getIncomeCategories() || {};
		return Object.values(categories) as CategoryData[];
	});

	const expenseCategoryPie = computed<CategoryData[]>(() => {
		const categories = getExpenseCategories() || {};
		return Object.values(categories) as CategoryData[];
	});

	const expenseCategoryData = computed<CategoryData[]>(() => {
		const categories = getExpenseCategories() || {};
		return (Object.values(categories) as CategoryData[]).map((category) => ({
			...category,
			amount: -category.amount,
		}));
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
	import { ColorBarChart } from "@/components/ui/ColorBarChart";

	const response = ref<string | null>(null);
	const formatResponse = (text: string) => {
		const formattedText = text
			.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // Bold text
			.replace(/\*\s<strong>/g, "<strong>") // Remove extra * before bold text
			.replace(/\n+/g, "</li><li>") // New lines to list items, handle multiple new lines
			.replace(/^<\/li><li>|<\/li><li>$/g, ""); // Remove leading and trailing <li> tags

		return `<ul><li>${formattedText}</li></ul>`;
	};

	onMounted(async () => {
		const aiResponse = await useAI();
		response.value = formatResponse(aiResponse);
	});

	const xFormatter = (
		tick: number | Date,
		i: number,
		ticks: (number | Date)[]
	) => {
		const index = typeof tick === "number" ? tick : i;
		const periodsAgo = periodData.value.length - 1 - index;
		return `${periodsAgo}`;
	};
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
					from last {{ periodName }}
				</p>
			</CardContent>
		</Card>
	</div>
	<Separator
		orientation="vertical"
		class="mb-4 w-full py-[0.5px]" />
	<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4 pb-4">
		<Card class="col-span-1">
			<CardHeader>
				<CardTitle>Income Categories</CardTitle>
			</CardHeader>
			<CardDescription class="ml-6 mb-2"
				>All income categories in a pie chart</CardDescription
			>
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
				>Line chart showing income vs. expenses over time in specified period
				intervals
			</CardDescription>
			<CardContent class="pl-2">
				<LineChart
					v-if="!isLoading"
					index="name"
					:data="periodData"
					:categories="['income', 'expenses']"
					:x-formatter="xFormatter"
					:y-formatter="
						(tick) => {
							return typeof tick === 'number'
								? `$ ${new Intl.NumberFormat('us').format(tick).toString()}`
								: '';
						}
					"
					:rounded-corners="4"
					:colors="['hsl(var(--primary))', 'hsl(var(--destructive))']" />
				<div class="flex flex-row items-center justify-center mt-2"
					><h5 class="text-sm text-muted-foreground"
						>{{ periodName }}s ago</h5
					></div
				>
			</CardContent>
		</Card>
		<Card class="col-span-1">
			<CardHeader>
				<CardTitle>Expense Categories</CardTitle>
			</CardHeader>
			<CardDescription class="ml-6 mb-2"
				>All expense categories in a pie chart</CardDescription
			>
			<CardContent class="pl-2">
				<DonutChart
					v-if="!isLoading"
					index="name"
					:category="'amount'"
					:data="expenseCategoryPie"
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
				>Bar chart showing income vs. expenses over time in specified period
				intervals
			</CardDescription>
			<CardContent class="pl-2">
				<BarChart
					v-if="!isLoading"
					index="name"
					:data="periodData"
					:categories="['income', 'expenses']"
					:x-formatter="xFormatter"
					:y-formatter="
						(tick, i) => {
							return typeof tick === 'number'
								? `$ ${new Intl.NumberFormat('us').format(tick).toString()}`
								: '';
						}
					"
					:rounded-corners="4"
					:colors="['hsl(var(--primary))', 'hsl(var(--destructive))']" />
				<div class="flex flex-row items-center justify-center mt-2"
					><h5 class="text-sm text-muted-foreground"
						>{{ periodName }}s ago</h5
					></div
				>
			</CardContent>
		</Card>
		<Card class="col-span-2">
			<CardHeader>
				<CardTitle>Total Category Value</CardTitle>
			</CardHeader>
			<CardDescription class="ml-6 mb-2"
				>The total amount spent or earned in all categories</CardDescription
			>

			<CardContent class="pl-2">
				<ColorBarChart
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
		<Card class="col-span-2">
			<CardHeader>
				<CardTitle>Predicted Trends</CardTitle>
			</CardHeader>
			<CardDescription class="ml-6 mb-2"
				>Predicted values for income, expense, and balance 5 {{ periodName }}'s
				later</CardDescription
			>
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
					:colors="[
						'hsl(var(--primary))',
						'hsl(var(--destructive))',
						'hsl(var(--yellow))',
					]" />
			</CardContent>
		</Card>
		<Card class="col-span-2">
			<CardHeader>
				<CardTitle
					class="inline-block bg-gradient-to-r from-purple-800 via-red-600 to-red-600 bg-clip-text text-transparent"
					>AI Tips</CardTitle
				>
			</CardHeader>
			<CardDescription class="ml-6 mb-2"
				>Tips from AI on how to save more money
			</CardDescription>
			<CardContent class="ml-2">
				<div
					v-html="response"
					class="ai-response"></div>
			</CardContent>
		</Card>
	</div>
</template>
<style scoped>
	.ai-response :deep(ul) {
		list-style-type: disc;
		padding-left: 20px;
	}

	.ai-response :deep(li) {
		margin-bottom: 10px;
		display: list-item;
	}
</style>
