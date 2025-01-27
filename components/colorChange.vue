<script lang="ts" setup>
	import { Button } from "@/components/ui/button";
	import { useColorMode } from "@vueuse/core";
	import { onMounted, ref } from "vue";
	import { LucideSun, LucideMoon } from "lucide-vue-next";
	const colorMode = useColorMode();
	const refreshKey = ref(0);
	const toggleDarkMode = () => {
		colorMode.value = colorMode.value === "dark" ? "light" : "dark";
		localStorage.setItem("colorMode", colorMode.value);
		refreshKey.value++;
	};
	onMounted(() => {
		const savedColorMode = localStorage.getItem("colorMode");
		if (savedColorMode) {
			colorMode.value = savedColorMode as "light" | "dark" | "auto";
			refreshKey.value++;
		}
	});
</script>
<template
	><div :key="refreshKey">
		<button
			@click="toggleDarkMode"
			v-if="colorMode === 'dark'">
			<LucideSun />
		</button>
		<button
			@click="toggleDarkMode"
			v-else>
			<LucideMoon /> </button
	></div>
</template>
