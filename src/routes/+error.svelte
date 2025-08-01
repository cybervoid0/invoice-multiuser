<script lang="ts">
	import { page } from '$app/state'
</script>

<h1>Error {page.status}</h1>

{#if page.error?.message}
	<p>{page.error.message}</p>
{/if}

<a href="/">Home</a>
