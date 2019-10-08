import { HttpError } from "../error";


class Thrower {
  conflictError(description?: string) {
    throw new HttpError(409, '请求冲突', description);
  }
  unauthorizedError(description?: string) {
    throw new HttpError(401, '未经授权的访问', description);
  }
  forbiddenError(description?: string) {
    throw new HttpError(403, '越界访问', description);
  }
  badRequestError(description?: string) {
    throw new HttpError(400, '请求发生错误', description);
  }
  notFoundError(description?: string) {
    throw new HttpError(404, '请求对象不存在', description);
  }
}

export const thrower = new Thrower();


