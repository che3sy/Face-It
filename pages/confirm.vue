<script setup lang="ts">
	const user = useSupabaseUser();

	watch(
		user,
		() => {
			if (user.value) {
				// Redirect to protected page
				return navigateTo("/dashboard");
			}
		},
		{ immediate: true }
	);
</script>

<template>
	<div class="text-white">Waiting for login...</div>
</template>
