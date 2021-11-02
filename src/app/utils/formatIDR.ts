import { formatCurrency } from "@angular/common";

export function formatIDR(price: number) {
  return formatCurrency(price, 'id-ID', 'Rp', 'IDR', '1.0-0');
}