var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
var ursa = require('ursa');

// -------------------------------------------------------------------------------
// Setup
// -------------------------------------------------------------------------------

// Generate the private and public keys and persist the keys to disk.
var rootpath = './keys';
generatePrivateAndPublicKeys(rootpath, 'sender');
generatePrivateAndPublicKeys(rootpath, 'receiver');

// Get the private and public key of the sender.
var senderPrivateKey = ursa.createPrivateKey(fs.readFileSync(path.join(rootpath, 'sender', 'private.key')));
var senderPublicKey = ursa.createPublicKey(fs.readFileSync(path.join(rootpath, 'sender', 'public.pub')));

// Get the private and public key of the receiver.
var receiverPrivateKey = ursa.createPrivateKey(fs.readFileSync(path.join(rootpath, 'receiver', 'private.key')));
var receiverPublicKey = ursa.createPublicKey(fs.readFileSync(path.join(rootpath, 'receiver', 'public.pub')));

// -------------------------------------------------------------------------------
// Sender encrypts and signs content.
// -------------------------------------------------------------------------------

// Create a JSON message and then convert to a string.
var msg = { 'city':'Chicago', 'team':'Cubs', 'abbreviate':'CHN' };
msg = JSON.stringify(msg);

// Encrypt with receiver public key and sign with sender private key
var encrypted = receiverPublicKey.encrypt(msg, 'utf8', 'base64');
var signed = senderPrivateKey.hashAndSign('sha256', encrypted, 'utf8', 'base64');

// -------------------------------------------------------------------------------
// Receiver verifies signature and decrypts content.
// -------------------------------------------------------------------------------

// Verify message with sender private key
var bufferedMessage = new Buffer(encrypted);

var isSignatureValid = senderPublicKey.hashAndVerify('sha256', bufferedMessage, signed, 'base64');

if (!isSignatureValid){
    throw new Error("Invalid signature!!!");
} else {
    // Decrypt message with receiver private key
    var decryptedMessage = receiverPrivateKey.decrypt(encrypted, 'base64', 'utf8');
    console.log('Decrypted message content:', decryptedMessage);
}

// Generate a private and public key and write it to the file system.
function generatePrivateAndPublicKeys(rootpath, subpath){
    try {
        mkdirp.sync(path.join(rootpath, subpath));
    } catch (err) {
        console.error(err);
    }

    var key = ursa.generatePrivateKey(1024, 65537);
    var privatePem = key.toPrivatePem();
    var publicPem = key.toPublicPem();

    try {
        fs.writeFileSync(path.join(rootpath, subpath, 'private.key'), privatePem, 'ascii');
        fs.writeFileSync(path.join(rootpath, subpath, 'public.pub'), publicPem, 'ascii');
    } catch (err) {
        console.error(err);
    }
}