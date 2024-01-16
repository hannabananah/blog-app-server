import { Request, Response, NextFunction } from "express";
import { ControllerFunction } from "../controllers/boards.controller";
import { ReqBody, ResBody, ReqParams, ReqQuery } from "../types/types";

const asyncHandler = (requestHandler: ControllerFunction) => {
  return async (
    req: Request<ReqParams, ResBody, ReqBody, ReqQuery>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      await requestHandler(req, res, next);
    } catch (error) {
      console.log(error)
      if (error instanceof Error) {
        console.error(error.message);
      }
      next(error);
    }
  };
};

export {
  asyncHandler
}