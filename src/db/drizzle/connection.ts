import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { DrizzleConfig } from "drizzle-orm";

import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";

// Fix for "sorry, too many clients already".
// Happened because HMR only on dev env https://www.answeroverflow.com/m/1146224610002600067
declare global {
  // eslint-disable-next-line no-var -- only var works here
  var db: PostgresJsDatabase | undefined;
}

let db: PostgresJsDatabase;

export function createDrizzleConnection(
  config?: DrizzleConfig<any> | undefined
) {
  const client = postgres(process.env.SUPABASE_CONNECTION_STRING!, {
    prepare: false,
  });

  if (process.env.APP_ENVIRONMENT === "production") {
    return drizzle(client, config);
  } else {
    if (!global.db) global.db = drizzle(client, config);

    db = global.db;

    return db;
  }
}
