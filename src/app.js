import express from "express";
import itemsRouter from "./routes/items.js";
import healthRouter from "./routes/health.js";

export function createApp() {
  const app = express();
  app.use(express.json());

  app.use("/health", healthRouter);
  app.use("/items", itemsRouter);

  app.use((req, res) => {
    res.status(404).json({ errors: ["not found"] });
  });

  return app;
}
