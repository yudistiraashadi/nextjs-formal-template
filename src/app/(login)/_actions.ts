"use server";

import { createClient } from "@/db/supabase/server";
import { permanentRedirect } from "next/navigation";
import { z } from "zod";

/**
 * Login
 */
export async function login(prevState: any, formData: FormData) {
  const validation = z
    .object({
      username: z.string().min(1),
      password: z.string().min(6),
    })
    .safeParse({
      username: formData.get("username")
        ? (formData.get("username") as string)
        : undefined,
      password: formData.get("password")
        ? (formData.get("password") as string)
        : undefined,
    });

  // validasi error
  if (!validation.success) {
    let errorFormatted = validation.error.format();

    return {
      error: {
        username: errorFormatted.username?._errors[0],
        password: errorFormatted.password?._errors[0],
      },
    };
  }

  const supabase = createClient();

  // login with supabase
  const { error } = await supabase.auth.signInWithPassword({
    email: validation.data.username + "@email.com",
    password: validation.data.password,
  });

  // supabase error
  if (error) {
    return {
      error: {
        general: error.message,
      },
    };
  }

  // redirect if success
  permanentRedirect("/dashboard");
}
