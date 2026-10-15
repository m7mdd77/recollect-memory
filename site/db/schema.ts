import {sqliteTable,text,integer,index} from 'drizzle-orm/sqlite-core';
export const sessions=sqliteTable('ai_sessions',{id:text('id').primaryKey(),csrf:text('csrf').notNull(),expires:integer('expires').notNull()});
export const limits=sqliteTable('ai_limits',{id:text('id').primaryKey(),count:integer('count').notNull(),expires:integer('expires').notNull()});
export const jobs=sqliteTable('ai_jobs',{id:text('id').primaryKey(),owner:text('owner').notNull(),payload:text('payload'),status:text('status').notNull(),created:integer('created').notNull(),lease:integer('lease').notNull().default(0),result:text('result')},t=>[index('ai_jobs_pending').on(t.status,t.created)]);
