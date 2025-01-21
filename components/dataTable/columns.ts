import { h } from "vue";
import type { ColumnDef } from "@tanstack/vue-table";
import DropdownAction from "@/components/dataTable/DataTableDropDown.vue";

interface Transaction {
	id: number;
	type: "income" | "expense";
	category: string;
	amount: number;
	date_transaction: string;
	date_created: string;
}
import { ArrowUpDown } from "lucide-vue-next";
import { Button } from "@/components/ui/button";

export const columns: ColumnDef<Transaction>[] = [
	{
		accessorKey: "type",
		header: ({ column }) =>
			h(
				Button,
				{
					variant: "ghost",
					onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
				},
				() => ["Type", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })]
			),
		cell: ({ row }) => h("div", { class: "text-left" }, row.getValue("type")),
		enableSorting: true,
	},
	{
		accessorKey: "category",
		header: ({ column }) =>
			h(
				Button,
				{
					variant: "ghost",
					onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
				},
				() => ["Category", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })]
			),
		cell: ({ row }) =>
			h("div", { class: "text-left" }, row.getValue("category")),
		enableSorting: true,
	},
	{
		accessorKey: "amount",
		header: ({ column }) =>
			h(
				Button,
				{
					variant: "ghost",
					onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
				},
				() => ["Amount", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })]
			),
		cell: ({ row }) => {
			const amount = Number.parseFloat(row.getValue("amount"));
			const formatted = new Intl.NumberFormat("en-US", {
				style: "currency",
				currency: "USD",
			}).format(amount);
			return h("div", { class: "text-right font-medium" }, formatted);
		},
		enableSorting: true,
	},
	{
		accessorKey: "date_transaction",
		header: ({ column }) =>
			h(
				Button,
				{
					variant: "ghost",
					onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
				},
				() => ["Date of Transaction", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })]
			),
		cell: ({ row }) =>
			h(
				"div",
				{ class: "text-left" },
				new Date(row.getValue("date_transaction")).toLocaleDateString()
			),
		enableSorting: true,
	},
	{
		accessorKey: "date_created",
		header: ({ column }) =>
			h(
				Button,
				{
					variant: "ghost",
					onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
				},
				() => ["Date Created", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })]
			),
		cell: ({ row }) =>
			h(
				"div",
				{ class: "text-left" },
				new Date(row.getValue("date_created")).toLocaleDateString()
			),
		enableSorting: true,
	},
	{
		id: "actions",
		enableHiding: false,
		cell: ({ row }) => {
			const transaction = row.original;

			return h(
				"div",
				{ class: "relative" },
				h(DropdownAction, {
					transaction,
				})
			);
		},
	},
];
