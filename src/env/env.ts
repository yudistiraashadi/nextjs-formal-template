"use server";

import { envsafe, str } from "envsafe";

// ONLY FOR CLIENT ACCESSIBLE ENV VARIABLES (NEXT_PUBLIC_*)
export const getEnv = async () =>
  envsafe({
    NEXT_PUBLIC_SUPABASE_URL: str(),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: str(),
  });
