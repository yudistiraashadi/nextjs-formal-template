import { type MRT_FilterOption } from "mantine-react-table";

export const defaultStringColumnFilter: MRT_FilterOption[] = [
  "contains",
  "startsWith",
  "endsWith",
  "equals",
  "empty",
  "notEmpty",
];

export const defaultNumberColumnFilter: MRT_FilterOption[] = [
  "equals",
  "greaterThan",
  "greaterThanOrEqualTo",
  "lessThan",
  "lessThanOrEqualTo",
  "between",
  "betweenInclusive",
  "empty",
  "notEmpty",
];
