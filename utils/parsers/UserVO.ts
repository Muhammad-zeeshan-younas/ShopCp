// domain/UserVO.ts

import { Moment } from "moment-timezone";
import { AbstractVO } from "./AbsctractVO";

export class UserVO extends AbstractVO {
  public readonly username?: string;
  public readonly email?: string;
  public readonly password?: string; // hashed password
  public readonly address?: string;
  public readonly phone?: string;
  public readonly avatar?: string;
  public readonly created_at?: Moment;
  public readonly updated_at?: Moment;

  constructor(data: any = {}) {
    super(data);
    this.username = data.username;
    this.email = data.email;
    this.address = data.address;
    this.phone = data.phone;
    this.avatar = data.avatar;
  }
}
