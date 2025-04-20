<template>
	<div
		class="min-h-screen flex flex-col items-center justify-center bg-background text-foreground">
		<h1 class="text-4xl font-bold mb-4">404 - Page Not Found</h1>
		<p class="mb-8">Sorry, the page you are looking for does not exist.</p>
		<Button @click="goHome">Go to Home</Button>
	</div>
</template>

<script setup lang="ts">
	import { useRouter } from "vue-router";

	const router = useRouter();
	function goHome() {
		router.push("/");
	}
</script>
