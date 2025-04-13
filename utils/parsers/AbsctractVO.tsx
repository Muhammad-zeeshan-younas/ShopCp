import { Moment } from "moment-timezone";
import { RootVO } from "./RootVO";

export abstract class AbstractVO extends RootVO {
  public readonly id: number;
  public readonly created_at?: Moment;
  public readonly updated_at?: Moment;

  constructor(data: any) {
    super(data);
    this.id = data.id;
    this.created_at = this.parseDate(data.created_at);
    this.updated_at = this.parseDate(data.updated_at);
  }

  get createdAt() {
    return this.created_at;
  }

  get updatedAt() {
    return this.updated_at;
  }
}
