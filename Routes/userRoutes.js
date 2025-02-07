const express = require("express");
const userSchema = require("../validations/userValidation");
const { validationResult } = require("express-validator");
const userRouter = express.Router();
userRouter.post('/login', userSchema(), (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
})

module.exports = userRouter;
