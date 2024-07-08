import { Application } from "express";
import * as fs from "fs"
import * as path from "path"
const { INFO } = require("../common/util/logger")

module.exports = (app: Application) => {

    async function scan(root: string, dir: string) {
        const files = fs.readdirSync(path.join(`${__dirname}/.././${root}`, dir) )
        for (const file of files) {
            const stat = fs.lstatSync(path.join(`${__dirname}/.././${root}`, dir, file) )
           
            if (stat.isDirectory() ) {
                scan(root, path.join(dir, file) )
            } else {
                let routes =  require(path.join(`${__dirname}/.././${root}`, dir, file) )
                INFO(`Loaded routes: ${file.split(".")[0]}`)
               routes(app)
            }
        }
    }
    
    scan("api", "routes")

}