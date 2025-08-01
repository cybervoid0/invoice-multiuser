import { error } from '@sveltejs/kit'
import { eq } from 'drizzle-orm'
import type { PageServerLoad } from './$types'
import { db } from '$lib/server/db'
import { invoice } from '$lib/server/db/schema'

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) return error(401, 'Unauthorized')

	try {
		const invoices = await db.query.invoice.findMany({
			where: eq(invoice.userId, locals.user.id),
			columns: {
				title: true,
				date: true,
				id: true,
				number: true,
			},
			with: {
				items: true,
				sender: {
					columns: {
						name: true,
					},
				},
				receiver: {
					columns: {
						name: true,
					},
				},
			},
		})
		return {
			invoices: invoices.map((inv) => ({
				...inv,
				totalAmount: inv.items.reduce((acc, item) => acc + item.price * item.amount, 0),
				totalAmount2: inv.items.reduce((acc, item) => acc + (item.price2 ?? 0) * item.amount, 0),
			})),
		}
	} catch (err) {
		return error(500, err instanceof Error ? err.message : 'Failed to load invoices')
	}
}
