import { eq } from "drizzle-orm";

import { createDrizzleConnection } from "@/db/drizzle/connection";
import { userRoles, users } from "@/db/drizzle/schema";

import { BackButton } from "@/components/button";

import { CreateOrEditUserForm } from "../../_forms";

export default async function EditUser({
  params,
}: {
  params: {
    userId: string;
  };
}) {
  const userId = params.userId;
  const db = createDrizzleConnection();

  const currentUserData = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .then((res) => res[0] ?? null);

  if (!currentUserData) {
    return <div>User not found</div>;
  }

  const userRoleData = await db.select().from(userRoles);

  return (
    <div className="space-y-4 bg-white p-4 drop-shadow">
      <BackButton href="/dashboard/user" />
      <h1 className="text-3xl font-bold">Edit User</h1>

      <CreateOrEditUserForm
        state="edit"
        userRoleData={userRoleData}
        userData={currentUserData}
      />
    </div>
  );
}
