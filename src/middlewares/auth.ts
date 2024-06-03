import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest } from '../types/types'; // Import the custom type

const authenticateJWT = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
      const token = authHeader.split(' ')[1];

      jwt.verify(token, process.env.JWT_TOKEN_SECRET as string, (err:any, user:any) => {
        if (err) {
          console.log(err);
          return res.status(401).json({ success: false, message: 'Invalid token' });
        }
        
        (req as AuthenticatedRequest).user = user as AuthenticatedRequest['user']; // Cast to AuthenticatedRequest
        next();
      });
    } else {
      return res.status(401).json({ success: false, message: 'Authorization token is missing' });
    }
  };
};

export default authenticateJWT;