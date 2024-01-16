import express from "express";

import boardsController from "../controllers/boards.controller";
import { asyncHandler } from "../middleware/asyncHandler";

const router = express.Router();

// 게시판 목록
router.get("/", asyncHandler(boardsController.list));

// 게시판 상세
router.get("/:id", asyncHandler(boardsController.read));

// 게시판 등록
router.post("/", asyncHandler(boardsController.create));

// 게시판 수정
router.put("/:id", asyncHandler(boardsController.update));

// 게시판 삭제
router.delete("/:id", asyncHandler(boardsController.remove));

export default router;
