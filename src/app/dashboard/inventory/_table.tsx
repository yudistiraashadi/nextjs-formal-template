"use client";

import { useMemo, useState } from "react";

import {
  MantineReactTable,
  useMantineReactTable,
  type MRT_ColumnDef,
  type MRT_ColumnFiltersState,
  type MRT_PaginationState,
  type MRT_SortingState,
  type MRT_ColumnFilterFnsState,
  MRT_ToggleGlobalFilterButton,
} from "mantine-react-table";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { InferSelectModel } from "drizzle-orm";
import { inventory } from "@/db/drizzle/schema";

import { getInventoryData } from "./_actions";
import {
  defaultNumberColumnFilter,
  defaultStringColumnFilter,
} from "@/utils/mantine-react-table";

type Inventory = InferSelectModel<typeof inventory>;

export function InventoryTable() {
  const columns = useMemo<MRT_ColumnDef<Inventory>[]>(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        columnFilterModeOptions: defaultNumberColumnFilter,
      },
      {
        accessorKey: "name",
        header: "Name",
        columnFilterModeOptions: defaultStringColumnFilter,
      },
      {
        accessorKey: "quantity",
        header: "Quantity",
        columnFilterModeOptions: defaultNumberColumnFilter,
      },
      {
        accessorKey: "price",
        header: "Price",
        columnFilterModeOptions: defaultNumberColumnFilter,
      },
    ],
    [],
  );

  //Manage MRT state that we want to pass to our API
  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>(
    [],
  );
  const [columnFilterFns, setColumnFilterFns] =
    useState<MRT_ColumnFilterFnsState>({
      id: "equals",
      name: "contains",
      quantity: "equals",
      price: "equals",
    });
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<MRT_SortingState>([]);
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  //call our custom react-query hook
  const inventory = useQuery({
    queryKey: [
      "inventory",
      { columnFilters, columnFilterFns, globalFilter, sorting, pagination },
    ],
    queryFn: () =>
      getInventoryData({
        columnFilters,
        columnFilterFns,
        globalFilter,
        sorting,
        pagination,
      }),
    placeholderData: keepPreviousData,
    staleTime: 300_000,
  });

  const table = useMantineReactTable({
    columns,
    data: inventory.data?.data ?? [],
    initialState: {
      showGlobalFilter: true,
      density: "xs",
    },
    state: {
      columnFilterFns,
      columnFilters,
      globalFilter,
      pagination,
      sorting,
      isLoading: inventory.isLoading,
      showAlertBanner: inventory.isError,
      showProgressBars: inventory.isLoading,
    },
    enableColumnFilterModes: true,
    enableHiding: false,
    manualFiltering: true,
    manualPagination: true,
    manualSorting: true,
    mantineToolbarAlertBannerProps: inventory.isError
      ? {
          color: "red",
          title: "Error",
          children: inventory.error?.message ?? "An error occurred.",
        }
      : undefined,
    renderToolbarInternalActions: ({ table }) => (
      <div className="flex gap-2">
        <MRT_ToggleGlobalFilterButton table={table} />
      </div>
    ),
    onColumnFilterFnsChange: setColumnFilterFns,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    rowCount: inventory.data?.meta.totalRowCount ?? 0,
  });

  return <MantineReactTable table={table} />;
}
