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

	const props = defineProps<{
		transaction: {
			id: number;
			type: "income" | "expense";
			category: string;
			amount: number;
			date_transaction: string;
			date_created: string;
		};
	}>();

	const { editTransaction, deleteTransaction } = useFinancialData();

	function copy(id: number) {
		navigator.clipboard.writeText(id.toString());
	}

	async function handleEdit() {
		// Implement your edit logic here
		await editTransaction(props.transaction.id, {
			category: "Updated Category",
		});
	}

	async function handleDelete() {
		await deleteTransaction(props.transaction.id);
	}
</script>

<template>
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
			<DropdownMenuItem @click="handleEdit">Edit Transaction</DropdownMenuItem>
			<DropdownMenuItem @click="handleDelete"
				>Delete Transaction</DropdownMenuItem
			>
		</DropdownMenuContent>
	</DropdownMenu>
</template>
