"use server";

import { createDrizzleConnection } from "@/db/drizzle/connection";
import { inventory } from "@/db/drizzle/schema";
import {
  and,
  or,
  ilike,
  sql,
  getTableColumns,
  eq,
  ne,
  gt,
  lt,
  gte,
  lte,
  isNull,
  isNotNull,
  desc,
  asc,
} from "drizzle-orm";

import {
  type MRT_ColumnFiltersState,
  type MRT_PaginationState,
  type MRT_SortingState,
  type MRT_ColumnFilterFnsState,
} from "mantine-react-table";

const inventoryColumn = getTableColumns(inventory);
type InventoryColumnKey = keyof typeof inventoryColumn;

const columnFilterSqlMap: {
  [key: string]: (column: InventoryColumnKey, value: any) => any;
} = {
  contains: (id, value) => ilike(inventory[id], `%${value}%`),
  startsWith: (id, value) => ilike(inventory[id], `${value}%`),
  endsWith: (id, value) => ilike(inventory[id], `%${value}`),
  equals: (id, value) => eq(inventory[id], value),
  notEquals: (id, value) => ne(inventory[id], value),
  between: (id, value) =>
    and(gt(inventory[id], value[0]), lt(inventory[id], value[1])),
  betweenInclusive: (id, value) =>
    and(gte(inventory[id], value[0]), lte(inventory[id], value[1])),
  greaterThan: (id, value) => gt(inventory[id], value),
  greaterThanOrEqualTo: (id, value) => gte(inventory[id], value),
  lessThan: (id, value) => lt(inventory[id], value),
  lessThanOrEqualTo: (id, value) => lte(inventory[id], value),
  empty: (id, value) => isNull(inventory[id]),
  notEmpty: (id, value) => isNotNull(inventory[id]),
};

export async function getInventoryData({
  columnFilters,
  columnFilterFns,
  globalFilter,
  sorting,
  pagination,
}: {
  columnFilters: MRT_ColumnFiltersState;
  columnFilterFns: MRT_ColumnFilterFnsState;
  globalFilter: string;
  sorting: MRT_SortingState;
  pagination: MRT_PaginationState;
}) {
  const db = createDrizzleConnection();

  const columnFilterSql =
    columnFilters.length > 0
      ? and(
          ...columnFilters.map((filter) =>
            columnFilterSqlMap[columnFilterFns[filter.id]](
              filter.id as InventoryColumnKey,
              filter.value,
            ),
          ),
        )
      : undefined;

  const globalFilterSql = globalFilter
    ? or(
        ilike(inventory.name, `%${globalFilter}%`),
        sql`CAST(${inventory.quantity} AS TEXT) ILIKE ${`%${globalFilter}%`}`,
        sql`CAST(${inventory.price} AS TEXT) ILIKE ${`%${globalFilter}%`}`,
      )
    : undefined;

  const sortingFilterSql =
    sorting.length > 0
      ? sorting.map((sort) => {
          return sort.desc
            ? desc(inventory[sort.id as InventoryColumnKey])
            : asc(inventory[sort.id as InventoryColumnKey]);
        })
      : [asc(inventory.id)];

  const [inventoryData, approximateCount] = await Promise.all([
    db
      .select()
      .from(inventory)
      .where(
        globalFilterSql
          ? and(globalFilterSql, columnFilterSql)
          : columnFilterSql,
      )
      .orderBy(...sortingFilterSql)
      .limit(pagination.pageSize)
      .offset(pagination.pageIndex * pagination.pageSize),
    db
      .execute(
        sql`SELECT (
              CASE WHEN c.reltuples < 0 THEN NULL
                   WHEN c.relpages = 0 THEN float8 '0' 
                   ELSE c.reltuples / c.relpages END
              * (pg_catalog.pg_relation_size(c.oid)
              / pg_catalog.current_setting('block_size')::int)
            )::bigint as approximate_row_count
            FROM   pg_catalog.pg_class c
            WHERE  c.oid = 'public.inventory'::regclass`,
      )
      .then((result) => result[0].approximate_row_count as number),
  ]);

  return {
    data: inventoryData,
    meta: {
      totalRowCount: approximateCount,
    },
  };
}
