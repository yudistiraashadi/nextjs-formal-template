"use server";

import { createAdminClient } from "@/db/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { users } from "@/db/drizzle/schema";
import { createDrizzleConnection } from "@/db/drizzle/connection";

/**
 * Activate User
 */
export async function activateUser(prevState: any, formData: FormData) {
  const userId = formData.get("userId")
    ? (formData.get("userId") as string)
    : undefined;

  const db = createDrizzleConnection();
  const userData = await db.select().from(users);

  const result = z
    .object({
      userId: z
        .string()
        .refine((val) => userData.find((user) => user.id === val), {
          message: "User tidak ditemukan",
        }),
    })
    .safeParse({
      userId,
    });

  // validasi error
  if (!result.success) {
    let errorFormatted = result.error.format();

    return {
      error: {
        general: errorFormatted.userId?._errors[0],
      },
    };
  }

  const supabaseAdmin = createAdminClient();

  const { data: activateUserData, error: activateUserError } =
    await supabaseAdmin.auth.admin.updateUserById(result.data.userId, {
      app_metadata: {
        deleted_at: null,
      },
    });

  if (activateUserError) {
    return {
      error: {
        general: activateUserError.message,
      },
    };
  }

  // if success
  revalidatePath("/dashboard/user");

  return {
    message: "User berhasil diaktifkan",
  };
}
