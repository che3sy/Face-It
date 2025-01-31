<script setup lang="ts">
	import { Button } from "@/components/ui/button";
	import {
		DropdownMenu,
		DropdownMenuContent,
		DropdownMenuItem,
		DropdownMenuLabel,
		DropdownMenuSeparator,
		DropdownMenuTrigger,
	} from "@/components/ui/dropdown-menu";
	import { MoreHorizontal } from "lucide-vue-next";
	import { useFinancialData } from "@/composables/useFinancialData";

	import {
		Dialog,
		DialogContent,
		DialogDescription,
		DialogFooter,
		DialogHeader,
		DialogTitle,
		DialogTrigger,
	} from "@/components/ui/dialog";
	import {
		Form,
		FormControl,
		FormDescription,
		FormField,
		FormItem,
		FormLabel,
		FormMessage,
	} from "@/components/ui/form";

	import { Input } from "@/components/ui/input";
	import { toTypedSchema } from "@vee-validate/zod";
	import * as z from "zod";

	const formSchema = toTypedSchema(
		z.object({
			type: z.enum(["income", "expense"]).optional(),
			category: z.string().optional(),
			customCategory: z.string().optional(),
			amount: z.number().positive().optional(), // This allows decimal values
			date_transaction: z.string().optional(),
		})
	);

	const props = defineProps<{
		transaction: {
			id: number;
			type: "income" | "expense";
			category: string;
			amount: number;
			date_transaction: string;
			date_created: string;
			customCategory?: string;
		};
	}>();

	defineEmits<{
		(e: "expand"): void;
	}>();

	const { editTransaction, deleteTransaction } = useFinancialData();

	function copy(id: number) {
		navigator.clipboard.writeText(id.toString());
	}

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
	};

	const type = ref(props.transaction.type);

	function onSubmit(values: any) {
		values.type = type.value;
		if (values.category === "Custom") {
			values.category =
				values.customCategory || props.transaction.customCategory;
		}
		if (!values.amount) values.amount = props.transaction.amount;
		if (!values.date_transaction)
			values.date_transaction = props.transaction.date_transaction;

		editTransaction(props.transaction.id, values);
	}

	async function handleDelete() {
		await deleteTransaction(props.transaction.id);
	}
</script>

<template>
	<Form
		v-slot="{ handleSubmit }"
		as=""
		keep-values
		:validation-schema="formSchema">
		<Dialog>
			<DropdownMenu>
				<DropdownMenuTrigger as-child>
					<Button
						variant="ghost"
						class="w-8 h-8 p-0">
						<span class="sr-only">Open menu</span>
						<MoreHorizontal class="w-4 h-4" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuLabel>Actions</DropdownMenuLabel>
					<DropdownMenuItem @click="copy(transaction.id)">
						Copy Transaction ID
					</DropdownMenuItem>
					<DropdownMenuSeparator />

					<DialogTrigger as-child>
						<DropdownMenuItem>Edit Transaction</DropdownMenuItem>
					</DialogTrigger>

					<DropdownMenuItem @click="handleDelete"
						>Delete Transaction</DropdownMenuItem
					>
					<DropdownMenuSeparator />
					<DropdownMenuItem @click="$emit('expand')"> Expand </DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
			<DialogContent class="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Edit Transaction</DialogTitle>
					<DialogDescription>
						Make changes to your transaction here. Click save when you're done.
					</DialogDescription>
				</DialogHeader>
				<form
					id="dialogForm"
					@submit="handleSubmit($event, onSubmit)">
					<FormField
						name="type"
						v-slot="{ componentField }">
						<FormItem>
							<FormLabel>Type</FormLabel>
							<FormControl>
								<select
									v-model="type"
									class="col-span-2 h-8 flex w-full rounded-md border border-input bg-background text-sm ring-offset-background">
									>
									<option value="income">Income</option>
									<option value="expense">Expense</option>
								</select>
							</FormControl>
							<FormMessage />
						</FormItem>
					</FormField>

					<FormField
						name="category"
						v-slot="{ componentField, value }">
						<FormItem>
							<FormLabel>Category</FormLabel>
							<FormControl>
								<select
									v-bind="componentField"
									class="col-span-2 h-8 flex w-full rounded-md border border-input bg-background text-sm ring-offset-background">
									>
									<option
										v-for="cat in predefinedCategories[type]"
										:key="cat"
										:value="cat">
										{{ cat }}
									</option>
								</select>
							</FormControl>
							<FormMessage />
						</FormItem>
						<FormField
							v-if="value === 'Custom'"
							name="customCategory"
							v-slot="{ componentField }">
							<FormItem>
								<FormLabel>Custom Category</FormLabel>
								<FormControl>
									<Input
										type="text"
										v-bind="componentField"
										:placeholder="
											props.transaction.category || 'Custom Category'
										" />
								</FormControl>
								<FormMessage />
							</FormItem>
						</FormField>
					</FormField>

					<FormField
						name="amount"
						v-slot="{ componentField }">
						<FormItem>
							<FormLabel>Amount</FormLabel>
							<FormControl>
								<Input
									type="number"
									step="0.01"
									v-bind="componentField"
									:placeholder="props.transaction.amount.toString()" />
							</FormControl>
							<FormMessage />
						</FormItem>
					</FormField>

					<FormField
						name="date_transaction"
						v-slot="{ componentField }">
						<FormItem>
							<FormLabel>Date</FormLabel>
							<FormControl>
								<Input
									type="date"
									v-bind="componentField"
									:placeholder="props.transaction.date_transaction" />
							</FormControl>
							<FormMessage />
						</FormItem>
					</FormField>
				</form>
				<DialogFooter>
					<DialogClose as-child>
						<Button
							type="submit"
							form="dialogForm">
							Save Changes
						</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	</Form>
</template>
