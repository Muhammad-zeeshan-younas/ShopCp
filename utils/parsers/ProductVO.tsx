// domain/ProductVO.ts
import { Moment } from "moment-timezone";
import { AbstractVO } from "./AbsctractVO";
import { VariantVO } from "./VariantVO";
import { ReviewVO } from "./ReviewVO";

export class ProductVO extends AbstractVO {
  public readonly name?: string;
  public readonly description?: string;
  public readonly price?: number;
  public readonly original_price?: number;
  public readonly discount_percentage?: number;
  public readonly stock_quantity?: number;
  public readonly category?: string;
  public readonly sku?: string;
  public readonly slug?: string;
  public readonly rating?: number;
  public readonly is_new?: boolean;
  public readonly is_top_seller?: boolean;
  public readonly is_discounted?: boolean;
  public readonly in_stock?: boolean;
  public readonly meta_title?: string;
  public readonly meta_description?: string;
  public readonly position?: number;
  public readonly weight?: number;
  public readonly weight_unit?: string;

  public readonly images?: string[];
  public readonly variants?: VariantVO[];
  public readonly reviews?: ReviewVO[];

  constructor(data: any = {}) {
    super(data);
    this.name = data.name;
    this.description = data.description;
    this.price = this.parseNumber(data.price);
    this.original_price = this.parseNumber(data.original_price);
    this.discount_percentage = this.parseNumber(data.discount_percentage);
    this.stock_quantity = this.parseNumber(data.stock_quantity);
    this.category = data.category;
    this.sku = data.sku;
    this.slug = data.slug;
    this.rating = this.parseNumber(data.rating);
    this.is_new = data.is_new;
    this.is_top_seller = data.is_top_seller;
    this.is_discounted = data.is_discounted;
    this.in_stock = data.in_stock;
    this.meta_title = data.meta_title;
    this.meta_description = data.meta_description;
    this.position = this.parseNumber(data.position);
    this.weight = this.parseNumber(data.weight);
    this.weight_unit = data.weight_unit;

    this.images = data.images;
    this.variants = this.parseInstances(data.variants, VariantVO);
    this.reviews = this.parseInstances(data.reviews, ReviewVO);
  }

  // Getters with camelCase naming
  get originalPrice() {
    return this.original_price;
  }

  get discountPercentage() {
    return this.discount_percentage;
  }

  get stockQuantity() {
    return this.stock_quantity;
  }

  get isNew() {
    return this.is_new;
  }

  get isTopSeller() {
    return this.is_top_seller;
  }

  get isDiscounted() {
    return this.is_discounted;
  }

  get inStock() {
    return this.in_stock;
  }

  get metaTitle() {
    return this.meta_title;
  }

  get metaDescription() {
    return this.meta_description;
  }

  // Computed properties
  get finalPrice() {
    if (this.is_discounted && this.original_price) {
      return this.price;
    }
    return this.price;
  }

  get discountAmount() {
    if (this.is_discounted && this.original_price) {
      return this.original_price - (this.price || 0);
    }
    return 0;
  }

  protected parseNumber(value: any): number | undefined {
    if (value === undefined || value === null) return undefined;
    return Number(value);
  }
}
