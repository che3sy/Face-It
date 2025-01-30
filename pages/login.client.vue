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

	const loginError = ref<string>("");
	const isLoading = ref<boolean>(false);

	const onSubmit = form.handleSubmit(async (values) => {
		loginError.value = "";
		isLoading.value = true;
		const { data, error } = await supabase.auth.signInWithPassword({
			email: values.email,
			password: values.password,
		});
		isLoading.value = false;
		if (error) {
			loginError.value = "Incorrect email or password";
			console.log(error);
		} else {
			console.log("Sign in successful");
			navigateTo("/dashboard");
		}
	});
</script>

<template>
	<div class="w-full min-h-screen flex items-center justify-center">
		<div
			class="absolute inset-0 h-full w-full bg-background bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_60%,transparent_100%)] z-0"></div>

		<Card class="w-[350px] z-10">
			<CardHeader>
				<div class="flex flex-row">
					<img
						src="public\favicon.ico"
						alt="Logo"
						class="w-12 h-12" />
					<div class="ml-4 mt-2">
						<CardTitle>Login</CardTitle>
						<CardDescription>Sign in to your account</CardDescription>
					</div>
				</div>
			</CardHeader>
			<CardContent>
				<form @submit="onSubmit">
					<div
						v-if="loginError"
						class="text-red-500 text-sm mb-4">
						{{ loginError }}
					</div>
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
					<CardFooter class="flex justify-between pr-4 pt-6 pb-4">
						<Button
							type="button"
							variant="outline"
							class="-ml-6"
							@click="navigateTo('/signUp')"
							>Sign Up</Button
						>
						<Button
							type="submit"
							:disabled="isLoading">
							<span
								v-if="isLoading"
								class="flex items-center">
								<LucideLoader class="animate-spin mr-2" />
								Loading...
							</span>
							<span v-else>Log In</span>
						</Button>
					</CardFooter>
				</form>
			</CardContent>
		</Card>
	</div>
</template>
