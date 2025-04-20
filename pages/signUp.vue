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
	// This schema specifies the validation rules for the sign-up form fields.
	const formSchema = toTypedSchema(
		z
			.object({
				// Email field validation: must be a string and a valid email format.
				email: z.string().email({ message: "Invalid email address" }),
				// Password field validation: must be a string and at least 6 characters long.
				password: z
					.string()
					.min(6, { message: "Password must be at least 6 characters" }),
				// Confirm password field validation: must be a string and at least 6 characters long.
				confirmPassword: z.string().min(6, {
					message: "Confirm password must be at least 6 characters",
				}),
			})
			// Add a custom validation rule (refinement) to ensure passwords match.
			.refine((data) => data.password === data.confirmPassword, {
				// Specify that the error message should be associated with the 'confirmPassword' field.
				path: ["confirmPassword"],
				message: "Passwords must match",
			})
	);

	// Setup VeeValidate form instance using the defined Zod schema.
	// `useForm` initializes VeeValidate and connects it to our validation rules.
	const form = useForm({
		validationSchema: formSchema,
	});

	// Define the function to be executed when the form is submitted.
	// `form.handleSubmit` wraps our function and ensures it only runs if validation passes.
	const onSubmit = form.handleSubmit(async (values) => {
		// Attempt to sign up the user using Supabase authentication.
		// Pass the validated email and password from the form values.
		const { error } = await supabase.auth.signUp({
			email: values.email, // User's email from the form.
			password: values.password, // User's password from the form.
			options: {
				// Specify the URL the user should be redirected to after confirming their email.
				emailRedirectTo: "https://face-it.pages.dev/confirm",
			},
		});
		// Check if an error occurred during the sign-up process.
		if (error) {
			// Log the error to the console for debugging purposes.
			console.log(error);
		} else {
			// Log a success message if sign-up was initiated successfully.
			console.log("Sign up successful");
			// Redirect the user to the confirmation page.
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
					<FormField
						name="confirmPassword"
						v-slot="{ field }">
						<FormItem>
							<FormLabel>Confirm Password</FormLabel>
							<FormControl>
								<Input
									type="password"
									placeholder="Confirm Password"
									v-bind="field" />
							</FormControl>
							<FormDescription>Please retype your password.</FormDescription>
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
