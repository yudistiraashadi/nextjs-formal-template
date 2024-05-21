"use server";

import { createClient } from "@/db/supabase/server";
import { permanentRedirect } from "next/navigation";
import { z } from "zod";

/**
 * Login
 */
export async function login(prevState: any, formData: FormData) {
  const username = formData.get("username")
    ? (formData.get("username") as string)
    : undefined;
  const password = formData.get("password")
    ? (formData.get("password") as string)
    : undefined;

  const result = z
    .object({
      username: z.string().min(1),
      password: z.string().min(6),
    })
    .safeParse({
      username,
      password,
    });

  // validasi error
  if (!result.success) {
    let errorFormatted = result.error.format();

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
    email: result.data.username + "@email.com",
    password: result.data.password,
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
