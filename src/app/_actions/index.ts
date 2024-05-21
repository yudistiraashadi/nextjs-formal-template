"use server";

import { permanentRedirect } from "next/navigation";
import { createClient } from "@/db/supabase/server";

export async function logout() {
  const supabase = createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error(error);
  }

  permanentRedirect("/");
}
