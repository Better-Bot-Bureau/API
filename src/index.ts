import { Error } from "mongoose";
import express from "express"
import cookies from "cookie-parser"
import { createServer } from "http"
import { Server } from "socket.io"

const { SUCCESS, ERROR } = require("./common/util/logger")

require("dotenv").config()


const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, { /* Possible future options if needed */ })

// Use cookies
app.use(cookies())
// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));


// Connect to mongoDb
const db = require("./common/database");


// Socket.io server
require("./wss")(io)

// API
require("./api")(app)


// Listen to port
const PORT = process.env.PORT || 8081;

httpServer.listen(PORT, () => {
  SUCCESS(`Server is running on port ${PORT}.`);
});