const express = require("express");
const {
    registerUser,
    loginUser,
    getUserProfile,
} = require("../controllers/userController");
const upload = require("../middleware/upload");
const { protect } = require("../middleware/authmiddleware");
const router = express.Router();

router.post("/register", upload.single("image"), registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getUserProfile);

module.exports = router;