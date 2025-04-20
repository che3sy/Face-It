<script type="ts" setup>
	import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
	import { Button } from '@/components/ui/button'
	import { Input } from '@/components/ui/input'
	import { Label } from '@/components/ui/label'
	import {
	    Popover,
	    PopoverContent,
	    PopoverTrigger,
	} from '@/components/ui/popover'

	import { useFinancialData } from '@/composables/useFinancialData'


	const { addTransaction } = useFinancialData()

	const type = ref('income')
	const category = ref('')
	const customCategory = ref('')
	const amount = ref(0)
	const date_transaction = ref('')

	const predefinedCategories = {
		income: [
			"Salary",
			"Chores",
			"Gift",
			"Allowance",
			"Freelance",
			"Other",
			"Custom",
		],
		expense: [
			"Food",
			"Clothing",
			"Books",
			"Tuition",
			"Transport",
			"Entertainment",
			"Other",
			"Custom",
		],
	}

	const handleSubmit = async () => {
	    const finalCategory = category.value === 'Custom' ? customCategory.value : category.value
	    await addTransaction(type.value, finalCategory, amount.value, date_transaction.value)
	    // Reset form fields
	    type.value = 'income'
	    category.value = ''
	    customCategory.value = ''
	    amount.value = 0
	    date_transaction.value = ''
	}
</script>

<template>
	<MainHeader />
	<div class="flex flex-col w-full h-fit px-4 pt-6">
		<Tabs default-value="Overview">
			<div class="flex flex-row items-center">
				<TabsList>
					<TabsTrigger value="Overview"> Overview </TabsTrigger>
					<TabsTrigger value="Table"> Table </TabsTrigger>
					<TabsTrigger value="Analytics"> Analytics </TabsTrigger>
					<TabsTrigger value="Reports"> Report </TabsTrigger>
				</TabsList>
				<Popover>
					<PopoverTrigger as-child>
						<Button
							variant="secondary"
							class="py-4-5 ml-4">
							<LucideSquarePlus color="#22C55E" /> Add Transaction
						</Button>
					</PopoverTrigger>
					<PopoverContent class="w-80">
						<div class="grid gap-4">
							<div class="space-y-2">
								<h4 class="font-medium leading-none"> Add Transaction </h4>
								<p class="text-sm text-muted-foreground">
									Fill in the details below to add a new transaction.
								</p>
							</div>
							<div class="grid gap-2">
								<div class="grid grid-cols-3 items-center gap-4">
									<Label for="type">Type</Label>
									<select
										v-model="type"
										id="type"
										class="col-span-2 h-8 flex w-full rounded-md border border-input bg-background text-sm ring-offset-background">
										<option value="income">Income</option>
										<option value="expense">Expense</option>
									</select>
								</div>
								<div class="grid grid-cols-3 items-center gap-4">
									<Label for="category">Category</Label>
									<select
										v-model="category"
										id="category"
										class="col-span-2 h-8 flex w-full rounded-md border border-input bg-background text-sm ring-offset-background">
										<option
											v-for="cat in predefinedCategories[type]"
											:key="cat"
											:value="cat"
											>{{ cat }}</option
										>
										<option value="Custom">Custom</option>
									</select>
								</div>
								<div
									v-if="category === 'Custom'"
									class="grid grid-cols-3 items-center gap-4">
									<Label for="customCategory">Custom Category</Label>
									<Input
										id="customCategory"
										type="text"
										v-model="customCategory"
										class="col-span-2 h-8" />
								</div>
								<div class="grid grid-cols-3 items-center gap-4">
									<Label for="amount">Amount</Label>
									<Input
										id="amount"
										type="number"
										v-model="amount"
										class="col-span-2 h-8" />
								</div>
								<div class="grid grid-cols-3 items-center gap-4">
									<Label for="date_transaction">Date</Label>
									<Input
										id="date_transaction"
										type="date"
										v-model="date_transaction"
										class="col-span-2 h-8" />
								</div>
								<Button
									@click="handleSubmit"
									class="mt-4"
									>Add Transaction</Button
								>
							</div>
						</div>
					</PopoverContent>
				</Popover>
			</div>
			<TabsContent value="Overview">
				<PagesOverviewContent />
			</TabsContent>
			<TabsContent value="Table">
				<PagesTable />
			</TabsContent>

			<TabsContent value="Analytics"> <PagesAnalytics /> </TabsContent>
			<TabsContent value="Reports">
				<PagesReports />
			</TabsContent>
		</Tabs>
	</div>
</template>

<style scoped>
	.py-4-5 {
		padding-top: 1.2rem /* 16px */;
		padding-bottom: 1.2rem /* 16px */;
	}
</style>
