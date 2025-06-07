import { VariantVO } from "./VariantVO";
import { ReviewVO } from "./ReviewVO";
import { AbstractVO } from "./AbsctractVO";

export class ProductVO extends AbstractVO {
  // Declared Properties
  public readonly name?: string;
  public readonly description?: string;
  public readonly rating?: number;
  public readonly discount_percentage?: number;
  public readonly discount_price?: number;
  public readonly category?: string;
  public readonly featured?: boolean;
  public readonly in_stock?: boolean;
  public readonly sku?: string;
  public readonly total_stock?: number; // Changed from boolean to number based on field name
  public readonly base_price?: number;
  public readonly is_new?: boolean;

  // Relations
  public readonly images?: string[];
  public readonly variants?: VariantVO[];
  public readonly reviews?: ReviewVO[];

  constructor(data: any = {}) {
    super(data);

    // Direct assignments
    this.is_new = data.is_new;
    this.name = data.name;
    this.description = data.description;
    this.category = data.category;
    this.sku = data.sku;
    this.images = data.images;
    this.featured = data.featured;
    this.in_stock = data.in_stock;

    // Parsed assignments
    this.rating = this.parseNumber(data.rating);
    this.discount_percentage = this.parseNumber(data.discount_percentage);
    this.discount_price = this.parseNumber(data.discount_price);
    this.total_stock = this.parseNumber(data.total_stock);
    this.base_price = this.parseNumber(data.base_price);

    // Relationship parsing
    this.variants = this.parseInstances(data.variants, VariantVO);
    this.reviews = this.parseInstances(data.reviews, ReviewVO);
  }

  // Computed Properties
  get finalPrice(): number | undefined {
    if (this.base_price === undefined) return undefined;
    if (this.discount_percentage) {
      return this.base_price * (1 - this.discount_percentage / 100);
    }
    return this.base_price;
  }

  get isNew(): boolean | undefined {
    return this.is_new;
  }

  get discountAmount(): number | undefined {
    if (this.base_price === undefined || !this.discount_percentage) return undefined;
    return this.base_price * (this.discount_percentage / 100);
  }

  // CamelCase Accessors
  get discountPercentage(): number | undefined {
    return this.discount_percentage;
  }

  get inStock(): boolean | undefined {
    return this.in_stock;
  }

  get basePrice(): number | undefined {
    return this.base_price;
  }
  get totalStock(): number | undefined {
    return this.total_stock;
  }

  // Protected parser (keep from parent)
  protected parseNumber(value: any): number | undefined {
    if (value === undefined || value === null) return undefined;
    return Number(value);
  }
}
