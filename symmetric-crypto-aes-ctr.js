// Use GCM for encryption only
// CTR’s security is dependent on choosing a unique initialization vector for each encryption. Do not hard code this.
// Use this method if you want to encrypt the payload and DON'T care to verify the sender.
// The key and the initialization vector must be shared between both sender and receiver.
// Read more here: https://nodejs.org/api/crypto.html#crypto_crypto

var crypto = require('crypto');

//var key = crypto.randomBytes(32);            // 256 bit shared secret (32 bytes x 8 bits = 256 bit)
var key = "bd31c1faa8d0e1f3156f6fc351e118e1fa7527582fe34365757ee8a4511305a9";
console.log("Key: " + key.toString('hex'));

var iv = crypto.randomBytes(16);               // Initialization vector: https://en.wikipedia.org/wiki/Initialization_vector
console.log("Initialization vector: " + iv.toString('hex'));

var algorithm = 'aes-256-ctr';                 // Cypher algorithm

function encrypt(text) {
    var cipher = crypto.createCipher(algorithm, key, iv);
    var encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    //console.log("Encrypted: " + encrypted);
    return encrypted;
}

function decrypt(encrypted) {
    var decipher = crypto.createDecipher(algorithm, key, iv);
    var decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    //console.log("Decrypted: " + decrypted);
    return decrypted;
}

var payload = encrypt("The encrypted payload here");
console.log(decrypt(payload));
