<script setup lang="ts">
	import type { DateRange } from "radix-vue";
	import { Button } from "@/components/ui/button";
	import {
		Popover,
		PopoverContent,
		PopoverTrigger,
	} from "@/components/ui/popover";

	import { RangeCalendar } from "@/components/ui/range-calendar";
	import { cn } from "@/lib/utils";
	import {
		CalendarDate,
		DateFormatter,
		getLocalTimeZone,
	} from "@internationalized/date";

	const df = new DateFormatter("en-US", {
		dateStyle: "medium",
	});

	const popoverOpen = ref(false);

	const value = ref<DateRange>({
		start: undefined,
		end: undefined,
	}) as Ref<DateRange>;
	const dateRangeStore = useDateRangeStore();

	const submitDateRange = () => {
		const newVal = value.value;
		const startEpoch = newVal.start
			? newVal.start.toDate(getLocalTimeZone()).getTime()
			: 0;
		const endEpoch = newVal.end
			? newVal.end.toDate(getLocalTimeZone()).getTime()
			: 0;
		dateRangeStore.setDateRange(
			Math.floor(startEpoch / 1000),
			Math.floor(endEpoch / 1000)
		);
		popoverOpen.value = false;
	};
</script>

<template>
	<div :class="cn('grid gap-2', $attrs.class ?? '')">
		<Popover v-model:open="popoverOpen">
			<PopoverTrigger as-child>
				<Button
					id="date"
					:variant="'outline'"
					:class="
						cn(
							'w-[300px] justify-start text-left font-normal',
							!value && 'text-muted-foreground'
						)
					">
					<LucideCalendar class="mr-2 h-4 w-4" />

					<template v-if="value.start">
						<template v-if="value.end">
							{{ df.format(value.start.toDate(getLocalTimeZone())) }} -
							{{ df.format(value.end.toDate(getLocalTimeZone())) }}
						</template>

						<template v-else>
							{{ df.format(value.start.toDate(getLocalTimeZone())) }}
						</template>
					</template>
					<template v-else> Pick a date </template>
				</Button>
			</PopoverTrigger>
			<PopoverContent
				class="w-auto p-0"
				align="end">
				<RangeCalendar
					v-model="value"
					weekday-format="short"
					:number-of-months="2"
					initial-focus
					:placeholder="value.start"
					@update:start-value="(startDate) => (value.start = startDate)" />
				<div class="flex flex-row justify-end p-4 space-x-2">
					<Button @click="submitDateRange">Submit</Button>
				</div>
			</PopoverContent>
		</Popover>
	</div>
</template>
