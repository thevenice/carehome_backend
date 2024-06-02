import { NextFunction, Request, Response } from 'express'

export default (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log('===', req.body)
    let parsedBody = JSON.parse(req.body.data)
    if (typeof parsedBody === 'string') {
      parsedBody = JSON.parse(parsedBody)
    }
    req.body = { ...parsedBody }
  } catch (error: any) {
    console.log(error.message)
  }
  next()
}
