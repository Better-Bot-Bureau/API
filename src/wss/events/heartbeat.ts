import { Socket } from "socket.io";
import { nodes } from "../index"
import type { Heartbeat } from "../../types/returnTypes";
module.exports = {
    name: "heartbeat",
    once: false,
    Callback: async (args: Heartbeat, socket: Socket) => {
    console.log("heartbeat")
        let index = nodes.findIndex(o => o.UUID == socket.handshake.auth.UUID)
        nodes[index].stats.timestamp = args.timestamp
        nodes[index].stats.uptime = args.uptime
        nodes[index].stats.failed_heartbeats = 0
        nodes[index].usage.cpu = args.cpu
        nodes[index].usage.ram = args.mem
        nodes[index].total_bots = args.total_bots
        nodes[index].bots = args.bots
     
  
    }
}