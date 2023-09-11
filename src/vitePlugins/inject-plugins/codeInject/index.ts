/*
 * @Author: xuxueliang
 * @Date: 2023-09-04 14:05:15
 * @LastEditTime: 2023-09-11 11:37:05
 * @LastEditors: xuxueliang
 * @Description: 
 */
import jsxCode from './jsx-code-inject'
export default function initHtmlPlugins(codeOptions: any, config: any) {
  let transformlist = [jsxCode(codeOptions, config)]
  const transform = async function (code: string, id: string) {
    let data = {
      code,
      map: null
    };
    for (const item of transformlist) {
      try {
        data = await item(data.code, id)
      } catch (e) {
        console.log(item.name, '处理失败')
      }
    }
    return data
  }
  return transform
}