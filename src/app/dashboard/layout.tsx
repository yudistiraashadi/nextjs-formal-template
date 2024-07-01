import { DashboardAppShell } from "@/components/appshell";
import { createClient } from "@/db/supabase/server";

import { notificationHelper } from "@/utils/notification";
import { notFound } from "next/navigation";

import { getUserData } from "@/app/_actions";

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

  const userData = await getUserData(user.id);

  return <DashboardAppShell userData={userData}>{children}</DashboardAppShell>;
}
