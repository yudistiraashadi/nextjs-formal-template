import { DashboardAppShell } from "@/components/appshell";
import { createClient } from "@/db/supabase/server";

import { notificationHelper } from "@/utils/notification";
import { notFound } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();

  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (!session?.user || error) {
    notificationHelper({
      type: "error",
      message: error?.message || "Session not found",
    });

    return notFound();
  }

  return (
    <DashboardAppShell userData={session?.user}>{children}</DashboardAppShell>
  );
}
