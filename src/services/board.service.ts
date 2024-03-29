import { Types } from "mongoose";
import { BoardModel } from "../models";
import {
  Status,
  SafeBoard,
  ReqQuery,
  ReqParams,
  ReqBody,
} from "../types/types";
import CustomError from "../utils/CustomError";

const listBoards = async (query: ReqQuery) => {
  try {
    const items = await BoardModel.find({}).exec();
    return items.map((item) => {
      const data: SafeBoard = {
        ...item.toObject(),
        id: item._id.toString(),
        createdAt: item.createdAt.getTime(),
        updatedAt: item.updatedAt?.getTime() ?? null,
      };
      return data;
    });
  } catch (error) {
    if (error instanceof CustomError) {
      throw new CustomError(error.message, error.statusCode);
    }
  }
};

const readBoard = async (params: ReqParams) => {
  const { id } = params;
  try {
    if (!Types.ObjectId.isValid(id)) {
      throw new CustomError("유효하지 않은 아이디 형식 입니다.", 404);
    }

    const item = await BoardModel.findById(id).exec();
    if (item) {
      const data: SafeBoard = {
        ...item.toObject(),
        id: item._id.toString(),
        createdAt: item.toObject().createdAt.getTime(),
        updatedAt: item.toObject().updatedAt?.getTime() ?? null,
      };
      return data;
    }
  } catch (error) {
    if (error instanceof CustomError) {
      throw new CustomError(error.message, error.statusCode);
    }
  }
};

const createBoard = async (body: ReqBody) => {
  try {
    const { title, content, username } = body;
    console.log("title, content, username", title, content, username);

    if (!title || !content) {
      throw new CustomError("제목과 내용을 모두 입력해 주세요.", 400);
    }

    console.log("Before creating board model:", title, content, username);

    const boardModel = new BoardModel({
      title,
      content,
      username: username,
    });

    console.log("Before saving board model:", boardModel);

    const data = await boardModel.save();

    console.log("After saving board model:", data);

    if (!data) {
      throw new CustomError("게시글 작성에 실패했습니다.", 500);
    }

    const res: Status = { status: "success", message: "게시글 작성 성공!" };
    return res;
  } catch (error) {
    console.error("Error during board creation:", error);

    if (error instanceof CustomError) {
      throw error;
    } else {
      throw new CustomError("게시글 작성 중 에러가 발생했습니다.", 500);
    }
  }
};

const updateBoard = async (id: string, body: ReqBody) => {
  try {
    if (!Types.ObjectId.isValid(id)) {
      throw new CustomError("유효하지 않은 아이디 형식입니다.", 404);
    }

    const { title, content } = body;
    if (!title) throw new CustomError("제목을 입력해 주세요.", 400);
    if (!content) throw new CustomError("내용을 입력해 주세요.", 400);

    const res = await BoardModel.updateOne(
      { _id: id },
      { title, content, updatedAt: new Date() }
    );
    if (res.modifiedCount === 0) {
      throw new CustomError(
        "게시글을 찾을 수 없거나 업데이트되지 않았습니다.",
        404
      );
    }

    return { status: "success", message: "게시글 수정 성공!!!" };
  } catch (error) {
    if (error instanceof CustomError) {
      throw new CustomError(error.message, error.statusCode);
    }
  }
};

const deleteBoard = async (id: string) => {
  try {
    if (!Types.ObjectId.isValid(id)) {
      throw new CustomError("유효하지 않은 아이디 형식입니다.", 404);
    }

    const res = await BoardModel.findByIdAndDelete({ _id: id });
    if (!res) {
      throw new CustomError("삭제할 게시글이 존재하지 않습니다.", 400);
    }

    return { status: "success", message: "게시판 삭제 성공!!!" };
  } catch (error) {
    if (error instanceof CustomError) {
      throw new CustomError(error.message, error.statusCode);
    }
  }
};

export default {
  listBoards,
  readBoard,
  createBoard,
  updateBoard,
  deleteBoard,
};
