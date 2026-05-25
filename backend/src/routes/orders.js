import express from 'express';
import pool from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Listar pedidos
router.get('/', authenticateToken, async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [orders] = await connection.query(
            'SELECT o.*, c.name as client_name, p.name as product_name FROM orders o LEFT JOIN clients c ON o.client_id = c.id LEFT JOIN products p ON o.product_id = p.id WHERE o.user_id = ? ORDER BY o.order_date DESC',
            [req.user.id]
        );
        connection.release();
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Criar pedido
router.post('/', authenticateToken, async (req, res) => {
    try {
        const { code, clientId, orderDate, productId, quantity, discount, freight, fees, total, paymentMethod, paymentStatus, signalAmount, signalDate, installmentsQty, installmentValue, notes } = req.body;

        const connection = await pool.getConnection();
        const [result] = await connection.query(
            'INSERT INTO orders (user_id, code, client_id, order_date, product_id, quantity, discount, freight, fees, total, payment_method, payment_status, signal_amount, signal_date, installments_qty, installment_value, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [req.user.id, code, clientId, orderDate, productId, quantity, discount, freight, fees, total, paymentMethod, paymentStatus, signalAmount, signalDate, installmentsQty, installmentValue, notes]
        );
        connection.release();

        res.status(201).json({
            id: result.insertId,
            message: 'Pedido criado com sucesso'
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Atualizar pedido
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { code, clientId, orderDate, productId, quantity, discount, freight, fees, total, paymentMethod, paymentStatus, signalAmount, signalDate, installmentsQty, installmentValue, notes } = req.body;

        const connection = await pool.getConnection();
        await connection.query(
            'UPDATE orders SET code = ?, client_id = ?, order_date = ?, product_id = ?, quantity = ?, discount = ?, freight = ?, fees = ?, total = ?, payment_method = ?, payment_status = ?, signal_amount = ?, signal_date = ?, installments_qty = ?, installment_value = ?, notes = ? WHERE id = ? AND user_id = ?',
            [code, clientId, orderDate, productId, quantity, discount, freight, fees, total, paymentMethod, paymentStatus, signalAmount, signalDate, installmentsQty, installmentValue, notes, id, req.user.id]
        );
        connection.release();

        res.json({ message: 'Pedido atualizado com sucesso' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Deletar pedido
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;

        const connection = await pool.getConnection();
        await connection.query('DELETE FROM orders WHERE id = ? AND user_id = ?', [id, req.user.id]);
        connection.release();

        res.json({ message: 'Pedido deletado com sucesso' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
