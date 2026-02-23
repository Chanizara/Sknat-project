import { listProperties } from "@/lib/property-store";
import { type Property } from "@/types/property";

import AdminPropertiesClient from "./AdminPropertiesClient";

export const dynamic = "force-dynamic";

export default async function AdminPropertiesPage() {
  let properties: Property[] = [];
  try {
    properties = await listProperties();
  } catch (error) {
    console.error("Cannot load admin properties from MySQL:", error);
  }

  return <AdminPropertiesClient initialProperties={properties} />;
}
