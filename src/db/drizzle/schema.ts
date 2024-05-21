import {
  pgTable,
  pgView,
  bigserial,
  text,
  timestamp,
  uuid,
  jsonb,
  pgSchema,
} from "drizzle-orm/pg-core";
import { eq } from "drizzle-orm";

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

export const users = pgView("users").as((qb) => {
  return qb
    .select({
      id: authUsers.id,
      email: authUsers.email,
      rawAppMetaData: authUsers.rawAppMetaData,
      rawUserMetaData: authUsers.rawUserMetaData,
      name: userProfiles.name,
      userRoleId: userProfiles.userRoleId,
      roleName: userRoles.name,
    })
    .from(authUsers)
    .innerJoin(userProfiles, eq(authUsers.id, userProfiles.id))
    .innerJoin(userRoles, eq(userProfiles.userRoleId, userRoles.id));
});
