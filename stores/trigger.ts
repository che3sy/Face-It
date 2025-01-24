import { defineStore } from "pinia";

export const useTriggerStore = defineStore("trigger", {
	state: () => ({
		trigger: false,
	}),
	actions: {
		toggelTrigger() {
			this.trigger = !this.trigger;
		},
	},
});
