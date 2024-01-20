import mongoose from "mongoose";
import { BoardSchema } from "./schemas/boards.schema";
import { Board } from "../types/types";

const BoardModel = mongoose.model<Board>("Board", BoardSchema);

export { BoardModel };
