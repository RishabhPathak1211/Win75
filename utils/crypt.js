const crypto = require('crypto');

const algorithm = 'aes-256-cbc';
const key = crypto.createHash('sha256').update(process.env.MESSAGE_SECRET).digest('base64').substr(0, 32);
const iv = crypto.randomBytes(16);

module.exports.encrypt = (content) => {
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
    let encrypted = cipher.update(content);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return { iv: iv.toString('hex'), content: encrypted.toString('hex') };
};

module.exports.decrypt = (content, _iv) => {
    const iv = Buffer.from(_iv, 'hex');
    const encryptedText = Buffer.from(content, 'hex');
    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
};