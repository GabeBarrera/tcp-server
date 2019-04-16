/**
 * --- CLIENT.JS ---
 * Author: Gabriel Barrera
 * Programming Assignment 1
 * CS 576, Prof. Wang
 * 
 * A client program that posts string data to a
 * server for encryption/decryption.
 * 
 * Instructions: 
 * - Run client with 'node client.js'
 * - Use 'UP/DOWN' arrow keys to highlight action
 *   + 'Encrypt' = encrypts a string
 *   + 'Decrypt' = decrypts a string
 *   + 'Quit' = closes connection & ends program
 * - Press 'ENTER/RETURN' key to select highlighted
 * - Type in string to be encrypted/decrypted
 * - New string cipher is returned
 * - Prompt is re-issued to user
 */

//Network and input dependecies
var input = require('input');
var net = require('net');
var HOST = '127.0.0.1';
var PORT = 8080;
var client = new net.Socket();

/**
 * -- ENCRYPTER --
 * Function to encrypt, decrypt, or quit the program 
 */
async function encrypter() {
    // Promt user for action
    const flags = ['Encrypt', 'Decrypt', 'Quit'];
    let choice = await input.select('Select action: ', flags);

    // Set flag to encrypt or decrypt as appropriate
    let f = (choice!="Decrypt") ? "e":"d";

    // On 'Quit', set flag to quit
    if (choice == "Quit") f = "q";

    // Collect data input and send to server, unless user quit
    if (f != 'q'){
        // Prompt for user input, Error on blank input
        const textInput = await input.text('Input: ', {
            validate(answer) {
                if (answer.length > 0) return true;
                return "ERROR: Must enter input";
            }
        });

        // Data is packaged with an encrypt/decrypt char-flag 'f'
        let data = [f,textInput];
        data = data.join('');

        // Post data to server
        let text = (f=='e') ? "ENCRYPTION":"DECRYPTION";
        console.log("Attempting DATA "+text+"...");
        client.write(data);
    }
    else client.destroy(); // On 'Quit', terminate server connection
}

/**
 * -- CONNECTION EVENT HANDLER --
 * Initialize connection to server and send data
 */
client.connect(PORT, HOST, function() {
    console.log('CONNECTED TO: ' + HOST + ':' + PORT);
    encrypter(); // Call encrypt/decrypt function
});

/**
 * -- DATA EVENT HANDLER --
 * Data sent from server to client socket routes here
 */
client.on('data', function(data) {
    console.log('RETURN DATA: ' + data +'\n'); // Show returned data
    encrypter(); // Continue encrypting/decrypting
});

/**
 * -- CLOSE EVENT HANDLER --
 * On client.destroy() notify user of connection termination
 */
client.on('close', function() {
    console.log('*** Connection Closed ***\n');
});

/**
 * -- ERROR EVENT HANDLER --
 * On client error, notify user of connection error
 */
client.on('error', function(err){
    console.log("\n*** CONNECTION REFUSED ***")
    console.log("Server connection errored with the following:");
    console.log(err);
})