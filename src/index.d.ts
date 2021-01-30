/**
 * Webpack Plugin for inject some information in js / html
 * @author 余聪
 */

type TInfo = any | ((compilation: any) => any | Promise<any>)

declare class injectInfoPlugin {
  // @ts-ignore
  constructor(private info: TInfo, public name?: string) {}
}

export = injectInfoPlugin
