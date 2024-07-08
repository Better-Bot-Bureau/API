import { Socket } from "socket.io";

module.exports = {
    name: "test",
    once: true,
    Callback: async (args: any, socket: Socket) => {
        console.log("test")    
    }
}