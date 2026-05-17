const express = require("express");

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const router = express.Router();

const db = require("../db");

const SECRET_KEY = "mysecretkey";



// ================= SIGNUP =================

router.post("/signup", async (req, res) => {

    try {

        const { name, email, password } = req.body;

        if (!name || !email || !password) {

            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const sql =
            "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";

        db.query(
            sql,
            [name, email, hashedPassword],
            (err, result) => {

                if (err) {

                    console.log(err);

                    return res.status(500).json({
                        message: "Signup failed"
                    });
                }

                res.json({
                    message: "User registered successfully"
                });
            }
        );

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server error"
        });
    }
});



// ================= LOGIN =================

router.post("/login", (req, res) => {

    try {

        const { email, password } = req.body;

        const sql = "SELECT * FROM users WHERE email = ?";

        db.query(sql, [email], async (err, result) => {

            if (err) {

                console.log(err);

                return res.status(500).json({
                    message: "Database error"
                });
            }

            if (result.length === 0) {

                return res.status(400).json({
                    message: "User not found"
                });
            }

            const user = result[0];

            const isMatch =
                await bcrypt.compare(password, user.password);

            if (!isMatch) {

                return res.status(400).json({
                    message: "Invalid password"
                });
            }

            const token = jwt.sign(
                { id: user.id },
                SECRET_KEY,
                { expiresIn: "1d" }
            );

            res.json({
                token,
                user
            });
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server error"
        });
    }
});



module.exports = router;