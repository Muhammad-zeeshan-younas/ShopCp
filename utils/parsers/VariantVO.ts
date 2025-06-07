// domain/ProductVariantVO.ts

import { AbstractVO } from "./AbsctractVO";
import { VariantOptionVO } from "./VariantOptionVO";

export class VariantVO extends AbstractVO {
  public readonly product_id?: number;
  public readonly name?: string;
  public readonly sku_suffix?: string;
  public readonly price_adjustment?: number;
  public readonly stock_quantity?: number;

  constructor(data: any = {}) {
    super(data);
    this.product_id = data.product_id;
    this.name = data.name;
    this.sku_suffix = data.sku_suffix;
    this.price_adjustment = this.parseInt(data.price_adjustment);
    this.stock_quantity = this.parseInt(data.stock_quantity);
  }

  // Getters
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

  // Computed properties
  get fullSku() {
    return `${this.productId}-${this.skuSuffix}`;
  }
}
