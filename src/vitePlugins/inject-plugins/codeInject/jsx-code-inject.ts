/*
 * @Author: xuxueliang
 * @Date: 2023-09-04 14:05:15
 * @LastEditTime: 2025-01-07 16:03:39
 * @LastEditors: xuxueliang
 * @Description: 
 */
import ts from 'typescript';
import { resolvePath } from '../../../utils';
// 获取项目根目录
const projectRoot = process.cwd();
// 加载和解析 tsconfig 文件
const tsconfigPath = ts.findConfigFile(projectRoot, ts.sys.fileExists);
if (!tsconfigPath) {
  throw '需要再项目根目录增加tsconfig.json 配置'
}
const tsconfig = ts.readConfigFile(tsconfigPath!, ts.sys.readFile);
// 输出解析后的 tsconfig 配置
const compilerOptions = tsconfig.config.compilerOptions
const { jsxFactory } = compilerOptions
export default function initHtmlPlugins(htmlOptions: any, config: any) {
  let lastJsxFactoryPath: string
  let { jsxFactoryPath } = htmlOptions
  if (!jsxFactoryPath) {
    return (code: string) => ({ code, map: null })
  }
  const transform = async function (code: string, id: string) {
    if (!lastJsxFactoryPath) {
      lastJsxFactoryPath = resolvePath(config.resolvedConfig.root, jsxFactoryPath)
    }
    if (id.endsWith('.jsx') || id.endsWith('.tsx')) {
      code = injectJSXFactory(code, lastJsxFactoryPath);
    }
    return {
      code,
      map: null
    };
  }
  return transform
}
function injectJSXFactory(code: string, jsxFactoryPath: string) {
  // 自定义注入逻辑
  // 在这里根据需要修改或扩展 JSX 元素的转换代码
  const factory = jsxFactory || 'h';

  // 检查是否已经存在对该 factory 的 import
  // 匹配：
  // 1. import h from ...
  // 2. import { h } from ...
  // 3. import * as h from ...
  // 4. import { a, h, b } from ...
  const importRegex = new RegExp(`import\\s+([\\w\\s*{},]*\\b${factory}\\b[\\w\\s*{},]*)\\s+from`, 'm');

  if (code.includes(factory + '(') || (jsxFactory && code.includes(jsxFactory))) {
    if (!importRegex.test(code)) {
      code = `import ${factory} from  "${jsxFactoryPath}"
` + code
    }
  }
  return code;
}