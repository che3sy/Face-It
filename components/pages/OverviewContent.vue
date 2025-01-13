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

	import { ref, watchEffect } from 'vue'

	const { getIncome, getExpenses, getBalance, getWeeklyData, getRecentTransactions, getTopCategories } = useFinancialData()
	import { Separator } from '@/components/ui/separator'

	const income = ref(0)
	const expenses = ref(0)
	const balance = ref(0)
	const weeklyData = ref([])
	const recentTransactions = ref([])
	   const topIncomeCategory = ref(null)
	   const topExpenseCategory = ref(null)

	const lastWeekIncome = ref(0)
	const lastWeekExpenses = ref(0)
	const lastWeekBalance = ref(0)

	const incomeChange = ref(0)
	const expensesChange = ref(0)
	const balanceChange = ref(0)

	const refreshData = () => {
	       income.value = getIncome()
	       expenses.value = getExpenses()
	       balance.value = getBalance()
	       weeklyData.value = getWeeklyData()
	       recentTransactions.value = getRecentTransactions()
	       const { topIncomeCategory: incomeCat, topExpenseCategory: expenseCat } = getTopCategories()
	       topIncomeCategory.value = incomeCat
	       topExpenseCategory.value = expenseCat

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
	   }

	   watchEffect(refreshData)
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
					last week
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
				<CardTitle class="text-sm font-medium"> Top Categories </CardTitle>
				<LucidePieChart class="h-4 w-4 text-muted-foreground" />
			</CardHeader>
			<CardContent>
				<div>
					<h5 class="font-medium">Income</h5>
					<p
						class="text-primary"
						v-if="topIncomeCategory">
						{{ topIncomeCategory[0] }}: ${{ topIncomeCategory[1] }}
					</p>
					<p v-else>No income data</p>
				</div>
				<div class="mt-4">
					<h5 class="font-medium">Expenses</h5>
					<p
						class="text-destructive"
						v-if="topExpenseCategory">
						{{ topExpenseCategory[0] }}: ${{ topExpenseCategory[1] }}
					</p>
					<p v-else>No expense data</p>
				</div>
			</CardContent>
		</Card>
	</div>
	<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-4">
		<Card class="col-span-4">
			<CardHeader>
				<CardTitle>Overview</CardTitle>
			</CardHeader>
			<CardContent class="pl-2">
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
