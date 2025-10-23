<script lang="ts" generics="TData, TValue">
	import { createSvelteTable, FlexRender } from '$lib/components/ui/data-table/index';
	import * as Table from '$lib/components/ui/table/index';
	import { type ColumnDef, getCoreRowModel, getFilteredRowModel, getSortedRowModel } from '@tanstack/table-core';

	const {
		columns,
		data
	}: {
		columns: ColumnDef<TData, TValue>[];
		data: TData[];
	} = $props();

	const table = createSvelteTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getSortedRowModel: getSortedRowModel(),
		initialState: {
			sorting: [
				{
					id: 'period',
					desc: true
				}
			]
		}
	});
</script>

<div class="rounded-md border">
	<Table.Root>
		<Table.Header>
			{#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
				<Table.Row>
					{#each headerGroup.headers as header (header.id)}
						<Table.Head colspan={header.colSpan}>
							<FlexRender content={header.column.columnDef.header} context={header.getContext()} />
						</Table.Head>
					{/each}
				</Table.Row>
			{/each}
		</Table.Header>
		<Table.Body>
			{#each table.getRowModel().rows as row (row.id)}
				<Table.Row>
					{#each row.getVisibleCells() as cell (cell.id)}
						<Table.Cell>
							<FlexRender content={cell.column.columnDef.cell} context={cell.getContext()} />
						</Table.Cell>
					{/each}
				</Table.Row>
			{:else}
				<Table.Row>
					<Table.Cell colspan={columns.length} class="h-24 text-center">No results.</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
</div>
