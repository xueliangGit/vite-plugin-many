import { IncomingMessage, ServerResponse } from 'http';
import { PluginOption, Connect } from 'vite';

type THandlerConfig =
  { url: RegExp | string, handler: Connect.NextHandleFunction }

export default function serverMiddlewares({ middlewares }: {
  middlewares?: THandlerConfig[]
  handler?: Connect.NextHandleFunction
}): PluginOption {
  let urlConfig: { url: RegExp, handler: Connect.NextHandleFunction }[] = []
  if (middlewares) {
    urlConfig = middlewares.map(({ url, handler }) => {
      return {
        url: url instanceof RegExp ? url : new RegExp(url),
        handler
      }
    })
  }
  return {
    name: 'many-plugins-serverMiddlewares',
    configureServer(server) {
      if (urlConfig?.length) {
        server.middlewares.use(async (req, res, next) => {
          runHandler(urlConfig, req, res, next)
        })
      }
    },
  }
}

function runHandler(urlConfig: { url: RegExp, handler: Connect.NextHandleFunction }[], req: Connect.IncomingMessage, res: ServerResponse<IncomingMessage>, next: Connect.NextFunction, i = 0) {
  if (urlConfig[i]) {
    const { url, handler } = urlConfig[i]
    if (url.test(req.url!)) {
      handler(req, res, function () {
        next()
      })
    }
  }
}