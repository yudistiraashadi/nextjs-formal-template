"use server";

import { permanentRedirect } from "next/navigation";
import { createClient } from "@/db/supabase/server";

import { eq } from "drizzle-orm";
import { createDrizzleConnection } from "@/db/drizzle/connection";
import { authUsers, userProfiles, userRoles } from "@/db/drizzle/schema";

export async function logout() {
  const supabase = createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error(error);
  }

  permanentRedirect("/");
}

export async function getUserData(userId: string) {
  const db = createDrizzleConnection();

  return await db
    .select({
      id: authUsers.id,
      email: authUsers.email,
      rawAppMetaData: authUsers.rawAppMetaData,
      rawUserMetaData: authUsers.rawUserMetaData,
      name: userProfiles.name,
      userRoleId: userProfiles.userRoleId,
      userRoleName: userRoles.name,
    })
    .from(authUsers)
    .leftJoin(userProfiles, eq(authUsers.id, userProfiles.id))
    .leftJoin(userRoles, eq(userProfiles.userRoleId, userRoles.id))
    .where(eq(authUsers.id, userId))
    .then((res) => res[0] ?? null);
}

export async function getAllUserData() {
  const db = createDrizzleConnection();

  return await db
    .select({
      id: authUsers.id,
      email: authUsers.email,
      rawAppMetaData: authUsers.rawAppMetaData,
      rawUserMetaData: authUsers.rawUserMetaData,
      name: userProfiles.name,
      userRoleId: userProfiles.userRoleId,
      userRoleName: userRoles.name,
    })
    .from(authUsers)
    .leftJoin(userProfiles, eq(authUsers.id, userProfiles.id))
    .leftJoin(userRoles, eq(userProfiles.userRoleId, userRoles.id));
}
