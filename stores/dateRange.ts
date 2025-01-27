import { defineStore } from "pinia";

export const useDateRangeStore = defineStore("dateRange", {
	state: () => ({
		start: 0,
		end: 0,
		period: "weekly",
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
		setPeriod(period: string) {
			this.period = period;
		},
	},
	getters: {
		periodName: (state) => {
			switch (state.period) {
				case "daily":
					return "day";
				case "weekly":
					return "week";
				case "monthly":
					return "month";
				case "yearly":
					return "year";
				default:
					return "period";
			}
		},
	},
});
