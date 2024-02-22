import mongoose from "mongoose";
import Project from "../models/Project.js";
import User from "../models/User.js";

export const getAllProjects = async (req, res) => {
  const { user } = req;
  try {
    const projects = await user.populate("projects");
    if (!projects) {
      res
        .status(500)
        .json({ message: "Internal Server Error", success: false });
    }
    res.status(200).json({ message: "All Projects", success: true, projects });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

export const getProject = async (req, res) => {
  const { pid } = req.params;
  try {
    const project = await Project.findById(pid);
    if (!project)
      return res
        .status(404)
        .json({ message: "Project not found", success: false });
    res.status(200).json({ message: "Project Found", success: true, project });
  } catch (error) {
    console.log(error.message);
    res
      .status(500)
      .json({ message: "Internal Server Error", success: false, error });
  }
};

export const saveProject = async (req, res) => {
  const { pid } = req.params;
  const { taskList } = req.body;
  try {
    const project = await Project.findByIdAndUpdate(
      pid,
      {
        taskList: [...taskList],
      },
      { new: true }
    );
    if (!project) {
      return res
        .status(500)
        .json({ message: "Cannot save Project, try again", success: false });
    }
    res.status(201).json({ message: "Project saved", success: true, project });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

export const deleteProject = async (req, res) => {
  const { _id } = req.params;
  const { user } = req;
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    await Project.findByIdAndDelete(_id, { session });

    await User.findByIdAndUpdate(
      user._id,
      {
        $pull: { projects: { _id } },
      },
      { session }
    );

    await session.commitTransaction();
    res.status(201).json({ message: "Project deleted", success: true });
  } catch (error) {
    console.log(error.message);
    await session.abortTransaction();
    res
      .status(500)
      .json({ message: "Internal Server Error", success: false, error });
  } finally {
    session.endSession();
  }
};

export const createProject = async (req, res) => {
  const { user } = req;
  const { projectName } = req.body;
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const project = new Project({ projectName, taskList: [] });

    await project.save({ session });
    user.projects.push(project._id);
    await user.save({ session });

    await session.commitTransaction();

    res
      .status(201)
      .json({ message: "Project created", success: true, project });
  } catch (error) {
    console.log(error.message);
    await session.abortTransaction();
    res
      .status(500)
      .json({ message: "Internal Server Error", success: false, error });
  } finally {
    session.endSession();
  }
};
