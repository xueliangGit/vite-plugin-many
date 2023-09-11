/*
 * @Author: xuxueliang
 * @Date: 2023-08-31 15:19:10
 * @LastEditTime: 2023-09-11 11:26:23
 * @LastEditors: xuxueliang
 * @Description: 
 */
import { Plugin, ResolvedConfig } from 'vite';
import initHtmlPlugins from './html-inject'
import initCodeInject from './codeInject'
const injectPlugin = (options: { html?: any, code?: any }) => {
  let config: any = { configResolved: {} }
  const configPlugins: { transformIndexHtml?: Plugin['transformIndexHtml'], transform?: Plugin['transform'] } = {}
  if (options.html) {
    configPlugins.transformIndexHtml = initHtmlPlugins(options.html, config)
  }
  if (options.code) {
    configPlugins.transform = initCodeInject(options.code, config)
  }
  return {
    name: 'inject-plugin',
    configOption: {},
    configResolved(resolvedConfig: ResolvedConfig) {
      config.resolvedConfig = resolvedConfig
    },
    ...configPlugins
  } as Plugin
}
export default injectPlugin