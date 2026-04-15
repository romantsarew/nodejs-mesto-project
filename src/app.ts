import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import router from "./routes";
import { requestLogger, errorLogger } from "./middlewares/logger";
import errorHandler from "./middlewares/error-handler";

const { PORT = 3000 } = process.env;
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(requestLogger);

app.use(router);

app.use(errorLogger);
app.use(errorHandler);

mongoose
  .connect("mongodb://localhost:27017/mestodb")
  .then(() => {
    app.listen(PORT, () => {
      console.log(`App listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Ошибка подключения к MongoDB", err);
  });
