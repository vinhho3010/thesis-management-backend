import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';


@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor() {}

  use(req: Request, res: Response, next: NextFunction) {
    if(req.headers.authorization) {
    const token = req.headers.authorization.split(' ')[1];

    if (!token) {
      return res.status(403).json({ message: 'Không thể xác thực' });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    if (!decodedToken) {
      return res.status(403).json({ message: 'Token không hợp lệ' });
    }

    req['currentUser'] = decodedToken;
    next();
    
  } else {
    return res.status(403).json({ message: 'Không thể xác thực' });
  }
}
}