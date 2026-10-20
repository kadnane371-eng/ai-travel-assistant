import express from "express";
import morgan from "morgan";
import routes from "./routes/index.js";
import errorHandler from "./middlewares/error.middleware.js";
import { setupScalarDocs } from "./docs/scalar.js";

const app = express();

app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.json({
    name: "AI Travel Assistant API 🇲🇦",
    status: "online",
    version: "1.0.0",
    docs: "/docs",
    reference: "/reference",
    openapi: "/openapi.json",
  });
});

setupScalarDocs(app);

app.use("/api", routes);

app.use(errorHandler);

export default app;