import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { db } from "../db";

export const authRouter = Router();

const JWT_SECRET = process.env.JWT_SECRET || "mysecret123";

authRouter.post("/register", async (req, res, next) => {
  try {
    const { email, password, name } = z
      .object({
        email: z.string().email(),
        password: z.string().min(6),
        name: z.string().min(1),
      })
      .parse(req.body);

    const exists = await db.user.findUnique({
      where: { email },
    });

    if (exists) {
      return res.status(400).json({
        error: "Email already used",
      });
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await db.user.create({
      data: {
        email,
        password: hash,
        name,
      },
    });

    const token = jwt.sign(
      { userId: user.id },
      JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (e) {
    next(e);
  }
});

authRouter.post("/login", async (req, res, next) => {
  try {
    const { email, password } = z
      .object({
        email: z.string().email(),
        password: z.string(),
      })
      .parse(req.body);

    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({
        error: "Invalid credentials",
      });
    }

    const validPassword = await bcrypt.compare(
      password,
      user.password
    );

    if (!validPassword) {
      return res.status(401).json({
        error: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      { userId: user.id },
      JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (e) {
    next(e);
  }
});