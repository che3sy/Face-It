<script lang="ts" setup>
	import { Button } from "@/components/ui/button";
	import { useColorMode } from "@vueuse/core";
	import { onMounted, ref } from "vue";
	import { LucideSun, LucideMoon } from "lucide-vue-next";
	const colorMode = useColorMode();
	const load = ref(false);
	const toggleDarkMode = () => {
		colorMode.value = colorMode.value === "dark" ? "light" : "dark";
		localStorage.setItem("colorMode", colorMode.value);
	};
	onMounted(() => {
		const savedColorMode = localStorage.getItem("colorMode");
		if (savedColorMode) {
			colorMode.value = savedColorMode as "light" | "dark" | "auto";
			load.value = true;
		}
	});
</script>
<template
	><div :v-if="load">
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
