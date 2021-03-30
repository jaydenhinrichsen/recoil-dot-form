export type PathImpl<T, Key extends keyof T, S extends string = '.'> =
Key extends string
? T[Key] extends Record<string, any>
  ? | `${Key}${S}${PathImpl<T[Key], Exclude<keyof T[Key], keyof any[]>> & string}`
    | `${Key}${S}${Exclude<keyof T[Key], keyof any[]> & string}`
  : never
: never;

export type PathImpl2<T, S extends string = '.'> = PathImpl<T, keyof T, S> | keyof T;

export type DotPath<T, S extends string = '.'> = PathImpl2<T> extends string | keyof T
  ? PathImpl2<T, S>
  : keyof T;

export type DotValue<T, P extends DotPath<T>, S extends string = '.'> =
P extends `${infer Key}${S}${infer Rest}`
? Key extends keyof T
  ? Rest extends DotPath<T[Key]>
    ? DotValue<T[Key], Rest>
    : never
  : never
: P extends keyof T
  ? T[P]
  : never;

export type AllFlat1<T> = {
  [K in DotPath<T> & string]: DotValue<T, K> extends object
    ? never
    : DotValue<T, K>;
};

export type AllFlat<T> = {
  [K in DotPath<T> & string]: DotValue<T, K> extends object[]
    ? Without<AllFlat1<DotValue<T, K>[number]>, never>[]
    : DotValue<T, K> extends object
    ? never
    : DotValue<T, K>;
};

export type Without<T, V, WithNevers = {
  [K in keyof T]: Exclude<T[K], undefined> extends V ? never
  : (T[K] extends Record<string, unknown> ? Without<T[K], V> : T[K])
}> = Pick<WithNevers, {
  [K in keyof WithNevers]: WithNevers[K] extends never ? never : K
}[keyof WithNevers]>;

export type Flat<T> = Without<AllFlat<T>, never>;
