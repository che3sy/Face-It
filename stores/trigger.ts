import { defineStore } from "pinia";

export const useTriggerStore = defineStore("trigger", {
	state: () => ({
		trigger: false,
	}),
	actions: {
		toggleTrigger() {
			this.trigger = !this.trigger;
		},
	},
});
