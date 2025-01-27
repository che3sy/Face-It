<script lang="ts" setup>
	import {
		Select,
		SelectContent,
		SelectGroup,
		SelectItem,
		SelectLabel,
		SelectTrigger,
		SelectValue,
	} from "@/components/ui/select";

	import DateRangePicker from "@/components/DateRangePicker.vue";
	import { Button } from "@/components/ui/button";
	import { useDateRangeStore } from "@/stores/dateRange";

	import { LucideMousePointer2, LucideRotateCcw } from "lucide-vue-next";

	const dateRangeStore = useDateRangeStore();

	const resetDates = () => {
		dateRangeStore.resetDateRange();
	};
</script>

<template>
	<div class="px-4 pt-2 flex flex-row justify-between items-center mr-28">
		<h2 class="text-3xl font-bold tracking-tight flex flex-row items-center">
			<LucideMousePointer2
				color="#22C55E"
				:size="30"
				class="rotate-custom mr-2" />
			Dashboard
		</h2>
		<div class="flex flex-row items-center">
			<DateRangePicker />
			<Button
				variant="outline"
				@click="resetDates"
				class="ml-2 flex flex-row hover:rotate-icon">
				<LucideRotateCcw class="mr-1" />
				Reset Dates
			</Button>
		</div>
		<div
			class="flex flex-row items-center rounded-lg border text-card-foreground shadow-sm p-1">
			<LucideCalendarRange :size="16"></LucideCalendarRange>
			<h2 class="mx-2 text-sm font-semibold"> Current period split: </h2>
			<Select v-model="dateRangeStore.period">
				<SelectTrigger class="w-[180px]">
					<SelectValue placeholder="'dateRangeStore.period'" />
				</SelectTrigger>
				<SelectContent>
					<SelectGroup>
						<SelectLabel>Periods</SelectLabel>
						<SelectItem value="daily"> daily </SelectItem>
						<SelectItem value="weekly"> weekly </SelectItem>
						<SelectItem value="monthly"> monthly </SelectItem>
						<SelectItem value="yearly"> yearly </SelectItem>
					</SelectGroup>
				</SelectContent>
			</Select>
		</div>
	</div>
</template>

<style scoped>
	.rotate-custom {
		transform: rotate(130deg);
	}
	button {
		transition: transform 0.3s ease;
	}
	button:hover {
		transform: scale(1.1);
	}
	.hover\:rotate-icon:hover .mr-1 {
		animation: rotate 0.5s linear;
	}
	@keyframes rotate {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}
</style>
