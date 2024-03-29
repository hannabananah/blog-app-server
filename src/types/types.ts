// 게시판 내용 타입
export type Board = {
  id: string;
  thumbnail: string;
  author: string;
  createdAt: Date;
  updatedAt: Date | null;
  title: string;
  content: string;
};

// User 타입
export type User = {
  id: number;
  username: string;
  userid: string;
  password: string;
};

export type SafeBoard = Omit<Board, "createdAt" | "updatedAt"> & {
  createdAt: number;
  updatedAt: number | null;
  user: Omit<User, "id">;
};

// 게시판 리스트 타입
export type SafeBoards = SafeBoard[];

// 상태타입
export type Status = {
  status: "success" | "error";
  message: string;
};

// 게시판 request, response타입
export interface ReqParams {
  id: string;
}

export interface ReqBody {
  title: string;
  content: string;
  username?: string;
}

export interface ResBody {}

export interface ReqQuery {}
