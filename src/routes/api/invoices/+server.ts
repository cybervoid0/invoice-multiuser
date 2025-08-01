import { json, error } from '@sveltejs/kit'
import { db } from '$lib/server/db'
import { invoice } from '$lib/server/db/schema'
import { eq, desc } from 'drizzle-orm'
import type { RequestHandler } from './$types'

export const GET: RequestHandler = async ({ locals }) => {
	// Check if user is authenticated
	if (!locals.user) {
		return error(401, 'Unauthorized')
	}

	const userId = locals.user.id

	try {
		// Get all invoices for the user with related data using Drizzle query API
		const invoicesWithItems = await db.query.invoice.findMany({
			where: eq(invoice.userId, userId),
			with: {
				items: true, // Gets all invoice items
				sender: {
					columns: {
						id: true,
						name: true,
						email: true,
						address: true
					}
				},
				receiver: {
					columns: {
						id: true,
						name: true,
						email: true,
						address: true
					}
				}
			},
			orderBy: [desc(invoice.date)] // Most recent first
		})

		return json({
			success: true,
			count: invoicesWithItems.length,
			data: invoicesWithItems
		})
	} catch (err) {
		console.error('Error fetching invoices:', err)
		return error(500, 'Internal server error')
	}
}
