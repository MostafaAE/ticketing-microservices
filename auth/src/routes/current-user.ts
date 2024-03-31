import express from "express";
import { currentUser } from "@mostatickets/common";

const router = express.Router();

router.get("/api/users/currentUser", currentUser, (req, res, next) => {
  res.send({ currentUser: req.currentUser || null });
});

export { router as currentUserRouter };
