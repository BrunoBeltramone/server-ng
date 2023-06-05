const express = require("express");
const cors = require("cors");
const { EventEmitter } = require("events");

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const eventEmitter = new EventEmitter();

app.post("/", (req, res) => {
  const data = req.body;

  eventEmitter.emit("notification", data);

  res.sendStatus(200);
});

app.get("/sse", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("X-Accel-Buffering", "no");

  const sendSSE = (data) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  eventEmitter.on("notification", sendSSE);

  req.on("close", () => {
    eventEmitter.off("notification", sendSSE);
  });
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
