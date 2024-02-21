import express from "express";

import {
  getAllProjects,
  getProject,
  createProject,
  saveProject,
  deleteProject,
} from "../controllers/project.controller.js";

const router = express.Router();

router.get("/", getAllProjects);

router.delete("/:_id", deleteProject);

router.get("/:pid", getProject);

router.post("/:pid", saveProject);

router.post("/", createProject);

export default router;
