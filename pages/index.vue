<script type="ts" setup>
	import {Button} from "@/components/ui/button";
</script>
<template>
	<div>
		<h1>Home</h1>
		<Button
			varient="primary"
			@click="navigateTo('/login')"
			>Log In</Button
		>
	</div>
</template>
