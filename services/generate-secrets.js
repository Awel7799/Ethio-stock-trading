// generate-secrets.js
const crypto = require('crypto');

console.log('🔐 Generating JWT Secrets...\n');

// Generate 64-byte random secrets (very secure)
const jwtSecret = crypto.randomBytes(64).toString('hex');
const jwtRefreshSecret = crypto.randomBytes(64).toString('hex');

console.log('Copy these to your .env file:\n');
console.log(`JWT_SECRET=${jwtSecret}`);
console.log(`JWT_REFRESH_SECRET=${jwtRefreshSecret}`);

console.log('\n✅ Secrets generated successfully!');
console.log('⚠️  Keep these secrets safe and never share them!');