<script setup lang="ts">
	import type { HTMLAttributes } from "vue";
	import { cn } from "@/lib/utils";
	import { useVModel } from "@vueuse/core";

	const props = defineProps<{
		defaultValue?: string | number;
		modelValue?: string | number;
		class?: HTMLAttributes["class"];
	}>();

	const emits = defineEmits<{
		(e: "update:modelValue", payload: string | number): void;
	}>();

	const modelValue = useVModel(props, "modelValue", emits, {
		passive: true,
		defaultValue: props.defaultValue,
	});
</script>

<template>
	<input
		v-model="modelValue"
		:class="
			cn(
				'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
				props.class
			)
		" />
</template>
<style scoped>
	::-webkit-calendar-picker-indicator {
		background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="15" viewBox="0 0 24 24"><path fill="%23bbbbbb" d="M20 3h-1V1h-2v2H7V1H5v2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 18H4V8h16v13z"/></svg>');
	}
</style>
