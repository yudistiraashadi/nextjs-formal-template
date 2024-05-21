"use client";

import { useEffect } from "react";
import { TextInput, PasswordInput, Select } from "@mantine/core";
import { useFormState } from "react-dom";
import { type InferSelectModel } from "drizzle-orm";
import { Tusers } from "@/db/drizzle/schema";

import { userRoles, users } from "@/db/drizzle/schema";
import { notificationHelper } from "@/utils/notification";

import { createUser, editUser } from "../_actions";
import { SubmitButton } from "@/components/button";

const userInitialState = {
  message: undefined,
  error: {
    general: undefined,
    username: undefined,
    name: undefined,
    roleId: undefined,
    password: undefined,
    passwordConfirmation: undefined,
  },
};

export function CreateOrEditUserForm({
  state,
  userRoleData,
  userData,
}: {
  state: "create" | "edit";
  userRoleData: InferSelectModel<typeof userRoles>[];
  userData?: Tusers;
}) {
  const [userState, userAction] = useFormState(
    state === "create" ? createUser : editUser,
    userInitialState
  );

  // action for form state changes
  useEffect(
    function userStateAction() {
      if (userState?.error?.general) {
        notificationHelper({
          type: "error",
          message: userState.error.general,
        });
      }
    },
    [userState]
  );

  return (
    <form action={userAction} className="space-y-4">
      <input type="hidden" name="id" value={userData?.id ?? ""} />

      <TextInput
        label="Username"
        required={state === "create"}
        name="username"
        error={userState?.error?.username}
        defaultValue={userData?.email?.split("@")[0]}
      />

      <TextInput
        label="Name"
        required={state === "create"}
        name="name"
        error={userState?.error?.name}
        // @ts-ignore
        defaultValue={userData?.rawUserMetaData?.name}
      />

      <Select
        label="Role"
        required={state === "create"}
        name="roleId"
        data={userRoleData.map((role) => ({
          value: role.id.toString(),
          label: role.name,
        }))}
        error={userState?.error?.roleId}
        defaultValue={userData?.userRoleId?.toString()}
      />

      <PasswordInput
        label="Password"
        required={state === "create"}
        name="password"
        error={userState?.error?.password}
      />

      <PasswordInput
        label="Password Confirmation"
        required={state === "create"}
        name="passwordConfirmation"
        error={userState?.error?.passwordConfirmation}
      />

      <SubmitButton text="Edit" mt="xl" />
    </form>
  );
}
