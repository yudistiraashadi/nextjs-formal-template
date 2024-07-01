import { createDrizzleConnection } from "@/db/drizzle/connection";
import { userRoles } from "@/db/drizzle/schema";

import { BackButton } from "@/components/button";

import { CreateOrEditUserForm } from "../_forms";
import { Container } from "@/components/container";

export default async function CreateUser() {
  const db = createDrizzleConnection();
  const userRoleData = await db.select().from(userRoles);

  return (
    <Container>
      <BackButton href="/dashboard/user" />
      <h1 className="text-3xl font-bold">Tambah User</h1>

      <CreateOrEditUserForm state="create" userRoleData={userRoleData} />
    </Container>
  );
}
