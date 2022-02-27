const rateLimit = require('express-rate-limit'); // protection hack par force brute

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, 
	max: 50, 
	message: `limite d'essaie de connexion dépassée!`,
});

module.exports = limiter;