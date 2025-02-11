const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser');
require('dotenv').config(); // Charger les variables d'environnement

// Import des routes
const identityRoutes = require('./routes/identity.routes');
const emailRoutes = require('./routes/email.routes');
const userRoutes = require("./routes/user.route");
const accountRoutes = require("./routes/account.routes");
const accountOperationsRoutes = require("./routes/account-opertaions.route");
const orderRoutes = require("./routes/orders.route");
const fileRoutes = require("./routes/fileUpload.route"); // Import des routes pour les fichiers
const router = express.Router();

const app = express();

// CORS Configuration
const corsOptions = {
  origin: "*", // Permettre toutes les origines pour le moment
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// Middleware pour parser les requêtes JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

router.get('/', async (req, res) => {
  res.send('Welcome to the Wealth Funding API');
});

// Utilisation des routes
app.use("/", router);
app.use("/api/users", userRoutes);
app.use('/api/email', emailRoutes);
app.use("/api/accounts", accountRoutes);
app.use("/api/account-operations", accountOperationsRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/files", fileRoutes); // Ajouter les routes pour les fichiers
app.use('/api/identities', identityRoutes);

// Lancement du serveur
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
