"use client";

import { useEffect } from "react";
import { useFormState } from "react-dom";
import DataGrid, {
  Column,
  FilterRow,
  SearchPanel,
  Button as DataGridButton,
  Export,
  Toolbar,
  Item,
} from "devextreme-react/data-grid";
import { Button as DevextremeButton } from "devextreme-react/button";
import Link from "next/link";
import { Badge } from "@mantine/core";
import { IconCheck, IconX } from "@tabler/icons-react";
import { Text, Button } from "@mantine/core";
import { modals } from "@mantine/modals";
import { users } from "@/db/drizzle/schema";
import { InferSelectModel } from "drizzle-orm";

import {
  SCROLLING_CONFIG,
  exportExcel,
  exportPdf,
} from "@/utils/devextreme/datagrid";
import { redirectToEditUser, deleteUser, activateUser } from "../_actions";
import { notificationHelper } from "@/utils/notification";
import { SubmitButton } from "@/components/button";

const userInitialState = {
  message: undefined,
  error: {
    general: undefined,
  },
};

/**
 * Users datagrid, with modal to create and edit user
 *
 * @param {any} usersData
 * @returns
 */
export function UserDataGrid({
  userData,
  currentUserId,
}: {
  userData: (InferSelectModel<typeof users> & {
    no: number;
  })[];
  currentUserId: string;
}) {
  // DELETE USER
  const [deleteUserState, deleteUserAction] = useFormState(
    deleteUser,
    userInitialState
  );

  useEffect(
    function deleteUserStateAction() {
      if (deleteUserState?.error?.general) {
        notificationHelper({
          type: "error",
          message: deleteUserState.error.general,
        });
      }

      if (deleteUserState?.message) {
        notificationHelper({
          type: "success",
          message: deleteUserState.message,
        });

        modals.closeAll();
      }
    },
    [deleteUserState]
  );
  // END OF DELETE USER

  // ACTIVATE USER
  const [activateUserState, activateUserAction] = useFormState(
    activateUser,
    userInitialState
  );

  useEffect(
    function activateUserStateAction() {
      if (activateUserState?.error?.general) {
        notificationHelper({
          type: "error",
          message: activateUserState.error.general,
        });
      }

      if (activateUserState?.message) {
        notificationHelper({
          type: "success",
          message: activateUserState.message,
        });

        modals.closeAll();
      }
    },
    [activateUserState]
  );
  // END OF ACTIVATE USER

  return (
    <DataGrid
      dataSource={userData}
      onExporting={(e) => {
        if (e.format === "pdf") {
          exportPdf(e, "User Data");
        } else if (e.format === "excel") {
          exportExcel(e, "User Data");
        }
      }}
      showColumnLines={true}
      showBorders={true}
      rowAlternationEnabled={true}
      keyExpr={"id"}
      columnAutoWidth={true}
      scrolling={SCROLLING_CONFIG}
    >
      <Toolbar>
        <Item location="before">
          <Link href={`/dashboard/user/create`}>
            <DevextremeButton text="Add User" icon="add" />
          </Link>
        </Item>
        <Item name="exportButton" />
        <Item name="searchPanel" />
      </Toolbar>
      <FilterRow visible={true} />
      <SearchPanel visible={true} />
      <Export enabled={true} formats={["excel", "pdf"]} />

      <Column caption="No." dataField="no" width={"3.5rem"} />
      <Column
        caption="Username"
        allowSearch={true}
        allowFiltering={true}
        allowSorting={true}
        calculateCellValue={(rowData) => rowData.email.split("@")[0]}
      />
      <Column dataField="name" caption="Name" />
      <Column
        caption="Role"
        allowSearch={true}
        allowFiltering={true}
        allowSorting={true}
        calculateCellValue={(rowData) => rowData.userRoleName}
      />
      <Column
        caption="Status"
        allowSearch={true}
        allowFiltering={true}
        allowSorting={true}
        calculateCellValue={(rowData) =>
          rowData.rawAppMetaData.deleted_at ? "Non-active" : "Active"
        }
        filterOperations={["="]}
        cellRender={(e) => {
          let isActive = e.value === "Active" ? true : false;

          return (
            <div className="flex items-center justify-center">
              <Badge
                leftSection={
                  isActive ? (
                    <IconCheck size="1.25rem" stroke={1.5} />
                  ) : (
                    <IconX size="1.25rem" stroke={1.5} />
                  )
                }
                color={isActive ? "green" : "red"}
              >
                {isActive ? "Active" : "Non-active"}
              </Badge>
            </div>
          );
        }}
      />
      <Column type="buttons" caption="Aksi">
        <DataGridButton
          hint="Edit"
          icon="edit"
          visible={(e) => {
            let isDeleted = e?.row?.data?.rawAppMetaData.deleted_at
              ? true
              : false;

            return !isDeleted;
          }}
          onClick={(e) => redirectToEditUser(e.row?.data.id)}
        />

        {/* Activate User */}
        <DataGridButton
          hint="Activate"
          icon="check"
          cssClass="!text-green-500"
          visible={(e) => {
            let isDeleted = e?.row?.data?.rawAppMetaData.deleted_at
              ? true
              : false;

            return isDeleted;
          }}
          onClick={(e) => {
            modals.open({
              id: `activate-user-${e.row?.data.id}`,
              title: "Activate User",
              centered: true,
              children: (
                <>
                  <Text size="sm">Are you sure to activate this user?</Text>

                  <form action={activateUserAction} className="mt-8">
                    <input type="hidden" name="userId" value={e.row?.data.id} />

                    <div className="flex gap-2">
                      <Button
                        variant="default"
                        color="gray"
                        onClick={() =>
                          modals.close(`delete-user-${e.row?.data.id}`)
                        }
                      >
                        Cancel
                      </Button>
                      <SubmitButton text="Activate" color={"green"} />
                    </div>
                  </form>
                </>
              ),
            });
          }}
        />

        {/* Delete User */}
        <DataGridButton
          hint="Hapus"
          icon="trash"
          cssClass="!text-red-500"
          visible={(e) => {
            let isCurrentUser = e?.row?.data?.id === currentUserId;
            let isDeleted = e?.row?.data?.rawAppMetaData.deleted_at
              ? true
              : false;

            return isCurrentUser || isDeleted ? false : true;
          }}
          onClick={(e) => {
            modals.open({
              id: `delete-user-${e.row?.data.id}`,
              title: "Delete User",
              centered: true,
              children: (
                <>
                  <Text size="sm">Are you sure to delete this user?</Text>

                  <form action={deleteUserAction} className="mt-8">
                    <input type="hidden" name="userId" value={e.row?.data.id} />

                    <div className="flex gap-2">
                      <Button
                        variant="default"
                        color="gray"
                        onClick={() => modals.closeAll()}
                      >
                        Cancel
                      </Button>
                      <SubmitButton text="Delete" color={"red"} />
                    </div>
                  </form>
                </>
              ),
            });
          }}
        />
      </Column>
    </DataGrid>
  );
}
