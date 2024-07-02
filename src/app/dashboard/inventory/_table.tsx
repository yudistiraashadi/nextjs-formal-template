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
  MRT_GlobalFilterTextInput,
  MRT_ToggleDensePaddingButton,
  MRT_ToggleFiltersButton,
  MRT_ShowHideColumnsButton,
  MRT_ToggleGlobalFilterButton,
} from "mantine-react-table";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { InferSelectModel } from "drizzle-orm";
import { inventory } from "@/db/drizzle/schema";

import { getInventoryData } from "./_actions";

type Inventory = InferSelectModel<typeof inventory>;

export function InventoryTable() {
  const columns = useMemo<MRT_ColumnDef<Inventory>[]>(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        columnFilterModeOptions: [
          "equals",
          "greaterThan",
          "greaterThanOrEqualTo",
          "lessThan",
          "lessThanOrEqualTo",
          "between",
          "betweenInclusive",
          "empty",
          "notEmpty",
        ],
      },
      {
        accessorKey: "name",
        header: "Name",
        columnFilterModeOptions: [
          "contains",
          "startsWith",
          "endsWith",
          "equals",
          "empty",
          "notEmpty",
        ],
      },
      {
        accessorKey: "quantity",
        header: "Quantity",
        columnFilterModeOptions: [
          "equals",
          "greaterThan",
          "greaterThanOrEqualTo",
          "lessThan",
          "lessThanOrEqualTo",
          "between",
          "betweenInclusive",
          "empty",
          "notEmpty",
        ],
      },
      {
        accessorKey: "price",
        header: "Price",
        columnFilterModeOptions: [
          "equals",
          "greaterThan",
          "greaterThanOrEqualTo",
          "lessThan",
          "lessThanOrEqualTo",
          "between",
          "betweenInclusive",
          "empty",
          "notEmpty",
        ],
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
    enableColumnFilterModes: true,
    initialState: {
      showColumnFilters: true,
      showGlobalFilter: true,
      density: "xs",
    },
    enableHiding: false,
    manualFiltering: true,
    manualPagination: true,
    manualSorting: true,
    mantineToolbarAlertBannerProps: inventory.isError
      ? {
          color: "red",
          children: "Error loading data",
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
    state: {
      columnFilterFns,
      columnFilters,
      globalFilter,
      isLoading: inventory.isLoading,
      pagination,
      showAlertBanner: inventory.isError,
      showProgressBars: inventory.isLoading,
      sorting,
    },
  });

  return <MantineReactTable table={table} />;
}
