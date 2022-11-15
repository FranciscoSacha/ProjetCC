require('dotenv').config();
const express = require("express");
const cors = require("cors");
const Message = require("./db");
const server = express();

server.use(cors());
server.use(express.json());

const clients = [];

const convertMessage = ({ type, ...data }) => {
  return `event: ${type}\n` + `data: ${JSON.stringify(data)}\n\n`;
};

const broadcast = (message, client_id) => {
  if (clients[client_id]) {
    clients[client_id].write(convertMessage(message));
  }
};

const broadcastAll = (message) => {
  if (Object.values(clients).length > 0) {
    Object.values(clients).map((client) => {
      client.write(convertMessage(message));
    });
  }
};

server.get("/sse", async (req, res) => {
  try {
    const id = Date.now();
    clients[id] = res; 
    res.on("close", () => {
      delete clients[id];
    });
    const headers = {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    };
    res.writeHead(200, headers);
    const messages = await Message.find();
    broadcast({ type: "connect", id, messages }, id);
    } catch (err) {
    console.error(err);
    res.end();
  }
});

server.post("/messages", async (req, res) => {
  try {
    console.log("on es la" , req.body);
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ message: "no-content-send" });
    }
    const message = await Message.create({ content });
    broadcastAll({ type: "new-message", message });
} catch (err) {
    console.error(err);
    res.end();
  }
});

server.listen(3001, () => console.log("Server is listening on port 3001"));
