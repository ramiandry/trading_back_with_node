const express = require('express');
const router = express.Router();
const { createIdentity } = require('../controllers/identity.controller');

router.post('/create-identity', createIdentity); // Créer une identité

module.exports = router;
