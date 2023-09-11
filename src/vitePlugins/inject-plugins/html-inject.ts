import fs from 'fs';
import { dirname, resolve } from 'path';


export default function initHtmlPlugins(htmlOptions: any, config: any) {
  const transformIndexHtml = async function (html: string, ctx: any) {
    const injectTags = html.match(/<inject\s+file="(.+?)"\s+(\/)?>(<\/inject>)?/g);
    if (injectTags) {
      for (const tag of injectTags) {
        const fileAttr = tag.match(/file="(.+?)"/);
        if (fileAttr && fileAttr[1]) {
          const attributes = getAttributes(tag);//获取标签上的所有属性
          // 检查是否为预设模式
          if (htmlOptions.file && typeof htmlOptions.file === 'object') {
            const presetFile = htmlOptions.file[fileAttr[1]];
            if (presetFile) {
              try {
                const fileContent = fs.readFileSync(resolve(config.resolvedConfig.root, presetFile), 'utf-8');
                const injectedContent = interpolate(fileContent, attributes);
                html = html.replace(tag, injectedContent);
                continue; // 跳过后续的流程
              } catch (error) {
                console.error(`Error reading preset file: ${presetFile}`, error);
                continue; // 跳过后续的流程
              }
            }
          }

          // 执行路径模式逻辑
          const filePath = resolve(dirname(ctx.filename), fileAttr[1]);
          try {
            const fileContent = fs.readFileSync(filePath, 'utf-8');
            const injectedContent = interpolate(fileContent, attributes);
            html = html.replace(tag, injectedContent);
          } catch (error) {
            console.error(`Error reading file: ${filePath}`, error);
          }
        }
      }
      return html;
    }
  }
  return transformIndexHtml
}
// 解析标签上的所有属性
function getAttributes(tag: string) {
  const attributePattern = /([\w-]+)="([^"]*)"/g;
  const attributes: Record<string, any> = {};
  let match: any;
  while ((match = attributePattern.exec(tag)) !== null) {
    const [, attributeName, attributeValue] = match;
    attributes[attributeName] = attributeValue;
  }
  return attributes;
}

// 插值替换注入内容中的变量
function interpolate(content: string, variables: Record<string, any>) {
  return content.replace(/\{#(.+?)}/g, (_, expression) => {
    let ori = "{#" + expression + "}";
    try {
      // 使用函数执行表达式
      const result = new Function('variables', `with (variables) { return ${expression}; }`)(variables);
      return result || ori || '';
    } catch (error) {
      console.error(`Error evaluating expression: ${expression}`);
      return ori;
    }
  });
}
