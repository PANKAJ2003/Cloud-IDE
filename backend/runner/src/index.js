import express from "express";
import http from "http";
import { initWs } from "./ws.js";
import TerminalManager from "./pty.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const httpServer = new http.createServer(app);

initWs(httpServer);

httpServer.listen(9000, () => {
    console.log(`listening on port 9000`);
})

