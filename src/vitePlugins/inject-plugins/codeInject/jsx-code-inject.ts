/*
 * @Author: xuxueliang
 * @Date: 2023-09-04 14:05:15
 * @LastEditTime: 2023-09-11 14:07:00
 * @LastEditors: xuxueliang
 * @Description: 
 */
import { resolve } from 'path';
import ts from 'typescript';
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
      lastJsxFactoryPath = resolve(config.resolvedConfig.root, jsxFactoryPath)
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
  if (code.includes(jsxFactory || ' h(')) {
    code = `import ${jsxFactory} from  "${jsxFactoryPath}"
`+ code
  }
  return code;
}