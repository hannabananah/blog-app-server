import { NextFunction, Request, Response } from "express";
import userDatabase from "../Database";
import jwt, { JwtPayload } from "jsonwebtoken";

interface TokenPayload extends JwtPayload {
  id: string;
  username: string;
  userid: string;
}

const { ACCESS_SECRET, REFRESH_SECRET } = process.env;
let acc: string = ACCESS_SECRET as string;
let ref: string = REFRESH_SECRET as string;

const login = (req: Request, res: Response, next: NextFunction) => {
  const { userid } = req.body;

  const data = userDatabase.filter((item) => {
    return item.userid === userid;
  })[0];
  console.log(data);

  if (!data) {
    res.status(403).json("Not Authorized");
  } else {
    try {
      // access token 발급
      const accessToken = jwt.sign(
        {
          id: data.id,
          username: data.username,
          userid: data.userid,
        },
        acc,
        { expiresIn: "1m", issuer: "Hannah" }
      );
      // refresh token 발급
      const refreshToken = jwt.sign(
        {
          id: data.id,
          username: data.username,
          userid: data.userid,
        },
        ref,
        { expiresIn: "24h", issuer: "Hannah" }
      );
      // token 전송
      res.cookie("accessToken", accessToken, {
        secure: false,
        httpOnly: true,
      });
      res.cookie("refreshToken", refreshToken, {
        secure: false,
        httpOnly: true,
      });

      res.status(200).json({ userid: data.userid, username: data.username });
    } catch (err) {
      res.status(500).json(err);
    }
  }
  next();
};

const signup = (req: Request, res: Response, next: NextFunction) => {
  const { userid, password, username } = req.body;

  const existingUser = userDatabase.find((item) => item.userid === userid);

  if (existingUser) {
    res.status(400).json("이미 존재하는 유저입니다.");
    return res;
  }

  const newUser = {
    id: userDatabase.length + 1,
    userid,
    password,
    username,
  };
  userDatabase.push(newUser);
  console.log("userDatabase", userDatabase);

  const accessToken = jwt.sign(
    {
      id: newUser.id,
      username: newUser.username,
      userid: newUser.userid,
    },
    acc,
    { expiresIn: "1m", issuer: "Hannah" }
  );
  const refreshToken = jwt.sign(
    {
      id: newUser.id,
      username: newUser.username,
      userid: newUser.userid,
    },
    ref,
    { expiresIn: "24h", issuer: "Hannah" }
  );

  res.cookie("accessToken", accessToken, {
    secure: false,
    httpOnly: true,
  });
  res.cookie("refreshToken", refreshToken, {
    secure: false,
    httpOnly: true,
  });

  res.status(201).json({ userid: newUser.userid, username: newUser.username });
};

const accessToken = async (req: Request, res: Response) => {
  try {
    const token = await req.cookies.accessToken;
    const data = jwt.verify(token, acc) as TokenPayload;

    const userData = userDatabase.filter((item) => {
      return item.userid === data.userid;
    })[0];
    const { password, ...others } = userData;

    res.status(200).json({ userid: data.userid, username: data.username });
  } catch (err) {
    res.status(500).json(err);
  }
};

const refreshToken = async (req: Request, res: Response) => {
  try {
    const token = await req.cookies.refreshToken;
    const data = jwt.verify(token, ref) as TokenPayload;
    const userData = userDatabase.filter((item) => {
      return item.userid === data.userid;
    })[0];

    const accessToken = jwt.sign(
      {
        id: userData.id,
        username: userData.username,
        userid: userData.userid,
      },
      acc,
      { expiresIn: "1m", issuer: "Hannah" }
    );
    res.cookie("accessToken", accessToken, {
      secure: false,
      httpOnly: true,
    });

    res.status(200).json("Access Token Recreated");
  } catch (err) {
    res.status(500).json(err);
  }
};
const loginSuccess = async (req: Request, res: Response) => {
  try {
    const token = await req.cookies.accessToken;
    const data = jwt.verify(token, ref) as TokenPayload;
    const userData = userDatabase.filter((item) => {
      return item.userid === data.userid;
    })[0];

    res.status(200).json({ userid: data.userid, username: data.username });
  } catch (err) {
    res.status(500).json(err);
  }
};
const logout = async (req: Request, res: Response) => {
  try {
    res.cookie("accessToken", "");
    res.status(200).json("Logout Success");
  } catch (err) {
    res.status(500).json(err);
  }
};

export default {
  login,
  signup,
  accessToken,
  refreshToken,
  loginSuccess,
  logout,
};
