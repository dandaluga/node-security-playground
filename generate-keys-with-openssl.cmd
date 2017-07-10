// Generate the private key
openssl genrsa -out keys/simple/private.key 2048

// Generate the public key
openssl rsa -in keys/simple/private.key -pubout -out keys/simple/public.pub