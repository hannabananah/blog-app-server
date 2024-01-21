import { Schema } from "mongoose";
import { Board } from "../../types/types";

const BoardSchema = new Schema<Board>({
  thumbnail: {
    type: String,
    default: "https://picsum.photos/600",
  },
  author: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: null,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
});

export { BoardSchema };
