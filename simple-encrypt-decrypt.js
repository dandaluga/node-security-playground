// See the generate-keys-with-openssl.cmd to generate the private and public key pair.

var fs = require('fs');
var ursa = require('ursa');

var privateKey = ursa.createPrivateKey(fs.readFileSync('./keys/simple/private.key'));
var publicKey = ursa.createPublicKey(fs.readFileSync('./keys/simple/public.pub'));

var msg;
msg = publicKey.encrypt("Sealed content.", 'utf8', 'base64');
console.log('Encrypted with Public Key', msg, '\n');

msg = privateKey.decrypt(msg, 'base64', 'utf8');
console.log('Decrypted with Private Key', msg, '\n');

msg = privateKey.privateEncrypt("Sealed content.", 'utf8', 'base64');
console.log('Encrypted with Private Key', msg, '\n');

msg = publicKey.publicDecrypt(msg, 'base64', 'utf8');
console.log('Decrypted with Public Key', msg, '\n');


