import express from "express";
import { errorMiddlewares } from "./middlewares/errorMiddlewares.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// using routes
import userRoutes from "./routes/user.js";
app.use("/api/v1", userRoutes);

export default app;

app.use(errorMiddlewares);
