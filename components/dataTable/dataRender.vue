<script setup lang="ts">
	import { onMounted, ref } from "vue";
	import { columns } from "./columns";
	import DataTable from "./DataTable.vue";

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
	const dateRangeStore = useDateRangeStore();
	const triggerStore = useTriggerStore();

	const fetchData = async () => {
		const recentTransactions = await getRecentTransactions();
		data.value = recentTransactions as Transaction[];
		if (data.value.length === 0) {
			console.log("Data is empty");
		}
	};

	onMounted(fetchData);

	watch(() => [dateRangeStore.start, dateRangeStore.end], fetchData);
	watch(() => triggerStore.trigger, fetchData);
</script>

<template>
	<div class="container py-10 mx-auto">
		<DataTable
			:columns="columns"
			:data="data" />
	</div>
</template>
