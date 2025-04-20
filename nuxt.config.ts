// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	runtimeConfig: {
		geminiApiKey: process.env.GEMINI_API_KEY,
		public: {
			geminiApiKey: process.env.GEMINI_API_KEY,
		},
	},
	compatibilityDate: "2024-11-01",
	devtools: { enabled: true },
	css: ["~/assets/css/main.css"],
	modules: [
		"shadcn-nuxt",
		"@nuxtjs/tailwindcss",
		"@nuxtjs/color-mode",
		"nuxt-lucide-icons",
		"@nuxtjs/supabase",
		"@pinia/nuxt",
	],

	shadcn: {
		prefix: "",
		componentDir: "./components/ui",
	},
	colorMode: {
		classSuffix: "",
	},
	postcss: {
		plugins: {
			tailwindcss: {},
			autoprefixer: {},
		},
	},
	supabase: {
		redirectOptions: {
			login: "/login",
			callback: "/confirm",
			include: ["/dashboard"],
			exclude: ["/", "/signUp", "/error"],
			cookieRedirect: true,
		},
		redirect: true,
		useSsrCookies: true,
	},
});
