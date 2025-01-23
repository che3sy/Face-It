<script setup lang="ts" generic="TData extends { id: number }, TValue">
	import type {
		ColumnDef,
		SortingState,
		ColumnFiltersState,
		VisibilityState,
		ExpandedState,
	} from "@tanstack/vue-table";
	import {
		Table,
		TableBody,
		TableCell,
		TableHead,
		TableHeader,
		TableRow,
	} from "@/components/ui/table";
	import {
		DropdownMenu,
		DropdownMenuCheckboxItem,
		DropdownMenuContent,
		DropdownMenuTrigger,
	} from "@/components/ui/dropdown-menu";

	import {
		FlexRender,
		getCoreRowModel,
		useVueTable,
		getPaginationRowModel,
		getSortedRowModel,
		getFilteredRowModel,
		getExpandedRowModel,
	} from "@tanstack/vue-table";
	import { Input } from "@/components/ui/input";

	import { valueUpdater } from "@/libs/utils";
	import { LucideChevronDown } from "lucide-vue-next";

	const props = defineProps<{
		columns: ColumnDef<TData, TValue>[];
		data: TData[];
	}>();

	const sorting = ref<SortingState>([]);
	const columnFilters = ref<ColumnFiltersState>([]);
	const columnVisibility = ref<VisibilityState>({});
	const rowSelection = ref({});
	const expanded = ref<ExpandedState>({});
	const { deleteTransaction } = useFinancialData();

	const table = useVueTable({
		get data() {
			return props.data;
		},
		get columns() {
			return props.columns;
		},
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getExpandedRowModel: getExpandedRowModel(),

		onSortingChange: (updaterOrValue) => valueUpdater(updaterOrValue, sorting),
		onColumnFiltersChange: (updaterOrValue) =>
			valueUpdater(updaterOrValue, columnFilters),
		getFilteredRowModel: getFilteredRowModel(),
		onRowSelectionChange: (updaterOrValue) =>
			valueUpdater(updaterOrValue, rowSelection),
		onColumnVisibilityChange: (updaterOrValue) =>
			valueUpdater(updaterOrValue, columnVisibility),
		onExpandedChange: (updaterOrValue) =>
			valueUpdater(updaterOrValue, expanded),

		state: {
			get sorting() {
				return sorting.value;
			},
			get columnFilters() {
				return columnFilters.value;
			},
			get columnVisibility() {
				return columnVisibility.value;
			},
			get rowSelection() {
				return rowSelection.value;
			},
			get expanded() {
				return expanded.value;
			},
		},
	});
	const handleDeleteSelected = async () => {
		const selectedRows = table.getSelectedRowModel().rows;
		for (const row of selectedRows) {
			await deleteTransaction(row.original.id);
		}
		table.resetRowSelection();
	};
</script>

<template>
	<div class="flex items-center py-4">
		<Input
			class="max-w-sm"
			placeholder="Filter Category..."
			:model-value="table.getColumn('category')?.getFilterValue() as string"
			@update:model-value="
				table.getColumn('category')?.setFilterValue($event)
			" />
		<Button
			class="ml-2"
			variant="destructive"
			size="sm"
			v-if="table.getFilteredSelectedRowModel().rows.length > 0"
			@click="handleDeleteSelected">
			Delete All Selected
		</Button>
		<DropdownMenu>
			<DropdownMenuTrigger as-child>
				<Button
					variant="outline"
					class="ml-auto">
					Columns
					<LucideChevronDown class="w-4 h-4 ml-2" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuCheckboxItem
					v-for="column in table
						.getAllColumns()
						.filter((column) => column.getCanHide())"
					:key="column.id"
					class="capitalize"
					:checked="column.getIsVisible()"
					@update:checked="
						(value) => {
							column.toggleVisibility(!!value);
						}
					">
					{{ column.id }}
				</DropdownMenuCheckboxItem>
			</DropdownMenuContent>
		</DropdownMenu>
	</div>
	<div class="border rounded-md">
		<Table>
			<TableHeader>
				<TableRow
					v-for="headerGroup in table.getHeaderGroups()"
					:key="headerGroup.id">
					<TableHead
						v-for="header in headerGroup.headers"
						:key="header.id">
						<FlexRender
							v-if="!header.isPlaceholder"
							:render="header.column.columnDef.header"
							:props="header.getContext()" />
					</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				<template v-if="table.getRowModel().rows?.length">
					<template
						v-for="row in table.getRowModel().rows"
						:key="row.id">
						<TableRow
							:data-state="row.getIsSelected() ? 'selected' : undefined">
							<TableCell
								v-for="cell in row.getVisibleCells()"
								:key="cell.id">
								<FlexRender
									:render="cell.column.columnDef.cell"
									:props="cell.getContext()" />
							</TableCell>
						</TableRow>
						<TableRow v-if="row.getIsExpanded()">
							<TableCell :colspan="row.getAllCells().length">
								{{ JSON.stringify(row.original) }}
							</TableCell>
						</TableRow>
					</template>
				</template>
				<template v-else>
					<TableRow>
						<TableCell
							:colspan="columns.length"
							class="h-24 text-center">
							No results.
						</TableCell>
					</TableRow>
				</template>
			</TableBody>
		</Table>
	</div>
	<div class="flex items-center justify-end py-4 space-x-2">
		<div class="flex-1 text-sm text-muted-foreground">
			{{ table.getFilteredSelectedRowModel().rows.length }} of
			{{ table.getFilteredRowModel().rows.length }} row(s) selected.
		</div>
		<div class="space-x-2">
			<Button
				variant="outline"
				size="sm"
				:disabled="!table.getCanPreviousPage()"
				@click="table.previousPage()">
				Previous
			</Button>
			<Button
				variant="outline"
				size="sm"
				:disabled="!table.getCanNextPage()"
				@click="table.nextPage()">
				Next
			</Button>
		</div>
	</div>
</template>
