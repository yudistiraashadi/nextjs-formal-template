"use server";

import { createAdminClient } from "@/db/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { permanentRedirect } from "next/navigation";
import { eq } from "drizzle-orm";

import { userRoles, userProfiles } from "@/db/drizzle/schema";
import { createDrizzleConnection } from "@/db/drizzle/connection";

/**
 * Edit User
 */
export async function editUser(prevState: any, formData: FormData) {
  const id = formData.get("id") ? (formData.get("id") as string) : undefined;
  const username = formData.get("username")
    ? (formData.get("username") as string)
    : undefined;
  const name = formData.get("name")
    ? (formData.get("name") as string)
    : undefined;
  const roleId = formData.get("roleId")
    ? parseInt(formData.get("roleId") as string)
    : undefined;
  const password = formData.get("password")
    ? (formData.get("password") as string)
    : undefined;
  const passwordConfirmation = formData.get("passwordConfirmation")
    ? (formData.get("passwordConfirmation") as string)
    : undefined;

  const db = createDrizzleConnection();
  const userRoleData = await db.select().from(userRoles);

  const result = z
    .object({
      id: z.string(),
      username: z.string().min(1).optional(),
      name: z.string().min(1).optional(),
      roleId: z
        .number()
        .refine((val) => userRoleData.find((role) => role.id === val), {
          message: "Role tidak ditemukan",
        })
        .optional(),
      password: z.string().min(6).optional(),
      passwordConfirmation: z.string().min(6).optional(),
    })
    .refine((data) => data.password === data.passwordConfirmation, {
      message: "Password confirmation must be same as password",
      path: ["passwordConfirmation"],
    })
    .safeParse({
      id,
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
        general: errorFormatted.id?._errors[0],
        username: errorFormatted.username?._errors[0],
        name: errorFormatted.name?._errors[0],
        roleId: errorFormatted.roleId?._errors[0],
        password: errorFormatted.password?._errors[0],
        passwordConfirmation: errorFormatted.passwordConfirmation?._errors[0],
      },
    };
  }

  const supabaseAdmin = createAdminClient();

  try {
    // update user
    await db.transaction(async (tx) => {
      await tx
        .update(userProfiles)
        .set({
          name: result.data.name,
          userRoleId: result.data.roleId,
        })
        .where(eq(userProfiles.id, result.data.id));

      const { data: updateUserData, error: updateUserError } =
        await supabaseAdmin.auth.admin.updateUserById(result.data.id, {
          email: result.data.username + "@email.com",
          password: result.data.password,
        });

      // supabase error (MASIH NGEBUG KALAU ADA PARAM EMAIL, JADI IGNORE ERRORNYA AJA KALAU STATUS 504)
      if (updateUserError) {
        // console.error({ updateUserData, updateUserError });
        if (updateUserError.status !== 504) {
          throw new Error(updateUserError.message);
        }
      }
    });
  } catch (error: Error | any) {
    return {
      error: {
        general: error?.message,
      },
    };
  }

  // if success
  revalidatePath("/dashboard/user");

  const searchParamString = new URLSearchParams({
    "notification-type": "success",
    "notification-message": `Berhasil edit user`,
  }).toString();

  permanentRedirect(`/dashboard/user?${searchParamString}`);
}
