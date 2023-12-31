//@ts-ignore

import { Plu, Plugin_2, IncomingMessage, http, NextFunction } from "vite"
import querystring from "querystring"
function sleep(time: number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true)
    }, time)
  })
}
function getPostQueryData(req: IncomingMessage) {
  req.query = querystring.parse(req.url.split("?")[1])
  return new Promise((resolve) => {
    if (req.method === "POST") {
      let data = ""
      req.on("data", (chunk: string) => {
        data += chunk
      })
      req.on("end", () => {
        req.body = JSON.parse(data)
        resolve(true)
      })
    } else {
      resolve(true)
    }
  })
}
export type mockConfig = {
  url: string
  method?: string
  timeout?: number
  response: (req: IncomingMessage) => Promise<any> | any
}
export default function MockService({ mockStart = "/api", Mock = [] }: { mockStart: string, Mock: mockConfig[] } = { mockStart: "/api", Mock: [] }) {
  const mockS: any = {}
  if (!Mock.length) {
    return {
      name: "many-plugins-serverMiddlewares",
    }
  }
  Mock.forEach((v: mockConfig) => {
    mockS[(v.method || "GET").toLocaleUpperCase() + ":" + mockStart + v.url] = v
  })
  function server(server: Plugin_2['configureServer']) {
    server.middlewares.use(async (req: IncomingMessage, res: http.ServerResponse, next: NextFunction) => {
      const pathname = req.url?.split("?")[0]
      const name = req.method + ":" + pathname
      if (pathname.indexOf(mockStart) === 0) {
        if (mockS[name]) {
          try {
            const mock = mockS[name]
            if (mock.timeout) {
              await sleep(mock.timeout)
            }
            await getPostQueryData(req)
            res.setHeader("Content-Type", "application/json;chartset:UTF-8")
            const data = await mockS[name]?.response(req)
            if (data) {
              res.end(typeof data === "string" ? data : JSON.stringify(data))
            } else {
              next()
            }
          } catch (e) {
            next()
          }
        } else {
          res.end(JSON.stringify({ code: 404 }))
        }
      } else {
        next()
      }
    })
  }
  return {
    name: "many-plugins-serverMiddlewares",
    configurePreviewServer: server,
    configureServer: server
  }
}
