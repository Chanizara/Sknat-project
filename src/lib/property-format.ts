import { type Property } from "@/types/property";

export function formatPrice(value: number) {
  return `฿${value.toLocaleString("th-TH")}`;
}

export function formatUpdatedAt(value: string) {
  return new Date(value).toLocaleDateString("th-TH");
}

export function getDistrict(location: string) {
  return location.split(",")[0]?.trim() ?? location;
}

export function buildPriceLabel(property: Property) {
  if (property.type === "เช่า") {
    return `${formatPrice(property.price)}/เดือน`;
  }

  return formatPrice(property.price);
}
