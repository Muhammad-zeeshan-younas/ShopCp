import moment, { Moment } from "moment-timezone";

// Extend Moment's type definition to include our custom toJSON
declare module "moment" {
  interface Moment {
    toJSON(): string;
  }
}

moment.fn.toJSON = function (this: Moment) {
  const initial = (this as any)._i;
  if (initial && this.isSame(moment(initial))) {
    return initial;
  }
  return this.format();
};

export abstract class RootVO {
  constructor(data: unknown) {}

  /** Using valuePropName in case value is in the form of { *valuePropName*: {*actual object*} } */
  parseInstance<T>(value: unknown, className: new (data: unknown) => T, valuePropName?: string): T | undefined {
    if (!value) return undefined;
    if (valuePropName && typeof value === "object" && value !== null && valuePropName in value) {
      return new className((value as Record<string, unknown>)[valuePropName]);
    }
    return new className(value);
  }

  /** Using valuePropName in case value is in the form of [{ *valuePropName*: {*actual object*} }, { *valuePropName*: {*actual object*} }] */
  parseInstances<T>(value: unknown[] | undefined, className: new (data: unknown) => T, valuePropName?: string): T[] {
    if (!Array.isArray(value)) return [];

    return value.map((item) =>
      valuePropName && typeof item === "object" && item !== null && valuePropName in item
        ? new className((item as Record<string, unknown>)[valuePropName])
        : new className(item)
    );
  }

  parseMultiTypeInstance<T>(item: unknown, map: Record<string, new (data: unknown) => T>): T | undefined {
    if (!item || typeof item !== "object" || item === null) return undefined;

    const entries = Object.entries(item);
    if (entries.length === 0) return undefined;

    const [key, value] = entries[0];
    const classConstructor = map[key];
    return classConstructor ? new classConstructor(value) : undefined;
  }

  parseMultiTypeInstances<T>(
    value: unknown[] | undefined,
    map: Record<string, new (data: unknown) => T>,
    removeKey = false
  ): (T | Record<string, T>)[] {
    if (!Array.isArray(value)) return [];

    return value
      .map((item) => {
        if (typeof item !== "object" || item === null) return undefined;

        const entries = Object.entries(item);
        if (entries.length === 0) return undefined;

        const [key, val] = entries[0];
        const classConstructor = map[key];
        if (!classConstructor) return undefined;

        const instance = new classConstructor(val);
        return removeKey ? instance : { [key]: instance };
      })
      .filter((item): item is T | Record<string, T> => item !== undefined);
  }

  isValueEmpty(value: unknown): value is null | undefined {
    return value === undefined || value === null;
  }

  parseDate(value: string | Date | undefined): Moment | undefined {
    return value ? moment(value) : undefined;
  }

  parseInt(value: unknown): number | undefined {
    return !this.isValueEmpty(value) ? Number.parseInt(String(value), 10) : undefined;
  }

  parseFloat(value: unknown): number | undefined {
    return !this.isValueEmpty(value) ? Number.parseFloat(String(value)) : undefined;
  }

  parseDateOfBirthString(value: string | Date | undefined): string | undefined {
    return value ? moment(value).format("YYYY,MM,DD") : undefined;
  }

  parseMultiline(value: string | undefined): string | undefined {
    return value ? value.replace(/\u2028/g, "\n") : value;
  }

  parseBoolean(value: boolean | unknown, defaultValue = false): boolean {
    return typeof value === "boolean" ? value : defaultValue;
  }
}
