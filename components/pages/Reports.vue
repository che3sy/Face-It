<script setup lang="ts">
	import { ref } from "vue";
	import { useGenerateReportPDF } from "@/composables/useGenerateReportPDF";
	import { Button } from "@/components/ui/button";
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle,
	} from "@/components/ui/card";

	const { generateReportPDF, generateReportDoc, docRef } =
		useGenerateReportPDF();
	const pdfPreview = ref<string>("");

	const previewReport = async () => {
		await generateReportDoc();
		if (docRef.value) {
			const pdfBlob = docRef.value.output("blob");
			pdfPreview.value = URL.createObjectURL(pdfBlob);
		}
	};

	const downloadReport = () => {
		generateReportPDF();
	};
</script>

<template>
	<div
		class="absolute inset-0 h-full w-full bg-background bg-[linear-gradient(to_left,#80808012_1px,transparent_1px),linear-gradient(to_top,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:linear-gradient(to_top,rgba(0,0,0,0.6),transparent)] -z-10"></div>

	<div class="flex flex-col items-center">
		<Card class="w-[350px]">
			<CardHeader>
				<CardTitle>Financial report</CardTitle>
				<CardDescription
					>Export or view your current financial report</CardDescription
				>
			</CardHeader>
			<CardContent>
				<div class="grid items-center w-full gap-4">
					<div class="flex flex-col space-y-1.5">
						<Button @click="previewReport">Preview Report</Button>
					</div>
					<div class="flex flex-col space-y-1.5">
						<Button
							@click="downloadReport"
							class="mt-5"
							>Download Report</Button
						>
					</div>
				</div>
			</CardContent>
		</Card>
		<iframe
			class="mt-4"
			v-if="pdfPreview"
			:src="pdfPreview"
			width="100%"
			height="600px" />
	</div>
</template>
