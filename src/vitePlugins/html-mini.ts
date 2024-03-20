/*
 * @Author: xuxueliang
 * @Date: 2023-08-31 11:31:30
 * @LastEditTime: 2024-02-22 14:32:31
 * @LastEditors: xuxueliang
 * @Description: 
 */
import { minify } from 'html-minifier'
export default function () {
  return {
    name: 'many-plugins:html-mini',
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