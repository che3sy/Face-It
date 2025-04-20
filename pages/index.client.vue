<script lang="ts" setup>
	import { Button } from "@/components/ui/button";
	import {
		Card,
		CardContent,
		CardDescription,
		CardTitle,
	} from "@/components/ui/card";
	import {
		Carousel,
		type CarouselApi,
		CarouselContent,
		CarouselItem,
		CarouselNext,
		CarouselPrevious,
	} from "@/components/ui/carousel";
	import { watchOnce } from "@vueuse/core";

	import { LineChart } from "@/components/ui/chart-line";
	const data = [
		{
			year: 1970,
			"Export Growth Rate": 2.04,
			"Import Growth Rate": 1.53,
		},
		{
			year: 1971,
			"Export Growth Rate": 1.96,
			"Import Growth Rate": 1.58,
		},
		{
			year: 1972,
			"Export Growth Rate": 1.96,
			"Import Growth Rate": 1.61,
		},
		{
			year: 1973,
			"Export Growth Rate": 1.93,
			"Import Growth Rate": 1.61,
		},
		{
			year: 1974,
			"Export Growth Rate": 1.88,
			"Import Growth Rate": 1.67,
		},
		{
			year: 1975,
			"Export Growth Rate": 1.79,
			"Import Growth Rate": 1.64,
		},
		{
			year: 1976,
			"Export Growth Rate": 1.77,
			"Import Growth Rate": 1.62,
		},
		{
			year: 1977,
			"Export Growth Rate": 1.74,
			"Import Growth Rate": 1.69,
		},
		{
			year: 1978,
			"Export Growth Rate": 1.74,
			"Import Growth Rate": 1.7,
		},
		{
			year: 1979,
			"Export Growth Rate": 1.77,
			"Import Growth Rate": 1.67,
		},
		{
			year: 1980,
			"Export Growth Rate": 1.79,
			"Import Growth Rate": 1.7,
		},
		{
			year: 1981,
			"Export Growth Rate": 1.81,
			"Import Growth Rate": 1.72,
		},
		{
			year: 1982,
			"Export Growth Rate": 1.84,
			"Import Growth Rate": 1.73,
		},
		{
			year: 1983,
			"Export Growth Rate": 1.77,
			"Import Growth Rate": 1.73,
		},
		{
			year: 1984,
			"Export Growth Rate": 1.78,
			"Import Growth Rate": 1.78,
		},
		{
			year: 1985,
			"Export Growth Rate": 1.78,
			"Import Growth Rate": 1.81,
		},
		{
			year: 1986,
			"Export Growth Rate": 1.82,
			"Import Growth Rate": 1.89,
		},
		{
			year: 1987,
			"Export Growth Rate": 1.82,
			"Import Growth Rate": 1.91,
		},
		{
			year: 1988,
			"Export Growth Rate": 1.77,
			"Import Growth Rate": 1.94,
		},
		{
			year: 1989,
			"Export Growth Rate": 1.76,
			"Import Growth Rate": 1.94,
		},
		{
			year: 1990,
			"Export Growth Rate": 1.75,
			"Import Growth Rate": 1.97,
		},
		{
			year: 1991,
			"Export Growth Rate": 1.62,
			"Import Growth Rate": 1.99,
		},
		{
			year: 1992,
			"Export Growth Rate": 1.56,
			"Import Growth Rate": 2.12,
		},
		{
			year: 1993,
			"Export Growth Rate": 1.5,
			"Import Growth Rate": 2.13,
		},
		{
			year: 1994,
			"Export Growth Rate": 1.46,
			"Import Growth Rate": 2.15,
		},
		{
			year: 1995,
			"Export Growth Rate": 1.43,
			"Import Growth Rate": 2.17,
		},
		{
			year: 1996,
			"Export Growth Rate": 1.4,
			"Import Growth Rate": 2.2,
		},
		{
			year: 1997,
			"Export Growth Rate": 1.37,
			"Import Growth Rate": 2.15,
		},
		{
			year: 1998,
			"Export Growth Rate": 1.34,
			"Import Growth Rate": 2.07,
		},
		{
			year: 1999,
			"Export Growth Rate": 1.32,
			"Import Growth Rate": 2.05,
		},
		{
			year: 2000,
			"Export Growth Rate": 1.33,
			"Import Growth Rate": 2.07,
		},
		{
			year: 2001,
			"Export Growth Rate": 1.31,
			"Import Growth Rate": 2.08,
		},
		{
			year: 2002,
			"Export Growth Rate": 1.29,
			"Import Growth Rate": 2.1,
		},
		{
			year: 2003,
			"Export Growth Rate": 1.27,
			"Import Growth Rate": 2.15,
		},
		{
			year: 2004,
			"Export Growth Rate": 1.27,
			"Import Growth Rate": 2.21,
		},
		{
			year: 2005,
			"Export Growth Rate": 1.26,
			"Import Growth Rate": 2.23,
		},
		{
			year: 2006,
			"Export Growth Rate": 1.26,
			"Import Growth Rate": 2.29,
		},
		{
			year: 2007,
			"Export Growth Rate": 1.27,
			"Import Growth Rate": 2.34,
		},
		{
			year: 2008,
			"Export Growth Rate": 1.26,
			"Import Growth Rate": 2.36,
		},
		{
			year: 2009,
			"Export Growth Rate": 1.26,
			"Import Growth Rate": 2.36,
		},
		{
			year: 2010,
			"Export Growth Rate": 1.25,
			"Import Growth Rate": 2.35,
		},
		{
			year: 2011,
			"Export Growth Rate": 1.24,
			"Import Growth Rate": 2.34,
		},
		{
			year: 2012,
			"Export Growth Rate": 1.25,
			"Import Growth Rate": 2.39,
		},
		{
			year: 2013,
			"Export Growth Rate": 1.22,
			"Import Growth Rate": 2.3,
		},
		{
			year: 2014,
			"Export Growth Rate": 1.2,
			"Import Growth Rate": 2.35,
		},
		{
			year: 2015,
			"Export Growth Rate": 1.17,
			"Import Growth Rate": 2.39,
		},
		{
			year: 2016,
			"Export Growth Rate": 1.16,
			"Import Growth Rate": 2.41,
		},
		{
			year: 2017,
			"Export Growth Rate": 1.13,
			"Import Growth Rate": 2.44,
		},
		{
			year: 2018,
			"Export Growth Rate": 1.07,
			"Import Growth Rate": 2.45,
		},
		{
			year: 2019,
			"Export Growth Rate": 1.03,
			"Import Growth Rate": 2.47,
		},
		{
			year: 2020,
			"Export Growth Rate": 0.92,
			"Import Growth Rate": 2.48,
		},
		{
			year: 2021,
			"Export Growth Rate": 0.82,
			"Import Growth Rate": 2.51,
		},
	].reverse();

	const emblaMainApi = ref<CarouselApi>();
	const emblaThumbnailApi = ref<CarouselApi>();
	const selectedIndex = ref(0);

	function onSelect() {
		if (!emblaMainApi.value || !emblaThumbnailApi.value) return;
		selectedIndex.value = emblaMainApi.value.selectedScrollSnap();
		emblaThumbnailApi.value.scrollTo(emblaMainApi.value.selectedScrollSnap());
	}

	function onThumbClick(index: number) {
		if (!emblaMainApi.value || !emblaThumbnailApi.value) return;
		emblaMainApi.value.scrollTo(index);
	}

	watchOnce(emblaMainApi, (emblaMainApi) => {
		if (!emblaMainApi) return;

		onSelect();
		emblaMainApi.on("select", onSelect);
		emblaMainApi.on("reInit", onSelect);
	});
</script>
<template>
	<div class="bg-accent2 py-4 rounded-lg">
		<ClientOnly>
			<LineChart
				class="relative mt-12"
				index="year"
				:data="data"
				:categories="['Export Growth Rate']"
				:y-formatter="
					(tick, i) => {
						return typeof tick === 'number'
							? `$ ${new Intl.NumberFormat('us').format(tick).toString()}`
							: '';
						``;
					}
				"
				:show-tooltip="false"
				:show-grid-line="false"
				:show-legend="false"
				:show-x-axis="false"
				:show-y-axis="false" />
		</ClientOnly>

		<div
			class="text-9xl text-primary font-black absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
			<div
				class="backdrop-blur-[4.50px] p-8 rounded-3xl border border-primary/20 bg-primary/10">
				<h1 class="z-10 animate-fontCycle">Face-It</h1>
			</div>
		</div>
		<div class="text-center mt-4">
			<h1 class="text-2xl font-bold"
				>Let's Face-It, it's Time to Master Your Money</h1
			>
			<p class="text-muted-foreground">Mangage and track your finances</p>
		</div>
	</div>
	<svg
		class="w-full"
		width="100%"
		height="100%"
		viewBox="0 0 900 138"
		fill="none"
		xmlns="http://www.w3.org/2000/svg">
		<path
			d="M0 138L9.3 124.7C18.7 111.3 37.3 84.7 56.2 70.5C75 56.3 94 54.7 112.8 54.3C131.7 54 150.3 55 169 62.2C187.7 69.3 206.3 82.7 225 95C243.7 107.3 262.3 118.7 281.2 108.7C300 98.7 319 67.3 337.8 69.7C356.7 72 375.3 108 394 110.5C412.7 113 431.3 82 450 73.5C468.7 65 487.3 79 506.2 85.7C525 92.3 544 91.7 562.8 88.2C581.7 84.7 600.3 78.3 619 67.7C637.7 57 656.3 42 675 45C693.7 48 712.3 69 731.2 84.5C750 100 769 110 787.8 115.7C806.7 121.3 825.3 122.7 844 107.2C862.7 91.7 881.3 59.3 890.7 43.2L900 27V0H890.7C881.3 0 862.7 0 844 0C825.3 0 806.7 0 787.8 0C769 0 750 0 731.2 0C712.3 0 693.7 0 675 0C656.3 0 637.7 0 619 0C600.3 0 581.7 0 562.8 0C544 0 525 0 506.2 0C487.3 0 468.7 0 450 0C431.3 0 412.7 0 394 0C375.3 0 356.7 0 337.8 0C319 0 300 0 281.2 0C262.3 0 243.7 0 225 0C206.3 0 187.7 0 169 0C150.3 0 131.7 0 112.8 0C94 0 75 0 56.2 0C37.3 0 18.7 0 9.3 0H0V138Z"
			:fill="`hsl(var(--accent2))`" />
	</svg>
	<div class="flex items-center justify-center">
		<div
			class="text-left border-l-2 w-full max-w-[500px] pl-4 border-primary/50">
			<h1 class="text-xl font-semibold"
				>Start Saving <span class="text-green-500 font-bold">Money</span> In 5
				Easy Steps</h1
			>
		</div>
	</div>

	<div class="w-full sm:w-auto flex flex-col justify-center items-center mt-12">
		<Carousel
			class="relative w-full max-w-[500px]"
			@init-api="(val) => (emblaMainApi = val)">
			<CarouselContent>
				<CarouselItem>
					<div class="p-1">
						<Card>
							<CardTitle class="mt-4 ml-4">Step 1: Sign Up</CardTitle>
							<CardDescription class="ml-4 mt-2"
								>Sign up to use Face-It</CardDescription
							>
							<CardContent
								class="flex aspect-square items-center justify-center p-6">
								<img
									src="../assets/images/sign.png"
									class="border-2 border-primary/50 rounded" />
							</CardContent>
						</Card>
					</div>
				</CarouselItem>
				<CarouselItem>
					<div class="p-1">
						<Card>
							<CardTitle class="mt-4 ml-4">Step 2: Add Transactions</CardTitle>
							<CardDescription class="ml-4 mt-2"
								>Add incomes or expenses</CardDescription
							>
							<CardContent
								class="flex aspect-square items-center justify-center p-6">
								<img
									src="../assets/images/add.png"
									class="border-2 border-primary/50 rounded" />
							</CardContent>
						</Card>
					</div>
				</CarouselItem>
				<CarouselItem>
					<div class="p-1">
						<Card>
							<CardTitle class="mt-4 ml-4"
								>Step 3: View and Mange Transactions</CardTitle
							>
							<CardDescription class="ml-4 mt-2"
								>View and mange your financial data worry free</CardDescription
							>
							<CardContent
								class="flex aspect-square items-center justify-center p-6">
								<img
									src="../assets/images/balance.png"
									class="border-2 border-primary/50 rounded" />
							</CardContent>
						</Card>
					</div>
				</CarouselItem>
				<CarouselItem>
					<div class="p-1">
						<Card>
							<CardTitle class="mt-4 ml-4">Step 4: Analyze</CardTitle>
							<CardDescription class="ml-4 mt-2"
								>Analyze your financial data to better understand your patterns
							</CardDescription>
							<CardContent
								class="flex aspect-square items-center justify-center p-6">
								<img
									src="../assets/images/bar.png"
									class="border-2 border-primary/50 rounded" />
							</CardContent>
						</Card>
					</div>
				</CarouselItem>
				<CarouselItem>
					<div class="p-1">
						<Card>
							<CardTitle class="mt-4 ml-4">Step 5: AI</CardTitle>
							<CardDescription class="ml-4 mt-2"
								>Use AI to predict future trends and steps to save
								more</CardDescription
							>
							<CardContent
								class="flex aspect-square items-center justify-center p-6">
								<img
									src="../assets/images/ai.png"
									class="border-2 border-primary/50 rounded" />
							</CardContent>
						</Card>
					</div>
				</CarouselItem>
			</CarouselContent>
			<CarouselPrevious />
			<CarouselNext />
		</Carousel>

		<Carousel
			class="relative w-full max-w-[400px]"
			@init-api="(val) => (emblaThumbnailApi = val)">
			<CarouselContent class="flex gap-1 ml-0">
				<CarouselItem
					class="pl-0 basis-1/4 cursor-pointer"
					@click="onThumbClick(0)">
					<div
						class="p-1"
						:class="selectedIndex === 0 ? '' : 'opacity-50'">
						<Card>
							<CardContent
								class="flex aspect-square items-center justify-center p-6">
								<LucideLogIn class="w-8 h-8" />
							</CardContent>
						</Card>
					</div>
				</CarouselItem>
				<CarouselItem
					class="pl-0 basis-1/4 cursor-pointer"
					@click="onThumbClick(1)">
					<div
						class="p-1"
						:class="selectedIndex === 1 ? '' : 'opacity-50'">
						<Card>
							<CardContent
								class="flex aspect-square items-center justify-center p-6">
								<LucideSquarePlus class="w-8 h-8" />
							</CardContent>
						</Card>
					</div>
				</CarouselItem>
				<CarouselItem
					class="pl-0 basis-1/4 cursor-pointer"
					@click="onThumbClick(2)">
					<div
						class="p-1"
						:class="selectedIndex === 2 ? '' : 'opacity-50'">
						<Card>
							<CardContent
								class="flex aspect-square items-center justify-center p-6">
								<LucideCircleDollarSign class="w-8 h-8" />
							</CardContent>
						</Card>
					</div>
				</CarouselItem>
				<CarouselItem
					class="pl-0 basis-1/4 cursor-pointer"
					@click="onThumbClick(3)">
					<div
						class="p-1"
						:class="selectedIndex === 3 ? '' : 'opacity-50'">
						<Card>
							<CardContent
								class="flex aspect-square items-center justify-center p-6">
								<LucideChartNoAxesCombined class="w-8 h-8" />
							</CardContent>
						</Card>
					</div>
				</CarouselItem>
				<CarouselItem
					class="pl-0 basis-1/4 cursor-pointer"
					@click="onThumbClick(4)">
					<div
						class="p-1"
						:class="selectedIndex === 4 ? '' : 'opacity-50'">
						<Card>
							<CardContent
								class="flex aspect-square items-center justify-center p-6">
								<LucideSparkles class="w-8 h-8" />
							</CardContent>
						</Card>
					</div>
				</CarouselItem>
			</CarouselContent>
		</Carousel>
	</div>
	<div class="mt-16 pb-24 flex flex-col items-center justify-center">
		<Card class="text-left w-full max-w-80 py-4">
			<CardTitle
				><h1 class="ml-4 text-xl font-bold">
					What are you waiting for?</h1
				></CardTitle
			>
			<CardDescription
				><h2 class="ml-4">Sign Up or Log In Now!</h2></CardDescription
			>
			<CardContent class="pt-4 -ml-2">
				<img
					src="../public/favicon.ico"
					class="w-full rotate-on-hover" />
				<h4 class="text-sm text-muted-foreground mt-1"
					>Face It, Time to Master Your Money</h4
				>
			</CardContent>
			<CardFooter>
				<div class="flex w-full justify-between">
					<Button
						class="-ml-2"
						variant="secondary"
						@click="navigateTo('/login')"
						>Log In</Button
					>
					<Button
						varient="primary"
						@click="navigateTo('/signUp')"
						>Sign Up
					</Button>
				</div>
			</CardFooter>
		</Card>
	</div>
</template>
<style scoped>
	@keyframes fontCycle {
		0% {
			font-family: "monospace";
			font-style: normal;
			font-weight: normal;
		}
		10% {
			font-family: "Comic Sans MS";
			font-style: italic;
			font-weight: bold;
		}
		20% {
			font-family: "Times New Roman";
			font-style: normal;
			font-weight: bold;
		}
		30% {
			font-family: "Courier New";
			font-style: italic;
			font-weight: normal;
		}
		40% {
			font-family: "Impact";
			font-style: normal;
			font-weight: bold;
		}
		50% {
			font-family: "Arial";
			font-style: italic;
			font-weight: normal;
		}
		60% {
			font-family: "Georgia";
			font-style: normal;
			font-weight: bold;
		}
		70% {
			font-family: "Verdana";
			font-style: italic;
			font-weight: normal;
		}
		80% {
			font-family: "Lucida Console";
			font-style: normal;
			font-weight: bold;
		}
		90% {
			font-family: "Tahoma";
			font-style: italic;
			font-weight: normal;
		}
		95% {
			font-family: "Palatino";
			font-style: normal;
			font-weight: bold;
		}
		100% {
			font-family: "inherit";
			font-style: normal;
			font-weight: inherit;
		}
	}

	.animate-fontCycle {
		animation: fontCycle 1.5s cubic-bezier(0.68, -0.55, 0.27, 1.55);
	}

	.rotate-on-hover {
		transition: transform 1s;
	}

	.rotate-on-hover:hover {
		transform: rotate(360deg);
		transition-timing-function: cubic-bezier(0.25, 0.1, 0.25, 1);
	}
</style>
