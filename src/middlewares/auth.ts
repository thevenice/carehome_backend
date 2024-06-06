import jwt from 'jsonwebtoken'

export default (roles: string[]) => {
  return (req: any, res: any, next: any) => {
    const authHeader = req.headers.authorization

    if (authHeader) {
      const token = authHeader.split(' ')[1]

      jwt.verify(
        token,
        `${process.env.JWT_TOKEN_SECRET}`,
        (err: any, user: any) => {
          if (err) {
            console.log(err)
            return res
              .status(401)
              .json({ success: false, message: 'Invalid token' })
          }

          if (roles.length > 0 && !roles.includes(user?.role as string)) {
            return res
              .status(403)
              .json({ success: false, message: 'Unauthorized' })
          }
          req.user = user
          next()
        },
      )
    } else {
      return res
        .status(401)
        .json({ success: false, message: 'Authorization token is missing' })
    }
  }
}
