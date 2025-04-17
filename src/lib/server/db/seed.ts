import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { tokens } from './schema';
import { sql } from 'drizzle-orm';
import * as dotenv from 'dotenv';

dotenv.config();

/**
 * @DEV NOTE
 * This file is used to seed the database with initial data
 * It is used to populate the database with the initial data
 * that is required for the app to function
 *
 * Run the seed function using:
 * npm run db:seed
 *
 * To see the tokens in the database, run:
 * npm run db:studio
 * or
 * docker exec -it svelte-practice-db-1 psql -U root -d local
 * \dt
 * select * from tokens;
 */
const INITIAL_TOKENS = [
  { name: 'ton', api_id: 'the-open-network' },
  { name: 'usdt', api_id: 'tether' },
  { name: 'ethereum', api_id: 'ethereum' },
  { name: 'bitcoin', api_id: 'bitcoin' },
  { name: 'solana', api_id: 'solana' }
] as const;

async function seed() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error('DATABASE_URL is not set');
  }

  // Create the connection
  const client = postgres(databaseUrl);
  const db = drizzle(client);

  try {
    console.log('Seeding database...');

    // Insert tokens
    const insertedTokens = await db.insert(tokens)
      .values([...INITIAL_TOKENS])
      .onConflictDoUpdate({
        target: tokens.api_id,
        set: {
          name: sql`EXCLUDED.name`,
          updated_at: sql`CURRENT_TIMESTAMP`
        }
      })
      .returning();

    console.log(`Inserted ${insertedTokens.length} tokens`);
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await client.end();
  }
}

seed().catch(console.error);
