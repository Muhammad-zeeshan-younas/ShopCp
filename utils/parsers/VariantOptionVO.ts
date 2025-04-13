import { AbstractVO } from "./AbsctractVO";

export class VariantOptionVO extends AbstractVO {
  public readonly variant_id?: number;
  public readonly option_type?: string;
  public readonly value?: string;

  constructor(data: any = {}) {
    super(data);
    this.variant_id = data.variant_id;
    this.option_type = data.option_type;
    this.value = data.value;
  }

  // Getters
  get variantId() {
    return this.variant_id;
  }

  get optionType() {
    return this.option_type;
  }
}
