import app from "./app.js";
import dotenv from "dotenv";
import { connectdb } from "./config/database.js";
dotenv.config({
  path: "./config/config.env",
});
connectdb();

app.listen(process.env.PORT, () => {
  console.log(`Server is Working on port ${process.env.PORT}`);
});
