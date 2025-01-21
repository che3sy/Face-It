<script setup lang="ts">
	import { onMounted, ref } from "vue";
	import { columns } from "./columns";
	import DataTable from "./DataTable.vue";
	import { useFinancialData } from "@/composables/useFinancialData";
	interface Transaction {
		id: number;
		type: "income" | "expense";
		category: string;
		amount: number;
		date_transaction: string;
		date_created: string;
	}
	const { getRecentTransactions } = useFinancialData();
	const data = ref<Transaction[]>([]);

	onMounted(async () => {
		const recentTransactions = await getRecentTransactions();
		data.value = recentTransactions as Transaction[];
		if (data.value.length === 0) {
			console.log("Data is empty");
		}
	});
</script>

<template>
	<div class="container py-10 mx-auto">
		<DataTable
			:columns="columns"
			:data="data" />
	</div>
</template>
