import {
  pgTable,
  bigserial,
  text,
  timestamp,
  uuid,
  jsonb,
} from "drizzle-orm/pg-core";

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

export const users = pgTable("users", {
  id: uuid("id").primaryKey(),
  email: text("email"),
  name: text("name"),
  rawAppMetaData: jsonb("raw_app_meta_data"),
  rawUserMetaData: jsonb("raw_user_meta_data"),
  userRoleId: bigserial("user_role_id", { mode: "number" }),
  userRoleName: text("user_role_name"),
});
