import { resolve } from "path";

export function resolvePath(...arg: string[]) {
  return resolve(...arg)?.replace(/\\/g, '/')
}