import { createDrizzleConnection } from "@/db/drizzle/connection";
import { userRoles } from "@/db/drizzle/schema";

import { BackButton } from "@/components/button";

import { CreateOrEditUserForm } from "../_forms";

export default async function CreateUser() {
  const db = createDrizzleConnection();
  const userRoleData = await db.select().from(userRoles);

  return (
    <div className="space-y-4 bg-white p-4 drop-shadow">
      <BackButton href="/dashboard/user" />
      <h1 className="text-3xl font-bold">Tambah User</h1>

      <CreateOrEditUserForm state="create" userRoleData={userRoleData} />
    </div>
  );
}
