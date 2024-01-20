import { NextFunction, Request, Response } from "express";
import userDatabase from "../Database";
import jwt, { JwtPayload } from "jsonwebtoken";

interface TokenPayload extends JwtPayload {
  id: string;
  username: string;
  email: string;
}

const { ACCESS_SECRET, REFRESH_SECRET } = process.env;
let acc: string = ACCESS_SECRET as string;
let ref: string = REFRESH_SECRET as string;

const login = (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;

  const userInfo = userDatabase.filter((item) => {
    return item.email === email;
  })[0];
  console.log(userInfo);

  if (!userInfo) {
    res.status(403).json("Not Authorized");
  } else {
    try {
      // access token 발급
      const accessToken = jwt.sign(
        {
          id: userInfo.id,
          username: userInfo.username,
          email: userInfo.email,
        },
        acc,
        { expiresIn: "1m", issuer: "Hannah" }
      );
      // refresh token 발급
      const refreshToken = jwt.sign(
        {
          id: userInfo.id,
          username: userInfo.username,
          email: userInfo.email,
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

      res.status(200).json({
        message: "login success",
        user: { email: userInfo.email, username: userInfo.username },
      });
    } catch (err) {
      res.status(500).json(err);
    }
  }
  next();
};

const accessToken = async (req: Request, res: Response) => {
  try {
    const token = await req.cookies.accessToken;
    const data = jwt.verify(token, acc) as TokenPayload;

    const userData = userDatabase.filter((item) => {
      return item.email === data.email;
    })[0];
    const { password, ...others } = userData;

    res.status(200).json({ email: data.email, username: data.username });
  } catch (err) {
    res.status(500).json(err);
  }
};

const refreshToken = async (req: Request, res: Response) => {
  try {
    const token = await req.cookies.refreshToken;
    const data = jwt.verify(token, ref) as TokenPayload;
    const userData = userDatabase.filter((item) => {
      return item.email === data.email;
    })[0];

    const accessToken = jwt.sign(
      {
        id: userData.id,
        username: userData.username,
        email: userData.email,
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
      return item.email === data.email;
    })[0];

    res.status(200).json({ email: data.email, username: data.username });
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
  accessToken,
  refreshToken,
  loginSuccess,
  logout,
};
