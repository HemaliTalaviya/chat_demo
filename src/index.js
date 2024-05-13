var express = require('express');
const http = require('http');
var app = express();
const server = http.createServer(app);
const path = require('path');
const io = require('socket.io')(server);
app.use(express.json());

app.get('/',(req,res) =>{
  res.sendFile(path.join(__dirname, '../public/index.html'));
})
let users = [];
let userchats = [];

io.on('connection',(socket) =>{

  socket.on('SET_USER_NAME',name=>{
    users.push({userName:name,socketId:socket.id})
    io.emit('SET_USER_NAME',users)
  })
    console.log('user connected..' + socket.id)

    socket.on('SEND_MSG',(data) =>{
      
      userchats.push({userName:data.name,receiver:data.receiver,msg:data.message})
      console.log('msg receive===server',userchats);
      let index = users.findIndex((userObj) =>{return userObj.userName === data.name})
      // console.log(index);
      if(index !== -1){
        io.to(users[index].socketId).emit('SEND_MSG',data)
      }

      let index1 = users.findIndex((userObj) => {return userObj.userName === data.receiver})
      if(index1 !== -1){
        io.to(users[index1].socketId).emit('SEND_MSG',data)
      }
     
    })
    
    socket.on('GET_USER_CHAT',name=>{
      socket.emit('GET_USER_CHAT',userchats)
    })
})



const port = process.env.PORT || '3000';
server.listen(port,()=>{
  console.log("Server started on ",port);
});
