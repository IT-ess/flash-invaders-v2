import { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle';
import { neon } from '@neondatabase/serverless';

import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { drizzle } from 'drizzle-orm/neon-http';
import { DATABASE_URL } from '$env/static/private';
import { Lucia } from 'lucia';
import { dev } from '$app/environment';

const sql = neon(DATABASE_URL!);
const db = drizzle(sql);

const userTable = pgTable('user', {
	id: text('id').primaryKey()
});

const sessionTable = pgTable('session', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => userTable.id),
	expiresAt: timestamp('expires_at', {
		withTimezone: true,
		mode: 'date'
	}).notNull()
});

const adapter = new DrizzlePostgreSQLAdapter(db, sessionTable, userTable);

export const lucia = new Lucia(adapter, {
	sessionCookie: {
		attributes: {
			// set to `true` when using HTTPS
			secure: !dev
		}
	},
	getUserAttributes: (attributes) => {
		return {
			// attributes has the type of DatabaseUserAttributes
			username: attributes.username
		};
	}
});

declare module 'lucia' {
	interface Register {
		Lucia: typeof lucia;
		DatabaseUserAttributes: DatabaseUserAttributes;
	}
}

interface DatabaseUserAttributes {
	username: string;
}
