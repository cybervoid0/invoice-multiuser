import {
	pgTable,
	serial,
	integer,
	text,
	timestamp,
	varchar,
	boolean,
	doublePrecision
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const user = pgTable('user', {
	id: text('id').primaryKey(),
	age: integer('age'),
	username: text('username').notNull().unique(),
	passwordHash: text('password_hash').notNull()
});

export const session = pgTable('session', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull()
});

// Invoice-related tables
export const bank = pgTable('bank', {
	id: serial('id').primaryKey(),
	name: varchar('name', { length: 20 }).notNull(),
	bic: varchar('bic', { length: 20 }).notNull(),
	address: text('address').notNull(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id)
});

export const contractor = pgTable('contractor', {
	id: serial('id').primaryKey(),
	name: varchar('name', { length: 100 }).notNull(),
	address: text('address').notNull(),
	email: varchar('email').notNull(),
	vat: varchar('vat'),
	iban: varchar('iban'),
	coc: varchar('coc'),
	ether: varchar('ether'),
	debtorNum: integer('debtorNum'),
	bankId: integer('bankId').references(() => bank.id),
	userId: text('user_id')
		.notNull()
		.references(() => user.id)
});

export const invoice = pgTable('invoice', {
	id: serial('id').primaryKey(),
	number: integer('number').notNull(),
	date: timestamp('date').notNull(),
	dueDate: timestamp('dueDate').notNull(),
	senderId: integer('senderId').references(() => contractor.id),
	receiverId: integer('receiverId').references(() => contractor.id),
	isSent: boolean('isSent').notNull().default(false),
	discountPercent: doublePrecision('discountPercent').notNull().default(0),
	title: varchar('title').notNull(),
	subject: varchar('subject').notNull(),
	keywords: text('keywords').notNull(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id)
});

export const invoiceItem = pgTable('invoice_item', {
	id: serial('id').primaryKey(),
	amount: integer('amount').notNull(),
	description: text('description').notNull(),
	price: doublePrecision('price').notNull(),
	vat: doublePrecision('vat').notNull().default(0),
	invoiceId: integer('invoiceId').references(() => invoice.id, { onDelete: 'cascade' }),
	price2: doublePrecision('price2'),
	currency: varchar('currency').notNull().default('EUR')
});

// Relations
export const userRelations = relations(user, ({ many }) => ({
	banks: many(bank),
	contractors: many(contractor),
	invoices: many(invoice),
	sessions: many(session)
}));

export const bankRelations = relations(bank, ({ one, many }) => ({
	user: one(user, {
		fields: [bank.userId],
		references: [user.id]
	}),
	contractors: many(contractor)
}));

export const contractorRelations = relations(contractor, ({ one, many }) => ({
	user: one(user, {
		fields: [contractor.userId],
		references: [user.id]
	}),
	bank: one(bank, {
		fields: [contractor.bankId],
		references: [bank.id]
	}),
	sentInvoices: many(invoice, { relationName: 'sender' }),
	receivedInvoices: many(invoice, { relationName: 'receiver' })
}));

export const invoiceRelations = relations(invoice, ({ one, many }) => ({
	user: one(user, {
		fields: [invoice.userId],
		references: [user.id]
	}),
	sender: one(contractor, {
		fields: [invoice.senderId],
		references: [contractor.id],
		relationName: 'sender'
	}),
	receiver: one(contractor, {
		fields: [invoice.receiverId],
		references: [contractor.id],
		relationName: 'receiver'
	}),
	items: many(invoiceItem)
}));

export const invoiceItemRelations = relations(invoiceItem, ({ one }) => ({
	invoice: one(invoice, {
		fields: [invoiceItem.invoiceId],
		references: [invoice.id]
	})
}));

export const sessionRelations = relations(session, ({ one }) => ({
	user: one(user, {
		fields: [session.userId],
		references: [user.id]
	})
}));

// Type exports
export type Session = typeof session.$inferSelect;
export type User = typeof user.$inferSelect;
export type Bank = typeof bank.$inferSelect;
export type Contractor = typeof contractor.$inferSelect;
export type Invoice = typeof invoice.$inferSelect;
export type InvoiceItem = typeof invoiceItem.$inferSelect;
