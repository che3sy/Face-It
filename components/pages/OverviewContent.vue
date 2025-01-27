<script type="ts" setup>
		import {
		  Card,
		  CardContent,
		  CardDescription,
		  CardFooter,
		  CardHeader,
		  CardTitle,
		} from '@/components/ui/card'
		import { BarChart } from '@/components/ui/chart-bar'
		import { useFinancialData } from '@/composables/useFinancialData'

		const { getIncome, getExpenses, getBalance, getPeriodData, getRecentTransactions, getTopCategories } = useFinancialData()
		import { Separator } from '@/components/ui/separator'

		const isLoading = ref(true)
		const income = ref(0)
		const expenses = ref(0)
		const balance = ref(0)
		const periodData = ref([])
		const recentTransactions = ref([])
		const topCategory = ref(null)

		const periodName = ref('week')
		const incomeChange = ref(0)
		const expensesChange = ref(0)
		const balanceChange = ref(0)

		   const refreshData = async () => {
		       isLoading.value = true
		       recentTransactions.value = await getRecentTransactions()
		       income.value = getIncome()
		       expenses.value = getExpenses()
		       balance.value = getBalance()
			   topCategory.value = getTopCategories()
			   periodName.value = useDateRangeStore().periodName

		       isLoading.value = false

		       periodData.value = getPeriodData()



			   if (periodData.value.length > 1) {
	       const lastPeriod = periodData.value[periodData.value.length - 1]
	       const previousPeriod = periodData.value[periodData.value.length - 2]

	       incomeChange.value = previousPeriod.income !== 0 ? ((lastPeriod.income - previousPeriod.income) / previousPeriod.income) * 100 : 0
	       expensesChange.value = previousPeriod.expenses !== 0 ? ((lastPeriod.expenses - previousPeriod.expenses) / previousPeriod.expenses) * 100 : 0

	       const lastPeriodBalance = lastPeriod.income - lastPeriod.expenses
	       const previousPeriodBalance = previousPeriod.income - previousPeriod.expenses

	       balanceChange.value = previousPeriodBalance !== 0 ? ((lastPeriodBalance - previousPeriodBalance) / Math.abs(previousPeriodBalance)) * 100 : 0
	   } else {
	       incomeChange.value = 0
	       expensesChange.value = 0
	       balanceChange.value = 0
	   }
		   }

		   onMounted(() => {
		       refreshData()
		   })
		   watch(
		       () => [useDateRangeStore().start, useDateRangeStore().end],
		       () => {
		           refreshData()
		       }
		   )
		   watch(
		       () => useDateRangeStore().period,
		       () => {
		           refreshData()
		       }
		   )
		   const lastFiveTransactions = computed(() => {
	   	return recentTransactions.value.slice(0, 5);
	});
</script>

<template>
	<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
		<Card>
			<CardHeader
				class="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle class="text-sm font-medium"> Balance </CardTitle>
				<LucideDollarSign class="h-4 w-4 text-muted-foreground" />
			</CardHeader>
			<CardContent>
				<div class="text-2xl font-bold"> ${{ balance }} </div>
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
		<Card>
			<CardHeader
				class="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle class="text-sm font-medium"> Income </CardTitle>
				<LucideTrendingUp class="h-4 w-4 text-primary" />
			</CardHeader>
			<CardContent>
				<div class="text-2xl font-bold text-primary"> +{{ income }} </div>
				<p
					class="text-xs"
					:class="
						incomeChange > 0
							? 'text-primary'
							: incomeChange < 0
							? 'text-destructive'
							: 'text-gray-400'
					">
					{{ incomeChange >= 0 ? "+" : "" }}{{ incomeChange.toFixed(1) }}% from
					last {{ periodName }}
				</p>
			</CardContent>
		</Card>
		<Card>
			<CardHeader
				class="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle class="text-sm font-medium"> Expenses </CardTitle>
				<LucideTrendingDown class="h-4 w-4 text-destructive" />
			</CardHeader>
			<CardContent>
				<div class="text-2xl font-bold text-destructive"> -{{ expenses }} </div>
				<p
					class="text-xs"
					:class="
						expensesChange < 0
							? 'text-primary'
							: expensesChange > 0
							? 'text-destructive'
							: 'text-gray-400'
					">
					{{ expensesChange >= 0 ? "+" : "" }}{{ expensesChange.toFixed(1) }}%
					from last {{ periodName }}
				</p>
			</CardContent>
		</Card>
		<Card>
			<CardHeader
				class="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle class="text-sm font-medium"> Top Category </CardTitle>
				<LucidePieChart class="h-4 w-4 text-muted-foreground" />
			</CardHeader>
			<CardContent>
				<div v-if="topCategory">
					<p class="font-bold text-2xl"
						>{{ topCategory[0] }}: ${{ topCategory[1] }}</p
					>
				</div>
				<div v-else>
					<p>No category data</p>
				</div>
			</CardContent>
		</Card>
	</div>
	<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-4">
		<Card class="col-span-4">
			<CardHeader>
				<CardTitle>Income vs. Expenses </CardTitle>
			</CardHeader>
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
		<Card class="col-span-3">
			<CardHeader>
				<CardTitle>Recent Transactions</CardTitle>
				<CardDescription>
					{{ lastFiveTransactions.length }} recent transactions in this period.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<ul>
					<li
						v-for="transaction in lastFiveTransactions"
						:key="transaction.id"
						class="mb-2">
						<div
							class="flex flex-row justify-between rounded-lg border bg-card text-card-foreground shadow-sm p-4">
							<div class="flex flex-col">
								<div class="flex flex-row items-center space-x-2 font-medium">
									<LucidePlusCircle
										v-if="transaction.type === 'income'"
										class="h-6 w-6 -mb-2 text-primary" />
									<LucideMinusCircle
										v-else
										class="h-6 w-6 -mb-2 text-destructive" />

									<span>{{ transaction.category }}</span>
								</div>
								<div
									class="ml-8 font-normal text-xs flex flex-row text-gray-400 items-center">
									<span
										>Date of Transaction:
										{{
											new Date(
												transaction.date_transaction
											).toLocaleDateString()
										}}</span
									>
									<Separator
										orientation="vertical"
										class="my-1 mx-2" />
									<span
										>Date Created:
										{{
											new Date(transaction.date_created).toLocaleDateString()
										}}</span
									>
								</div>
							</div>
							<div class="flex flex-col text-right">
								<span>${{ transaction.amount }}</span>
								<span class="font-normal text-xs text-gray-400">{{
									transaction.type
								}}</span>
							</div>
						</div>
					</li>
				</ul>
			</CardContent>
		</Card>
	</div>
</template>
