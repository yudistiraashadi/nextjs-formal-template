import { DashboardAppShell } from "@/components/appshell";
import { createClient } from "@/db/supabase/server";
import { eq } from "drizzle-orm";

import { notificationHelper } from "@/utils/notification";
import { notFound } from "next/navigation";
import { createDrizzleConnection } from "@/db/drizzle/connection";
import { users } from "@/db/drizzle/schema";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (!user || userError) {
    notificationHelper({
      type: "error",
      message: userError?.message || "Session not found",
    });

    return notFound();
  }

  const db = createDrizzleConnection();

  const userData = await db
    .select()
    .from(users)
    .where(eq(users.id, user.id))
    .then((res) => res[0] ?? null);

  return <DashboardAppShell userData={userData}>{children}</DashboardAppShell>;
}
