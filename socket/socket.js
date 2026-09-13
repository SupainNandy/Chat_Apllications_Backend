import http from 'http'
import express from 'express'
import { Server } from 'socket.io'
import { CLIENT_RENEG_LIMIT } from 'tls'
import { log } from 'console'

let app = express()
let server = http.createServer(app)

const io = new Server(server,{
    cors:{
        origin: process.env.CLIENT_URL || "http://localhost:5173",
        credentials:true
    }
})

export const userSocketMap = {}

export function getReceiverSocketId(userId){
    return userSocketMap[userId]
}

io.on("connection",(socket)=>{
    const userId=socket.handshake.query.userId
    if(userId != undefined && userId !== "undefined"){
        userSocketMap[userId] = socket.id
        
        console.log(userSocketMap)
    }

    io.emit("getOnlineUsers",Object.keys(userSocketMap))
    
    socket.on("disconnect",()=>{
        delete userSocketMap[userId]
        io.emit("getOnlineUsers",Object.keys(userSocketMap))
    })

})



export {app,server,io}

