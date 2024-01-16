import mongoose from "mongoose";
import { BoardSchema } from "./schemas/boards.schema";
import { Board } from "../types/types";

const BoardModal = mongoose.model<Board>("Board", BoardSchema);

export {
  BoardModal
}
