/*
 * @Author: xuxueliang
 * @Date: 2023-08-31 11:31:30
 * @LastEditTime: 2023-09-11 13:55:24
 * @LastEditors: xuxueliang
 * @Description: 
 */
import { minify } from 'html-minifier'
export default function () {
  return {
    name: 'html-mini',
    transformIndexHtml(html: string) {
      try {
        // replaceRule.forEach(({ source, target }) => {
        //   html = html.replace(
        //     new RegExp(source, 'g'),
        //     target,
        //   )
        // })
        html = minify(html, { removeComments: true, collapseWhitespace: true, minifyCSS: true, minifyJS: true })
      } catch (err) {

      }
      return html
    },
  }
}