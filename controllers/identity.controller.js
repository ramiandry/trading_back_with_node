

const { User, Identity } = require("../models");

// Créer une nouvelle identité
const createIdentity = async (req, res) => {
  try {
    const { country_id, number_id, passport_id, user_id } = req.body;

    // Vérifiez que l'utilisateur existe
    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const identity = await Identity.create({ country_id, number_id, passport_id, user_id });
    res.status(201).json({ message: 'Identity created successfully.', identity });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating identity.', error });
  }
};

module.exports = {
    createIdentity,
};