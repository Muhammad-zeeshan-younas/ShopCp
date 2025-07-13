// domain/ReviewVO.ts

import { AbstractVO } from "./AbsctractVO";
import { UserVO } from "./UserVO";

export class ReviewVO extends AbstractVO {
  public readonly user_id: number;
  public readonly product_id: number;
  public readonly rating?: number;
  public readonly comment: string;

  public readonly user?: UserVO;

  constructor(data: any = {}) {
    super(data);
    this.user_id = data.user_id;
    this.product_id = data.product_id;
    this.rating = this.parseNumber(data.rating);
    this.comment = data.comment;
  }

  // Getters
  get userId() {
    return this.user_id;
  }

  get productId() {
    return this.product_id;
  }

  protected parseNumber(value: any): number | undefined {
    if (value === undefined || value === null) return undefined;
    return Number(value);
  }
}
