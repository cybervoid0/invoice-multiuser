<script lang="ts">
	import * as Table from '$lib/components/ui/table'

	const { data } = $props()
</script>

<div>
	<Table.Root>
		<Table.Caption>Invoices</Table.Caption>
		<Table.Header>
			<Table.Row>
				<Table.Head>#</Table.Head>
				<Table.Head>Title</Table.Head>
				<Table.Head>Sender</Table.Head>
				<Table.Head>Receiver</Table.Head>
				<Table.Head>Date</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each data.invoices as invoice (invoice.id)}
				<Table.Row>
					<Table.Cell>{invoice.number}</Table.Cell>
					<Table.Cell>{invoice.title}</Table.Cell>
					<Table.Cell>{invoice.sender?.name || 'N/A'}</Table.Cell>
					<Table.Cell>{invoice.receiver?.name || 'N/A'}</Table.Cell>
					<Table.Cell>{new Date(invoice.date).toLocaleDateString()}</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
</div>
