var logging = false
var express = require("express");
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var cookieParser = require('cookie-parser')
const uuidv4 = require('uuid/v4');
const PORT = process.env.PORT || 5000
server.listen(PORT);
app.use(cookieParser())
app.use(express.static('public'))
//app.use(express.static('private'))
/*
app.get('/list', function (req, res) {
    res.sendFile(__dirname + '/list.html');
});
*/
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.min.html');
});
var listmap = {}
//var strmap = {}
io.on('connection', function (socket) {
    var uuid = ''
    socket.emit('welcome', { desc: 'Hello World' });
    socket.on('require', function (data) {
        if(logging){console.log(data)}
        uuid = data.uuid
        if(uuid === ''){
            uuid = uuidv4()
        }
        socket.join(uuid)
        /*
        if(!(uuid in listmap)){
            listmap[uuid] = ["Hello World"]
        }
        socket.emit('data', { uuid: uuid, strarr: listmap[uuid]});
        */
        socket.emit('data', { uuid: uuid, strarr: []});
        if(data.ask){
            socket.to(uuid).emit('ask', null)
        }
    });
    /*
    socket.on('save', function (data) {
        console.log(data)
        listmap[data.uuid][data.n] = data.str
    })
    socket.on('resize', function (data) {
        console.log(data)
        var strarr = listmap[data.uuid]
        while(data.len>strarr.length){
            strarr.push('')
        }
        while(data.len<strarr.length){
            strarr.pop()
        }
        listmap[data.uuid] = strarr
    })
    */
    socket.on('clipboard', function (data) {
        if(logging){console.log(data)}
        if(uuid != ''){
            socket.to(uuid).emit('clipboard',data)
        }
    })
});