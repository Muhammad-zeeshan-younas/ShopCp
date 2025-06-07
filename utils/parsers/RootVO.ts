import moment, { Moment } from "moment-timezone";

moment.fn.toJSON = function () {
  const initial = (this as any)._i;
  if (initial && this.isSame(moment(initial))) {
    return initial;
  }
  return this.format();
};

export abstract class RootVO {
  constructor(data: unknown) {} // eslint-disable-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function

  /** Using valuePropName in case value is in the form of { *valuePropName*: {*actual object*} } */
  parseInstance<T>(value: unknown, className: new (data: unknown) => T, valuePropName?: string): T | undefined {
    if (!value) return undefined;
    if (valuePropName && (value as Record<string, unknown>)[valuePropName]) {
      return new className((value as Record<string, unknown>)[valuePropName]);
    }
    return new className(value);
  }

  /** Using valuePropName in case value is in the form of [{ *valuePropName*: {*actual object*} }, { *valuePropName*: {*actual object*} }] */
  parseInstances<T>(value: unknown[], className: new (data: unknown) => T, valuePropName?: string): T[] {
    return Array.isArray(value)
      ? value.map((item) =>
          valuePropName && (item as Record<string, unknown>)[valuePropName]
            ? new className((item as Record<string, unknown>)[valuePropName])
            : new className(item)
        )
      : [];
  }

  parseMultiTypeInstance<T>(item: unknown, map: Record<string, new (data: unknown) => T>): T | undefined {
    if (!item || typeof item !== "object") return undefined;

    const key = Object.keys(item)[0];
    const classConstructor = map[key];
    return classConstructor ? new classConstructor((item as Record<string, unknown>)[key]) : undefined;
  }

  parseMultiTypeInstances<T>(value: unknown[], map: Record<string, new (data: unknown) => T>, removeKey = false): T[] {
    return (
      value
        ?.map((item) => {
          if (typeof item !== "object") return undefined;
          const key = Object.keys(item)[0];
          const instance = this.parseMultiTypeInstance(item, map);

          return instance ? (removeKey ? instance : { [key]: instance }) : undefined;
        })
        .filter((item): item is T => !!item) || []
    );
  }

  isValueEmpty(value: unknown): boolean {
    return value === undefined || value === null;
  }

  parseDate(value: string | Date | undefined): Moment | undefined {
    return value ? moment(value) : undefined;
  }

  parseInt(value: unknown): number | undefined {
    return !this.isValueEmpty(value) ? parseInt(value as string, 10) : undefined;
  }

  parseFloat(value: unknown): number | undefined {
    return !this.isValueEmpty(value) ? parseFloat(value as string) : undefined;
  }

  parseDateOfBirthString(value: string | Date | undefined): string | undefined {
    return value ? moment(value).format("YYYY,MM,DD") : undefined;
  }

  parseMultiline(value: string | undefined): string | undefined {
    return value ? value.replace(/\u2028/g, "\n") : value;
  }

  parseBoolean(value: boolean | undefined, defaultValue = false): boolean {
    return typeof value === "boolean" ? value : defaultValue;
  }
}
