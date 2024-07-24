// src/helpers/ResponseFormatter.ts
import { Response } from 'express';

class ResponseFormatter {
  static success(res: Response, data: any = null, message: string = 'Success', code: number = 200) {
    return res.status(code).json({
      meta: {
        code,
        status: 'success',
        message,
      },
      data,
    });
  }

  static error(res: Response, data: any = null, message: string = 'Error', code: number = 400) {
    return res.status(code).json({
      meta: {
        code,
        status: 'error',
        message,
      },
      data,
    });
  }
}

export default ResponseFormatter;
