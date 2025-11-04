declare module 'jsonwebtoken' {
  export function sign(
    payload: any,
    secretOrPrivateKey: string,
    options?: Record<string, any>,
  ): string
}
