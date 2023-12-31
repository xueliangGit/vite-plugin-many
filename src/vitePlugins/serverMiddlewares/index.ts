import { IncomingMessage, ServerResponse } from 'http';
import { PluginOption, Plugin, Connect } from 'vite';
type THandlerConfig =
  { url: RegExp, handler: Plugin['configureServer'] }

export default function serverMiddlewares({ middlewares }: {
  middlewares?: THandlerConfig[]
  handler?: Plugin['configureServer']
}): PluginOption {
  let urlConfig: { url: RegExp, handler: { (req: any, res: any): any } }[] = []
  if (middlewares) {
    urlConfig = middlewares.map(({ url, handler }) => {
      return {
        url: new RegExp(url),
        handler
      }
    })
  }
  return {
    name: 'many-plugins-serverMiddlewares',
    configureServer(server) {
      console.log(server.middlewares)
      if (urlConfig?.length) {
        server.middlewares.use(async (req, res, next) => {
          runHandler(urlConfig, req, res, next)
          // urlConfig?.forEach(({ url, handler }) => {
          //   if (url.test(req.url)) {
          //     handler(req, res, function () {
          //       next()
          //     })
          //   }
          // })
        })
      }
    },
  }
}
function runHandler(urlConfig: THandlerConfig[], req: Connect.IncomingMessage, res: ServerResponse<IncomingMessage>, next: Connect.NextFunction, i = 0) {
  if (urlConfig[i]) {
    const { url, handler } = urlConfig[i]
    if (url.test(req.url)) {
      handler(req, res, function () {
        next()
      })
    }
  }
}