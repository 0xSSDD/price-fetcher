import { pgTable, text, timestamp, numeric, uuid, uniqueIndex } from "drizzle-orm/pg-core";

/**
 * @DEV NOTE
 * Currently using "Codebase First" approach for the database schema - and Drizzle
 *
 * npm run db:push - Does direct schema changes to the databas
 *
 * Refer: https://orm.drizzle.team/docs/migrations
 */

/**
 * Tokens
 * @DEV NOTE
 * This table currently includes only those fields that are required for the app to function
 * as per the current requirements
 * We can extend this table as per the requirements
 */
export const tokens = pgTable('tokens', {
	id: uuid('id').primaryKey().defaultRandom(),
		name: text('name').notNull(),
		api_id: text('api_id').notNull(),
		created_at: timestamp('created_at', { withTimezone: true, mode: 'date' })
			.notNull()
			.defaultNow(),
		updated_at: timestamp('updated_at', { withTimezone: true, mode: 'date' })
			.notNull()
			.defaultNow()
	}, (table) => [
		uniqueIndex('token_api_id_idx').on(table.api_id)
	]);

/**
 * Prices
 * @DEV NOTE
 * This table currently includes only those fields that are required for the app to function
 * as per the current requirements
 * We can extend this table as per the requirements
 */
export const prices = pgTable('prices', {
	id: uuid('id').primaryKey().defaultRandom(),
	base_token_id: uuid('base_token_id')
		.notNull()
		.references(() => tokens.id),
	quote_token_id: uuid('quote_token_id')
		.notNull()
		.references(() => tokens.id),
	rate: numeric('rate', { precision: 24, scale: 18 }).notNull(),
	base_usd_price: numeric('base_usd_price', { precision: 24, scale: 18 }).notNull(),
	quote_usd_price: numeric('quote_usd_price', { precision: 24, scale: 18 }).notNull(),
	created_at: timestamp('created_at', { withTimezone: true, mode: 'date' })
		.notNull()
		.defaultNow(),
	updated_at: timestamp('updated_at', { withTimezone: true, mode: 'date' })
		.notNull()
		.defaultNow()
});