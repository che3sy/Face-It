<script type="ts" setup>
	import DateRangePicker from './components/DateRangePicker.vue'
	import { Button } from '@/components/ui/button'
	const dateRangeStore = useDateRangeStore();


		const colorMode = useColorMode()


		const toggleDarkMode = () => {
		  colorMode.value = colorMode.value === 'dark' ? 'light' : 'dark'
		}
		const resetDates = () => {
			dateRangeStore.resetDateRange()
	   }
</script>
<template>
	<div class="px-4 pt-2 flex flex-row justify-between items-center">
		<h2 class="text-3xl font-bold tracking-tight flex flex-row items-center"
			><LucideMousePointer2
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

		<button
			@click="toggleDarkMode"
			v-if="colorMode.value === 'dark'">
			<LucideSun></LucideSun>
		</button>
		<button
			@click="toggleDarkMode"
			v-else>
			<LucideMoon></LucideMoon>
		</button>
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
