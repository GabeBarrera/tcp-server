/**
 * --- SERVER.JS ---
 * Author: Gabriel Barrera
 * Programming Assignment 1
 * CS 576, Prof. Wang
 * 
 * A server program that returns encrypted/decrypted
 * strings to a client by increasing/decreasing the 
 * string's char by 1 ASCII value.
 * 
 * Instructions: 
 * - Run server with 'node server.js'
 * - Shut down with 'Ctrl+C'
 */

// Network Variables and Dependencies
var net = require('net');
var HOST = '127.0.0.1';
var PORT = 8080;

/**
 * -- CREATE SERVER --
 * Instantiates server and chains the listen function 
 * to it. The function sent to net.createServer 
 * becomes the event handler for the 'connection' 
 * event. The sock object the callback function receives 
 * is assigned unique ID's for each connection.
 */
net.createServer(function(sock) {
    
    // Connection is established.
    // Socket object assigned to connection automatically.
    let sockData = [sock.remoteAddress,sock.remotePort];
    console.log('\nCONNECTED: '+sockData[0]+':'+sockData[1]);
    
    // Data sent to server is handled here
    sock.on('data', function(inputData) {
        // Data is separated from encrypt/decrypt flag
        let inData = (inputData.toString()).split('');
        let flag = inData[0]; // Flag is stored here
        let data = inData.slice(1,inData.length); // String data
        let header = ["*** ENCRYPTING ***","*** DECRYPTING ***"];

        // Parse string, incrementing/decrementing char ASCII value
        console.log((flag=='e')?header[0]:header[1]);
        console.log('RECEIVED '+sockData[0]+': '+data.join(''));
        for (var i = 0; i < data.length; i++) {
            if (flag == 'e')
                data[i] = String.fromCharCode(data[i].charCodeAt()+1);
            else
                data[i] = String.fromCharCode(data[i].charCodeAt()-1);
        }
        data = data.join(''); // Build new encrypted/decrypted string

        sock.write('"'+data+'"'); // Server sends string back to socket for client  
        
        // Notfiy server of completed client task
        console.log('RETURNED '+sockData[0]+': '+data);
        console.log("****** DONE ******"); 
    });
    
    // When a client closes connection, it is logged here
    sock.on('close', function(data) {
        console.log('CLOSED: ' + sock.remoteAddress +' '+ sock.remotePort + '\n');
    });
    
}).listen(PORT, HOST);
console.log('Server listening on ' + HOST +':'+ PORT);