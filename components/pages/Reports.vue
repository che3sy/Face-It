<script setup lang="ts">
	import { ref } from "vue";
	import { useGenerateReportPDF } from "@/composables/useGenerateReportPDF";

	const { generateReportPDF, generateReportDoc, docRef } =
		useGenerateReportPDF();
	const pdfPreview = ref<string>("");

	const previewReport = () => {
		generateReportDoc();
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
	<div class="flex flex-col items-center">
		<button @click="previewReport">Preview Report</button>
		<button
			@click="downloadReport"
			class="mt-5"
			>Download Report</button
		>
		<iframe
			v-if="pdfPreview"
			:src="pdfPreview"
			width="100%"
			height="600px" />
	</div>
</template>
