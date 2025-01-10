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


	   const { getIncome, getExpenses, getBalance, getWeeklyData, getRecentTransactions } = useFinancialData()

	const income = ref(0)
	const expenses = ref(0)
	const balance = ref(0)
	const weeklyData = ref([])
	const recentTransactions = ref([])

	   const lastWeekIncome = ref(0)
	   const lastWeekExpenses = ref(0)
	   const lastWeekBalance = ref(0)

	   const incomeChange = ref(0)
	   const expensesChange = ref(0)
	   const balanceChange = ref(0)

	   watchEffect(() => {
	     income.value = getIncome()
	     expenses.value = getExpenses()
	     balance.value = getBalance()
	     weeklyData.value = getWeeklyData()
	     recentTransactions.value = getRecentTransactions()

	     if (weeklyData.value.length > 1) {
	       lastWeekIncome.value = weeklyData.value[weeklyData.value.length - 2].income
	       lastWeekExpenses.value = weeklyData.value[weeklyData.value.length - 2].expenses
	       lastWeekBalance.value = lastWeekIncome.value - lastWeekExpenses.value

	       incomeChange.value = lastWeekIncome.value !== 0 ? ((income.value - lastWeekIncome.value) / lastWeekIncome.value) * 100 : 0
	       expensesChange.value = lastWeekExpenses.value !== 0 ? ((expenses.value - lastWeekExpenses.value) / lastWeekExpenses.value) * 100 : 0
	       balanceChange.value = lastWeekBalance.value !== 0 ? ((balance.value - lastWeekBalance.value) / lastWeekBalance.value) * 100 : 0
	     } else {
	       incomeChange.value = 0
	       expensesChange.value = 0
	       balanceChange.value = 0
	     }
	   })
</script>

<template>
	<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
		<Card>
			<CardHeader
				class="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle class="text-sm font-medium"> Total Revenue </CardTitle>
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
					from last week
				</p>
			</CardContent>
		</Card>
		<Card>
			<CardHeader
				class="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle class="text-sm font-medium"> Income </CardTitle>
				<LucideTrendingUp class="h-4 w-4 text-muted-foreground" />
			</CardHeader>
			<CardContent>
				<div class="text-2xl font-bold"> +{{ income }} </div>
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
					last week
				</p>
			</CardContent>
		</Card>
		<Card>
			<CardHeader
				class="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle class="text-sm font-medium"> Expenses </CardTitle>
				<LucideTrendingDown class="h-4 w-4 text-muted-foreground" />
			</CardHeader>
			<CardContent>
				<div class="text-2xl font-bold"> -{{ expenses }} </div>
				<p
					class="text-xs"
					:class="
						expensesChange > 0
							? 'text-primary'
							: expensesChange < 0
							? 'text-destructive'
							: 'text-gray-400'
					">
					{{ expensesChange >= 0 ? "+" : "" }}{{ expensesChange.toFixed(1) }}%
					from last week
				</p>
			</CardContent>
		</Card>
		<Card>
			<CardHeader
				class="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle class="text-sm font-medium"> Difference </CardTitle>
				<LucideDiff class="h-4 w-4 text-muted-foreground" />
			</CardHeader>
			<CardContent>
				<div class="text-2xl font-bold"> +{{ balance }} </div>
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
	<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-4">
		<Card class="col-span-4">
			<CardHeader>
				<CardTitle>Overview</CardTitle>
			</CardHeader>
			<CardContent>
				<BarChart
					index="name"
					:data="weeklyData"
					:categories="['income', 'expenses']"
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
		<Card class="col-span-3">
			<CardHeader>
				<CardTitle>Recent Transactions</CardTitle>
				<CardDescription>
					You made {{ recentTransactions.length }} transactions in this period.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<ul>
					<li
						v-for="transaction in recentTransactions"
						:key="transaction.id"
						class="mb-2">
						<div class="flex justify-between">
							<span>{{ transaction.category }}</span>
							<span>{{ transaction.amount }}</span>
						</div>
						<div class="text-xs text-muted-foreground">
							<span>{{ transaction.type }}</span>
							<span>{{
								new Date(transaction.date_transaction).toLocaleDateString()
							}}</span>
							<span>{{
								new Date(transaction.date_created).toLocaleDateString()
							}}</span>
						</div>
					</li>
				</ul>
			</CardContent>
		</Card>
	</div>
</template>
