const express = require("express");
const {
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
  login,
} = require("../controllers/user.controller");

const router = express.Router();

// Define the route for creating a user
router.post("/create-user", createUser);
router.post("/create-user-db", createUserDb);
router.post("/update-personnal-info", updateUserName);
router.post("/update-address-details", updateUserAdress);
router.post("/auth/token", getJwtToken);
router.post("/auth/admin", login);
router.post("/find-one/:id", findOneUser);
router.post("/get-all-users", getAllUsers);
router.post("/set-user-password", setUserPassword);
router.post("/set-user-email", setUserEmail);
router.post("/get-user-by-email", getUserByEmail);
router.post("/get-user-details", getUserDetails);

module.exports = router;
