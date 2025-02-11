// controllers/user.controller.js
const dotenv = require("dotenv");
const tradelocker = require("@api/tradelocker"); // Assuming this is compatible with CommonJS
const { default: axios } = require("axios");
const bcrypt = require('bcryptjs'); // Importer le module bcryptjs pour hacher les mots de passe
const jwt = require('jsonwebtoken');
const { User } = require('../models'); // Importer le modèle User


dotenv.config(); // Load environment variables

// Authenticate with the TradeLocker API
tradelocker.auth(process.env.TRADELOCKER_API_KEY); // Use the API key from environment variables

const createUser = async (req, res) => {
  const { email, firstName, lastName, password } = req.body;

  // Log the incoming request for debugging
  console.log("Received request body:", req.body);

  try {
    // Call the TradeLocker API to create a user
    const response = await tradelocker.usersController_createUser({
      email,
      firstName,
      lastName,
      password,
    });

    // Log the response from the TradeLocker API
    console.log("TradeLocker API response:", response.data);

    // Return the response from TradeLocker API back to the frontend
    res.status(response.status).json(response.data);
  } catch (error) {
    // Enhanced error handling
    console.error("Error forwarding request:", error.message);
    res.status(500).json({
      message: error.data.message,
      error: error.status,
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    //const response = await tradelocker.usersController_getAllUsers({
      const response = await tradelocker.usersController_getUsersByBrandId({
      offset: req.query.offset || 0,
      limit: req.query.limit || 10,
    });

    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Error retrieving users:", error.message);
    res.status(500).json({
      message: error.data,
      error: error.status,
    });
  }
};

const setUserPassword = async (req, res) => {
  //const userId = req.params.id;
  const { password, userId} = req.body;

  try {
    const response = await tradelocker.usersController_setPassword({
      userId,
      password,
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Error setting password:", error.message);
    res.status(500).json({
      message: error
    });
  }
};

const setUserEmail = async (req, res) => {
  const userId = req.params.id;
  const { email } = req.body;

  try {
    const response = await tradelocker.usersController_setEmail({
      email,
      userId,
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Error setting email:", error.message);
    res.status(500).json({
      message: error.data.message,
      error: error.status,
    });
  }
};
const getUserByEmail = async (req, res) => {
  const { email } = req.body; // Assuming the email comes from the request body

  try {
    const response = await tradelocker.usersController_getUsersByEmail({
      email,
    });

    // Log and send the response from TradeLocker
    console.log("TradeLocker API response:", response.data);
    res.status(response.status).json(response.data);
  } catch (error) {
    // Handle any errors
    console.error("Error retrieving user by email:", error.message);
    res.status(500).json({
      message: error.data ? error.data.message : "Internal Server Error",
      error: error.status || 500,
    });
  }
};

const getUserDetails = async (req, res) => {
  const { email } = req.body; // Assuming the email is provided in the request body

  try {
    const response = await tradelocker.usersController_getUserDetails({
      email,
    });

    // Log the response from the TradeLocker API
    console.log("TradeLocker API response:", response.data);

    // Return the API response back to the client
    res.status(response.status).json(response.data);
  } catch (error) {
    // Enhanced error handling
    console.error("Error retrieving user details:", error.message);
    res.status(500).json({
      message: error.data ? error.data.message : "Internal Server Error",
      error: error.status || 500,
    });
  }
};


// Fonction pour obtenir un nouveau JWT depuis TradeLocker
const getJwtToken = async (req, res) => {
  const { email, password, server } = req.body;
  console.log("Received request body:", req.body);
  if (!email || !password ) {
      return res.status(400).json({ error: 'All fields are required: email, password, server.' });
  }

  try {
      const response = await axios.post(`https://demo.tradelocker.com/backend-api/auth/jwt/token`, {
          email,
          password,
          server:"OSP-DEMO"
      });

      const { accessToken, refreshToken } = response.data;

      res.status(201).json({
          message: 'Authentification success',
          accessToken,
          refreshToken,
          data: response.data,
      });
  } catch (error) {
      res.status(500).json({ error: error.response?.data || error.message });
  }
};


async function createUserDb(req, res) {
    const { avatar, UserName, firstname, lastname, email, password, is_admin, address, city, line_2, line_1, postalCode, country, province } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
   try {
        // Crée un nouvel utilisateur dans la base de données
        const newUser = await User.create({
            avatar,
            UserName,
            firstname,
            lastname,
            email,
            password: hashedPassword,
            is_admin,
            address,
            city,
            line_1,
            line_2,
            postalCode,
            country,
            province,
        });

        // Retourne une réponse avec l'utilisateur créé
        return res.status(201).json({
            message: 'Utilisateur créé avec succès',
            user: newUser,
        });
    } catch (error) {
        // Gérer les erreurs, y compris l'unicité de l'email
        return res.status(400).json({
            message: 'Erreur lors de la création de l\'utilisateur',
            error: error.message,
        });
    }
}

async function updateUserName(req, res) {
  const { id, firstname, lastname } = req.body;

  try {
      // Vérifie que l'ID est fourni
      if (!id) {
          return res.status(400).json({
              message: "ID est requis pour mettre à jour l'utilisateur."
          });
      }

      // Trouve l'utilisateur par ID
      const user = await User.findByPk(id);

      if (!user) {
          return res.status(404).json({
              message: "Utilisateur introuvable."
          });
      }

      // Met à jour le prénom et/ou le nom de famille
      if (firstname) user.firstname = firstname;
      if (lastname) user.lastname = lastname;

      // Enregistre les modifications dans la base de données
      await user.save();

      // Retourne la réponse avec les données mises à jour
      return res.status(200).json({
          message: "Utilisateur mis à jour avec succès.",
          user,
      });
  } catch (error) {
      // Gestion des erreurs
      return res.status(500).json({
          message: "Erreur lors de la mise à jour de l'utilisateur.",
          error: error.message,
      });
  }
}

async function updateUserAdress(req, res) {
  const { id, address, city, line_1, line_2, postal_code, country} = req.body;
  const province = req.body['region-select'];
  //console.log(province)

  try {
      // Vérifie que l'ID est fourni
      if (!id) {
          return res.status(400).json({
              message: "ID est requis pour mettre à jour l'utilisateur."
          });
      }

      // Trouve l'utilisateur par ID
      const user = await User.findByPk(id);

      if (!user) {
          return res.status(404).json({
              message: "Utilisateur introuvable."
          });
      }

      // Met à jour les champs spécifiés
      if (address) user.address = address;
      if (city) user.city = city;
      if (line_1) user.line_1 = line_1;
      if (line_2) user.line_2 = line_2;
      if (postal_code) user.postal_code = postal_code;
      if (country) user.country = country;
      if (province)console.log(province) ;

      // Enregistre les modifications dans la base de données
      await user.save();

      // Retourne la réponse avec les données mises à jour
      return res.status(200).json({
          message: "Utilisateur mis à jour avec succès.",
          user,
      });
  } catch (error) {
      // Gestion des erreurs
      return res.status(500).json({
          message: "Erreur lors de la mise à jour de l'utilisateur.",
          error: error.message,
      });
  }
}

async function findOneUser(req, res) {
  const { id } = req.params;

  try {
      // Crée un nouvel utilisateur dans la base de données
      const user = await User.findByPk(id);

      // Retourne une réponse avec l'utilisateur créé
      return res.status(201).json(user);
  } catch (error) {
      // Gérer les erreurs, y compris l'unicité de l'email
      return res.status(400).json({
          message: 'Erreur lors de la création de l\'utilisateur',
          error: error.message,
      });
  }
}

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Vérifiez si l'utilisateur existe
    const user = await User.findOne({ where: { email } }); // Correction de la requête Sequelize
    if (!user) {
      return res.status(400).json({ data: 'Invalid email or password' });
    }

    // Vérifiez le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ data: 'Invalid email or password' });
    }

    // Générer un token JWT
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.SECRET_KEY, {
      expiresIn: '24h', // Le token expirera dans 1 heure
    });

    res.status(200).json({
      message: 'Login successful',
      token,
      user: { id: user.id, email: user.email },
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message_serveur: 'Internal server error' });
  }
};

module.exports = { login };





// Protected route

module.exports = {
  createUser,
  getAllUsers,
  setUserPassword,
  setUserEmail,
  getUserByEmail,
  getUserDetails,
  getJwtToken,
  createUserDb,
  findOneUser,
  updateUserName, 
  updateUserAdress,
  login
};
