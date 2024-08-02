/*
 * @Author: xuxueliang
 * @Date: 2023-08-30 15:43:31
 * @LastEditTime: 2024-08-02 11:05:10
 * @LastEditors: xuxueliang
 * @Description: 
 */
import fg from 'fast-glob'
import { resolvePath } from '../utils/index';
export default function (pathReg: string) {
  const entries = fg.sync(resolvePath(process.cwd(), pathReg));
  return entries.reduce((a, v) => {
    let pathArray = v.split('/')
    pathArray.pop()
    a[pathArray.pop() as string] = v
    return a
  }, {} as Record<string, any>)
}