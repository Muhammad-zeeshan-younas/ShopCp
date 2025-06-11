// domain/VariantVO.ts

import { AbstractVO } from "./AbsctractVO";

/** Payload shape coming from VariantBlueprint */
export interface VariantDTO {
  id: number;
  product_id: number;
  size: string;
  color: string;
  sku_suffix: string;
  price_adjustment: number | string;
  stock_quantity: number | string;
  created_at: string; // ISO-8601
  updated_at: string; // ISO-8601
  final_price: number | string;
  in_stock: boolean;
  low_stock: boolean;
}

export class VariantVO extends AbstractVO {
  /* ───────────────────────── Raw fields ───────────────────────── */
  readonly id!: number;
  readonly product_id!: number;
  readonly size!: string;
  readonly color!: string;
  readonly sku_suffix!: string;

  readonly price_adjustment!: number; // cents/units same as backend
  readonly stock_quantity!: number;

  /* ───────────────────────── Calculated fields ────────────────── */
  readonly final_price!: number;
  readonly in_stock!: boolean;
  readonly low_stock!: boolean;

  constructor(data: VariantDTO) {
    super(data);

    this.id = Number(data.id);
    this.product_id = Number(data.product_id);

    this.size = data.size;
    this.color = data.color;
    this.sku_suffix = data.sku_suffix;

    this.price_adjustment = this.toNumber(data.price_adjustment);
    this.stock_quantity = this.toNumber(data.stock_quantity);

    this.final_price = this.toNumber(data.final_price);
    this.in_stock = Boolean(data.in_stock);
    this.low_stock = Boolean(data.low_stock);
  }

  /* ───────────────────────── Getters / aliases ────────────────── */
  get productId() {
    return this.product_id;
  }
  get skuSuffix() {
    return this.sku_suffix;
  }
  get priceAdjustment() {
    return this.price_adjustment;
  }
  get stockQuantity() {
    return this.stock_quantity;
  }
  get finalPrice() {
    return this.final_price;
  }

  /** e.g. “42-XL-RED” */
  get fullSku(): string {
    return `${this.product_id}-${this.sku_suffix}`;
  }

  /* ───────────────────────── Helpers ──────────────────────────── */
  private toNumber(value: unknown): number {
    const n = Number(value);
    if (!Number.isFinite(n))
      throw new Error(`Expected numeric value, got ${value}`);
    return n;
  }
}
