import { json, error } from '@sveltejs/kit';
import { verify } from '@node-rs/argon2';
import { eq } from 'drizzle-orm';
import * as auth from '$lib/server/auth';
import { db } from '$lib/server/db';
import { user } from '$lib/server/db/schema';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async (event) => {
	const body = await event.request.json();
	const { username, password } = body;

	if (!username || !password) {
		return error(400, 'Username and password required');
	}

	// Find user
	const results = await db.select().from(user).where(eq(user.username, username));
	const existingUser = results.at(0);

	if (!existingUser) {
		return error(400, 'Invalid credentials');
	}

	// Verify password
	const validPassword = await verify(existingUser.passwordHash, password, {
		memoryCost: 19456,
		timeCost: 2,
		outputLen: 32,
		parallelism: 1
	});

	if (!validPassword) {
		return error(400, 'Invalid credentials');
	}

	// Create session
	const sessionToken = auth.generateSessionToken();
	const session = await auth.createSession(sessionToken, existingUser.id);
	auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);

	return json({
		success: true,
		message: 'Logged in successfully',
		user: {
			id: existingUser.id,
			username: existingUser.username
		}
	});
};
