<script setup lang="ts" generic="T extends Record<string, any>">
	import type { BulletLegendItemInterface } from "@unovis/ts";
	import type { BaseChartProps } from ".";
	import { ChartCrosshair, ChartLegend } from "@/components/ui/chart";
	import { cn } from "@/lib/utils";
	import { Axis, GroupedBar, StackedBar } from "@unovis/ts";
	import {
		VisAxis,
		VisGroupedBar,
		VisStackedBar,
		VisXYContainer,
	} from "@unovis/vue";
	import { useMounted } from "@vueuse/core";
	import { type Component, computed, ref } from "vue";

	const props = withDefaults(
		defineProps<
			BaseChartProps<T> & {
				/**
				 * Render custom tooltip component.
				 */
				customTooltip?: Component;
				/**
				 * Change the type of the chart
				 * @default "grouped"
				 */
				type?: "stacked" | "grouped";
				/**
				 * Rounded bar corners
				 * @default 0
				 */
				roundedCorners?: number;
			}
		>(),
		{
			type: "grouped",
			margin: () => ({ top: 30, bottom: 0, left: 0, right: 0 }),
			filterOpacity: 0.2,
			roundedCorners: 0,
			showXAxis: true,
			showYAxis: true,
			showTooltip: true,
			showLegend: true,
			showGridLine: true,
		}
	);
	const emits = defineEmits<{
		legendItemClick: [d: BulletLegendItemInterface, i: number];
	}>();

	type KeyOfT = Extract<keyof T, string>;
	type Data = (typeof props.data)[number];

	const index = computed(() => props.index as KeyOfT);
	const colors = computed(() =>
		props.colors?.length ? props.colors : defaultColors(props.categories.length)
	);
	const legendItems = ref<BulletLegendItemInterface[]>(
		props.categories.map((category, i) => ({
			name: category,
			color: colors.value[i],
			inactive: false,
		}))
	);

	function defaultColors(count: number = 3) {
		const hueStep = 360 / count;
		return Array.from(new Array(count).keys()).map(
			(i) => `hsl(${i * hueStep}, 100%, 50%)`
		);
	}

	const isMounted = useMounted();

	// Add a computed property for unique category names
	const uniqueNames = computed(() => {
		return [...new Set(props.data.map((d) => d[props.index as KeyOfT]))];
	});

	// Create a color palette
	const colorPalette = computed(() => {
		return defaultColors(uniqueNames.value.length);
	});

	// Modify color computation
	const VisBarComponent = computed(() =>
		props.type === "grouped" ? VisGroupedBar : VisStackedBar
	);

	const barColor = (d: Data) => {
		const name = d[props.index as KeyOfT];
		const idx = uniqueNames.value.indexOf(name);
		return colorPalette.value[idx] || "#ccc";
	};
</script>

<template>
	<div
		:class="cn('w-full h-[400px] flex flex-col items-end', $attrs.class ?? '')">
		<VisXYContainer
			:data="data"
			:style="{ height: isMounted ? '100%' : 'auto' }"
			:margin="margin">
			<ChartCrosshair
				v-if="showTooltip"
				:colors="colors"
				:items="legendItems"
				:custom-tooltip="customTooltip"
				:index="index" />

			<VisBarComponent
				:x="(d: Data, i: number) => i"
				:y="categories.map(category => (d: Data) => d[category]) "
				:color="barColor"
				:rounded-corners="roundedCorners"
				:bar-padding="0.05" />

			<VisAxis
				v-if="showXAxis"
				type="x"
				:tick-format="xFormatter ?? ((v: number) => data[v]?.[index])"
				:grid-line="false"
				:tick-line="false"
				tick-text-color="hsl(var(--vis-text-color))" />
			<VisAxis
				v-if="showYAxis"
				type="y"
				:tick-line="false"
				:tick-format="yFormatter"
				:domain-line="false"
				:grid-line="showGridLine"
				:attributes="{
					[Axis.selectors.grid]: {
						class: 'text-muted',
					},
				}"
				tick-text-color="hsl(var(--vis-text-color))" />

			<slot />
		</VisXYContainer>
	</div>
</template>
