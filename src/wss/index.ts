import * as fs from "fs"
import * as path from "path"
import { Server } from "socket.io"

const { INFO } = require("../common/util/logger")

require("dotenv").config()


let events: {name: string, once: boolean, Callback: Function}[] = []
export let nodes: {socket_id: string, UUID: string, total_bots: number, bots: string[], usage: {cpu: number, ram: number}, stats: {uptime: number, timestamp: number, failed_heartbeats: number}}[] = []

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
        console.log("socket connected")
        if(socket.handshake.auth.secret !== process.env.AUTH_SECRET) socket.conn.close()

        if(socket.handshake.auth.type == "Slave") {
            socket.join("nodes")
            //Check if node with UUID exists in nodes list, if so set new socket_id, if false add new element
            let index = nodes.findIndex(o => o.UUID == socket.handshake.auth.UUID)
           
            if(index == -1) nodes.push({socket_id: socket.id, UUID: socket.handshake.auth.UUID, total_bots: 0, bots: [], usage: {cpu: 0, ram: 0}, stats: {uptime: 0, timestamp: 0, failed_heartbeats: 0} })
            else nodes[index].socket_id = socket.id
        }
        else if(socket.handshake.auth.type == "Bot") socket.join("bots")
        
        for(const event of events) {
            if(event.once) {
                socket.once(event.name, (args:any) => { event.Callback(args, socket, io) } )
            } else {
                socket.on(event.name, (args:any) => { event.Callback(args, socket, io) } )
            }
        }
    })

    //Hosting node heartbeat

    setInterval(async () => {
        io.to("nodes").emit("heartbeat")
        //console.log(await io.in("nodes").fetchSockets())
    }, 5000)
}

//exporting the nodes variable, dont ask me why im doing it twice it wouldnt work any other way
module.exports.nodes = nodes