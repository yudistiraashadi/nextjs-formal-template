import { createDrizzleConnection } from "@/db/drizzle/connection";
import { userRoles } from "@/db/drizzle/schema";

import { BackButton } from "@/components/button";

import { CreateOrEditUserForm } from "../../_forms";
import { getUserData } from "@/app/_actions";
import { Container } from "@/components/container";

export default async function EditUser({
  params,
}: {
  params: {
    userId: string;
  };
}) {
  const userId = params.userId;
  const db = createDrizzleConnection();

  const currentUserData = await getUserData(userId);

  if (!currentUserData) {
    return <div>User not found</div>;
  }

  const userRoleData = await db.select().from(userRoles);

  return (
    <Container>
      <BackButton href="/dashboard/user" />
      <h1 className="text-3xl font-bold">Edit User</h1>

      <CreateOrEditUserForm
        state="edit"
        userRoleData={userRoleData}
        userData={currentUserData}
      />
    </Container>
  );
}
