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
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (!user || userError) {
    return <div>Error: {userError?.message}</div>;
  }

  return (
    <section className="border-divider rounded border bg-white p-4">
      {/* title  + buat user */}
      <h2 className="mb-4 text-3xl font-semibold">User</h2>

      {/* datagrid */}
      <UserDataGrid userData={userData} currentUserId={user.id} />
    </section>
  );
}
