
var express = require('express');
var app = express();
var server  = require('http').createServer(app);
//var http = require('http').Server(app);

var io = require('socket.io').listen(server);
var idUsersConnected = [];
var connectedUsers = [];

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.get('/', function(request, response) {
   response.render('pages/index');
 });

io.on('connection', function (socket){      //Cuando un socket Cliente se conecta ejecuta esta funcion

    socket.on('inicio', function(email){
        console.log("Se conecto el usuario: "+ email);
        connectedUsers[email]=socket;
        socket.data=email;
    });
    socket.on('enviarNotificacion', function (datos){
        socket.emit('nuevaNotificacion', datos);
    });

    socket.on('nuevoInsert', function (datos) {      //Cuando MASTER EMITE 'nuevoInsert' ejecuta esta funcion
        var aux;
        datos.forEach(function (item) {
            console.log(item.idUsuario);
            if(arrayUsuariosConectados[item.idUsuario]!= null) {
                aux = arrayUsuariosConectados[item.idUsuario];
                aux.emit('newInsert');
                console.log('Se envio notificación al usuario: '+item.idUsuario);
            }
        });
    });

    socket.on('disconnect',function(){
        console.log('Se desconecto el usuario: '+socket.data);
            delete arrayUsuariosConectados[socket.data];
            arrayUsuariosConectados.forEach(function (itemArray) {
                console.log('Usuarios conectados: '+itemArray.data);
            });
    });
});
server.listen(app.get('port'), function () {         //Con esto se conecta al puerto 5000
    console.log('Server up at port 5000');
});
