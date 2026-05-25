import express from 'express';
import pool from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Listar movimentações financeiras
router.get('/', authenticateToken, async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [movements] = await connection.query(
            'SELECT fm.*, o.code as order_code FROM financial_movements fm LEFT JOIN orders o ON fm.order_id = o.id WHERE fm.user_id = ? ORDER BY fm.due_date DESC',
            [req.user.id]
        );
        connection.release();
        res.json(movements);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Obter resumo financeiro
router.get('/summary/:month', authenticateToken, async (req, res) => {
    try {
        const { month } = req.params;
        const connection = await pool.getConnection();

        const [received] = await connection.query(
            'SELECT COALESCE(SUM(amount), 0) as total FROM financial_movements WHERE user_id = ? AND type = "received" AND YEAR(payment_date) = YEAR(STR_TO_DATE(?, "%Y-%m")) AND MONTH(payment_date) = MONTH(STR_TO_DATE(?, "%Y-%m"))',
            [req.user.id, month, month]
        );

        const [receivable] = await connection.query(
            'SELECT COALESCE(SUM(amount), 0) as total FROM financial_movements WHERE user_id = ? AND type = "receivable" AND due_date >= CURDATE()',
            [req.user.id]
        );

        const [overdue] = await connection.query(
            'SELECT COALESCE(SUM(amount), 0) as total FROM financial_movements WHERE user_id = ? AND type = "receivable" AND due_date < CURDATE() AND payment_date IS NULL',
            [req.user.id]
        );

        connection.release();

        res.json({
            received: received[0].total,
            receivable: receivable[0].total,
            overdue: overdue[0].total
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Criar movimentação
router.post('/', authenticateToken, async (req, res) => {
    try {
        const { orderId, type, amount, dueDate, paymentDate, notes } = req.body;

        const connection = await pool.getConnection();
        const [result] = await connection.query(
            'INSERT INTO financial_movements (user_id, order_id, type, amount, due_date, payment_date, notes) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [req.user.id, orderId, type, amount, dueDate, paymentDate, notes]
        );
        connection.release();

        res.status(201).json({
            id: result.insertId,
            message: 'Movimentação criada com sucesso'
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
