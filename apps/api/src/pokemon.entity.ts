import { pgTable, serial, text, integer, jsonb, timestamp } from 'drizzle-orm/pg-core';

export const pokemons = pgTable('pokemons', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().unique(),
  pokedexId: integer('pokedex_id').notNull(),
  imageUrl: text('image_url'),
  types: jsonb('types').notNull(),
  abilities: jsonb('abilities').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
