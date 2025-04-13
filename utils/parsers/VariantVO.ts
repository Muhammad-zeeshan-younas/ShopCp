// domain/ProductVariantVO.ts

import { AbstractVO } from "./AbsctractVO";
import { VariantOptionVO } from "./VariantOptionVO";

export class VariantVO extends AbstractVO {
  public readonly product_id?: number;
  public readonly name?: string;
  public readonly sku_suffix?: string;
  public readonly price_adjustment?: number;
  public readonly stock_quantity?: number;

  public readonly options?: VariantOptionVO[];

  constructor(data: any = {}) {
    super(data);
    this.product_id = data.product_id;
    this.name = data.name;
    this.sku_suffix = data.sku_suffix;
    this.price_adjustment = this.parseNumber(data.price_adjustment);
    this.stock_quantity = this.parseNumber(data.stock_quantity);

    this.options = this.parseInstances(data.options, VariantOptionVO);
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

  protected parseNumber(value: any): number | undefined {
    if (value === undefined || value === null) return undefined;
    return Number(value);
  }
}
