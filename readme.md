# vite 插件集合

## Inject 注入
  使用

  ```js
import { Inject } from 'vite-plugin-many'

 return defineConfig({
  pluins:[
     Inject({ //通过 出入
        html: {// html 注入
        /**
         * html 注入公共内容，例如loading等
         * 通过 file 读取文件内容 例如： 
         * <inject file="loading" />
         * 
         * 自动替换为loading.html的内容
         */
          file: {
            loading: 'commonHtml/loading.html',
            header: 'commonHtml/header.html',
          }
        },
        code: {
          /**
           * 增加自定义的jsx解析器 一般用不到，除非自主写jsx解析器
           * 使用jsx时，需要指定jsxFactory或者使用默认的例如h,
           * 
           * jsxFactoryPath 将在jsx或者tsx中指定jsxFactory的路径
           * 添加代码 `import ${jsxFactory} from  "${jsxFactoryPath}"`
           * */
          jsxFactoryPath: 'lib/renderTsx.ts'
        }
      })
    ]
  })
  ```
## HtmlMini html 压缩

压缩html

```js
import { HtmlMin } from 'vite-plugin-many'
return defineConfig({
  pluins:[HtmlMin()]
})

```
## HtmlInput vite 入口

自动获取html入口文件

```js
import { HtmlInput } from 'vite-plugin-many'

return defineConfig({
  build: {
      modulePreload: false,
      emptyOutDir: true,
      outDir: '../dist',
      assetsDir: mode + "/asstes",
      rollupOptions: {
        input: HtmlInput('./src/app/**/*.html'), // 获取app以下的html文件
      }
    }
  }
)

```

## mockServer 本地模拟数据

mockServer数据

```js

import { mockServer } from 'vite-plugin-many'
import { HtmlMin } from 'vite-plugin-many'
return defineConfig({
  pluins:[
    mockServer({
      mockStart : "/api", // 模拟数据前缀 例如 /api开头的
      Mock : [{
        url: string// 请求地址 /api/getLogin
        method?: string // 请求方式 GET POST
        timeout?: number // 超时时间
        response: (req: IncomingMessage) => Promise<any> | any // 响应数据
      }] 
  })
  ]
})

```
