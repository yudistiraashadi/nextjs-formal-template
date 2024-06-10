"use server";

import { createAdminClient } from "@/db/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { eq } from "drizzle-orm";

import { userRoles } from "@/db/drizzle/schema";
import { createDrizzleConnection } from "@/db/drizzle/connection";
import { permanentRedirect } from "next/navigation";

/**
 * Create User
 */
export async function createUser(prevState: any, formData: FormData) {
  const username = formData.get("username")
    ? (formData.get("username") as string)
    : undefined;
  const name = formData.get("name")
    ? (formData.get("name") as string)
    : undefined;
  const roleId = formData.get("roleId")
    ? (formData.get("roleId") as string)
    : undefined;
  const password = formData.get("password")
    ? (formData.get("password") as string)
    : undefined;
  const passwordConfirmation = formData.get("passwordConfirmation")
    ? (formData.get("passwordConfirmation") as string)
    : undefined;

  const db = createDrizzleConnection();

  const result = await z
    .object({
      username: z.string().min(1),
      name: z.string().min(1),
      roleId: z.coerce.number().refine(
        async (val) => {
          return db
            .select()
            .from(userRoles)
            .where(eq(userRoles.id, val))
            .then((res) => res.length > 0);
        },
        {
          message: "Role tidak ditemukan",
        }
      ),
      password: z.string().min(6),
      passwordConfirmation: z.string().min(6),
    })
    .refine((data) => data.password === data.passwordConfirmation, {
      message: "Password confirmation must be same as password",
      path: ["passwordConfirmation"],
    })
    .safeParseAsync({
      username,
      name,
      roleId,
      password,
      passwordConfirmation,
    });

  // validasi error
  if (!result.success) {
    let errorFormatted = result.error.format();

    return {
      error: {
        general: undefined, // for typescript
        username: errorFormatted.username?._errors[0],
        name: errorFormatted.name?._errors[0],
        roleId: errorFormatted.roleId?._errors[0],
        password: errorFormatted.password?._errors[0],
        passwordConfirmation: errorFormatted.passwordConfirmation?._errors[0],
      },
    };
  }

  const supabaseAdmin = createAdminClient();

  // create user
  const { data: createUserData, error: createUserError } =
    await supabaseAdmin.auth.admin.createUser({
      email: result.data.username + "@email.com",
      password: result.data.password,
      email_confirm: true,
      user_metadata: { name: result.data.name },
    });

  // supabase createUser error
  if (createUserError) {
    return {
      error: {
        general:
          createUserError?.status === 422
            ? "Username sudah digunakan"
            : createUserError.message,
      },
    };
  }

  // if success
  revalidatePath("/dashboard/user");

  const searchParamString = new URLSearchParams({
    "notification-type": "success",
    "notification-message": `Berhasil membuat user baru Username: ${
      createUserData.user.email?.split("@")[0]
    }`,
  }).toString();

  permanentRedirect(`/dashboard/user?${searchParamString}`);
}
