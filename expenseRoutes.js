const express = require("express");

const router = express.Router();

const db = require("../db");

const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, (req, res) => {

    const { category, amount, comments } = req.body;

    const user_id = req.user.id;

    const sql =
        "INSERT INTO expenses (user_id, category, amount, comments) VALUES (?, ?, ?, ?)";

    db.query(
        sql,
        [user_id, category, amount, comments],
        (err, result) => {

            if (err) {
                return res.status(500).json(err);
            }

            res.json({
                message: "Expense added"
            });
        }
    );
});

router.get("/", authMiddleware, (req, res) => {

    const sql =
        "SELECT * FROM expenses WHERE user_id = ? ORDER BY created_at DESC";

    db.query(sql, [req.user.id], (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }

        res.json(result);
    });
});

router.put("/:id", authMiddleware, (req, res) => {

    const { category, amount, comments } = req.body;

    const sql =
        "UPDATE expenses SET category=?, amount=?, comments=? WHERE id=?";

    db.query(
        sql,
        [category, amount, comments, req.params.id],
        (err, result) => {

            if (err) {
                return res.status(500).json(err);
            }

            res.json({
                message: "Expense updated"
            });
        }
    );
});

router.delete("/:id", authMiddleware, (req, res) => {

    const sql = "DELETE FROM expenses WHERE id=?";

    db.query(sql, [req.params.id], (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }

        res.json({
            message: "Expense deleted"
        });
    });
});

module.exports = router;