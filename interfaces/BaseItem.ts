export interface BaseItem {
  itemId: string;
  variantId: string;
  size: string;
  quantity: number;
  price: number;
  bPrice: number; // Buying price
  name: string;
  thumbnail: string;
  discount?: number;
  weight?: number;
}

export interface OrderItem extends BaseItem {
  variantName: string;
  isComboItem?: boolean;
  comboId?: string;
  comboName?: string;
}
