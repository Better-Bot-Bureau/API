import * as fs from "fs"
import * as path from "path"
import { Server } from "socket.io"
const { INFO } = require("../common/util/logger")

let events: {name: string, once: boolean, Callback: Function}[] = []

module.exports = (io: Server) => {

    async function scan(root: string, dir: string) {
        const files = fs.readdirSync(path.join(`${__dirname}/.././${root}`, dir) )
        for (const file of files) {
            const stat = fs.lstatSync(path.join(`${__dirname}/.././${root}`, dir, file) )
           
            if (stat.isDirectory() ) {
                scan(root, path.join(dir, file) )
            } else {
                let event =  require(path.join(`${__dirname}/.././${root}`, dir, file) )
                INFO(`Loaded event: ${event.name}`)
                events.push(event)
            }
        }
    }
    
    (()=> {
        scan("wss", "events")
    })()


    io.on("connection", (socket) => {
        for(const event of events) {
            if(event.once) {
                socket.once(event.name, (args:any) => {event.Callback(args, socket, io) } )
            } else {
                socket.on(event.name, (args:any) => {event.Callback(args, socket, io) } )
            }
        }
    })
}
