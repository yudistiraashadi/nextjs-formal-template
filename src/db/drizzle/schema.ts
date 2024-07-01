import {
  pgTable,
  bigserial,
  text,
  timestamp,
  uuid,
  jsonb,
  pgSchema,
} from "drizzle-orm/pg-core";

/**
 * Auth Schema
 */
export const authSchema = pgSchema("auth");

export const authUsers = authSchema.table("users", {
  id: uuid("id").primaryKey(),
  email: text("email").notNull(),
  rawAppMetaData: jsonb("raw_app_meta_data"),
  rawUserMetaData: jsonb("raw_user_meta_data"),
});

/**
 * Public Schema
 */
export const userRoles = pgTable("user_roles", {
  id: bigserial("id", { mode: "number" }),
  createdAt: timestamp("created_at").defaultNow(),
  name: text("name").notNull(),
});

export const userProfiles = pgTable("user_profiles", {
  id: uuid("id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  name: text("name"),
  userRoleId: bigserial("user_role_id", { mode: "number" }).references(
    () => userRoles.id
  ),
});
