import { Application } from "express";
const testMiddleware = require("../middleware/test")
const testController = require("../controllers/test")


module.exports = (app: Application) => {

    app.get("/", [testMiddleware], testController.test)

}