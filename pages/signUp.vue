<script setup lang="ts">
	import { Button } from "@/components/ui/button";
	import {
		Card,
		CardContent,
		CardDescription,
		CardFooter,
		CardHeader,
		CardTitle,
	} from "@/components/ui/card";
	import { Input } from "@/components/ui/input";

	// VeeValidate and Zod imports
	import { useForm, Form } from "vee-validate";
	import { toTypedSchema } from "@vee-validate/zod";
	import * as z from "zod";
	import {
		FormControl,
		FormDescription,
		FormItem,
		FormLabel,
		FormMessage,
		FormField,
	} from "@/components/ui/form";

	const supabase = useSupabaseClient();

	// Define the form schema using Zod
	const formSchema = toTypedSchema(
		z.object({
			email: z.string().email({ message: "Invalid email address" }),
			password: z
				.string()
				.min(6, { message: "Password must be at least 6 characters" }),
		})
	);

	// Setup VeeValidate form
	const form = useForm({
		validationSchema: formSchema,
	});

	const onSubmit = form.handleSubmit(async (values) => {
		const { error } = await supabase.auth.signUp({
			email: values.email,
			password: values.password,
			options: {
				emailRedirectTo: "http://localhost:3000/confirm",
			},
		});
		if (error) {
			console.log(error);
		} else {
			console.log("Sign up successful");
			navigateTo("/confirm");
		}
	});
	supabase.auth.onAuthStateChange((event, session) => {
		if (event === "SIGNED_IN") {
			console.log("Signed in");
			navigateTo("/confirm");
		}
	});
</script>

<template>
	<div class="w-full min-h-screen flex items-center justify-center">
		<Card class="w-[350px]">
			<CardHeader>
				<CardTitle>Sign Up</CardTitle>
				<CardDescription
					>Sign up for Face-It to mange transactions</CardDescription
				>
			</CardHeader>
			<CardContent>
				<form @submit="onSubmit">
					<FormField
						name="email"
						v-slot="{ field }">
						<FormItem>
							<FormLabel>Email</FormLabel>
							<FormControl>
								<Input
									type="email"
									placeholder="Email"
									v-bind="field" />
							</FormControl>
							<FormDescription>Enter your email address.</FormDescription>
							<FormMessage />
						</FormItem>
					</FormField>
					<FormField
						name="password"
						v-slot="{ field }">
						<FormItem>
							<FormLabel>Password</FormLabel>
							<FormControl>
								<Input
									type="password"
									placeholder="Password"
									v-bind="field" />
							</FormControl>
							<FormDescription>Create a strong password.</FormDescription>
							<FormMessage />
						</FormItem>
					</FormField>
					<CardFooter class="flex justify-end pr-4 pt-4 pb-4">
						<Button type="submit">Sign Up</Button>
					</CardFooter>
				</form>
			</CardContent>
		</Card>
	</div>
</template>
