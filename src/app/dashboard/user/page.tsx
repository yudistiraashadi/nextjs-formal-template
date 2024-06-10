import { users } from "@/db/drizzle/schema";
import { createDrizzleConnection } from "@/db/drizzle/connection";

import { UserDataGrid } from "./_datagrids";
import { createClient } from "@/db/supabase/server";

export default async function DataUser() {
  const db = createDrizzleConnection();

  // get all users
  const userData = await db
    .select()
    .from(users)
    .orderBy(users.userRoleName)
    .then((res) => {
      return res.map((val, index) => {
        return {
          ...val,
          no: index + 1,
        };
      });
    });

  // get current session
  const supabase = createClient();
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error || !session) {
    return <div>Error: {error?.message}</div>;
  }

  return (
    <section className="border-divider rounded border bg-white p-4">
      {/* title  + buat user */}
      <h2 className="mb-4 text-3xl font-semibold">User</h2>

      {/* datagrid */}
      <UserDataGrid userData={userData} currentUserId={session.user.id} />
    </section>
  );
}
