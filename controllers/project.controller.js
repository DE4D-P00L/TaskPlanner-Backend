import Project from "../models/Project.js";

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
    res.status(500).json({ message: "Internal Server Error", success: false });
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
  try {
    // TODO: Add mongoose session
    const project = await Project.findByIdAndDelete(_id, { new: true });
    if (!project) {
      return res
        .status(500)
        .json({ message: "Cannot delete Project, try again", success: false });
    }
    res.status(201).json({ message: "Project deleted", success: true });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

export const createProject = async (req, res) => {
  const { user } = req;
  const { projectName } = req.body;
  try {
    // TODO: Add mongoose transaction support
    const project = await Project.create({ projectName, taskList: [] });
    if (!project) {
      return res
        .status(500)
        .json({ message: "Internal Server Error", success: false });
    }

    user.projects.push(project);
    const userWithProjects = user.save();

    if (!userWithProjects) {
      return res
        .status(500)
        .json({ message: "Internal Server Error", success: false });
    }
    res
      .status(201)
      .json({ message: "Project created", success: true, project });
  } catch (error) {
    console.log(error.message);
  }
};
