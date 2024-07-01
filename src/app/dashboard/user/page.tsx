import { UserDataGrid } from "./_datagrids";
import { createClient } from "@/db/supabase/server";
import { getAllUserData } from "@/app/_actions";

export default async function DataUser() {
  // get current session
  const supabase = createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (!user || userError) {
    return <div>Error: {userError?.message}</div>;
  }

  // get all user data
  const userData = await getAllUserData().then((res) =>
    res.map((data, index) => ({ ...data, no: index + 1 }))
  );

  return (
    <section className="border-divider rounded border bg-white p-4">
      {/* title  + buat user */}
      <h2 className="mb-4 text-3xl font-semibold">User</h2>

      {/* datagrid */}
      <UserDataGrid userData={userData} currentUserId={user.id} />
    </section>
  );
}
