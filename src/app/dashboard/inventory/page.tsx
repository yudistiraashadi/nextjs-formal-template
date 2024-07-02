import { InventoryTable } from "./_table";

import { Container } from "@/components/container";

export default async function DataInventory() {
  return (
    <Container>
      <h2 className="mb-4 text-3xl font-semibold">Inventory</h2>

      {/* table */}
      <InventoryTable />
    </Container>
  );
}
