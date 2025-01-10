import { defineStore } from "pinia";

export const useDateRangeStore = defineStore("dateRange", {
	state: () => ({
		start: 0,
		end: 0,
	}),
	actions: {
		setDateRange(startValue: number, endValue: number) {
			this.start = startValue;
			this.end = endValue;
		},
		resetDateRange() {
			this.start = 0;
			this.end = 0;
		},
	},
});
