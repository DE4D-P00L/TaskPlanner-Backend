import "dotenv/config";
import express from "express";
import connectToDB from "./DB/connectToDB.js";
import userRoutes from "./routes/user.route.js";
import projectRoutes from "./routes/project.route.js";
import verifyJwt from "./middlewares/verifyJwt.js";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

const options = {
  origin: ["http://localhost:5173", "https://taskplanner-u50h.onrender.com"],
};

app.use(express.json());
app.use(cors(options));
app.use(express.urlencoded({ extended: false }));

app.use("/api/v1/user/", userRoutes);
app.use("/api/v1/project/", verifyJwt, projectRoutes);

app.listen(PORT, () => {
  connectToDB();
  console.log("Listening on port " + PORT);
});
