<script setup lang="ts">
	import { useForm, Form } from "vee-validate";
	import { toTypedSchema } from "@vee-validate/zod";
	import * as z from "zod";
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
	import {
		FormControl,
		FormDescription,
		FormItem,
		FormLabel,
		FormMessage,
		FormField,
	} from "@/components/ui/form";

	const supabase = useSupabaseClient();

	const formSchema = toTypedSchema(
		z.object({
			email: z.string().email({ message: "Invalid email address" }),
			password: z
				.string()
				.min(6, { message: "Password must be at least 6 characters" }),
		})
	);

	const form = useForm({
		validationSchema: formSchema,
	});

	const onSubmit = form.handleSubmit(async (values) => {
		const { data, error } = await supabase.auth.signInWithPassword({
			email: values.email,
			password: values.password,
		});
		if (error) {
			console.log(error);
		} else {
			console.log("Sign in successful");
			navigateTo("/dashboard");
		}
	});
</script>

<template>
	<div class="w-full min-h-screen flex items-center justify-center">
		<Card class="w-[350px]">
			<CardHeader>
				<CardTitle>Login</CardTitle>
				<CardDescription>Sign in to your account</CardDescription>
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
						<Button type="submit">Sign In</Button>
					</CardFooter>
				</form>
			</CardContent>
		</Card>
	</div>
</template>
