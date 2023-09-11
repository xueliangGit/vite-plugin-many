/*
 * @Author: xuxueliang
 * @Date: 2023-08-30 15:43:31
 * @LastEditTime: 2023-09-11 15:14:42
 * @LastEditors: xuxueliang
 * @Description: 
 */
import fg from 'fast-glob'
import { resolve } from 'path';
export default function (pathReg: string) {
  const entries = fg.sync(resolve(process.cwd(), pathReg));
  return entries.reduce((a, v) => {
    let pathArray = v.split('/')
    pathArray.pop()
    a[pathArray.pop() as string] = v
    return a
  }, {} as Record<string, any>)
}