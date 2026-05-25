import express from 'express';
import pool from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Listar produtos
router.get('/', authenticateToken, async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [products] = await connection.query(
            'SELECT * FROM products WHERE user_id = ? ORDER BY created_at DESC',
            [req.user.id]
        );
        connection.release();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Criar produto
router.post('/', authenticateToken, async (req, res) => {
    try {
        const { name, details, size, costPrice, profitMargin, sellingPrice, purchaseLocation } = req.body;

        const connection = await pool.getConnection();
        const [result] = await connection.query(
            'INSERT INTO products (user_id, name, details, size, cost_price, profit_margin, selling_price, purchase_location) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [req.user.id, name, details, size, costPrice, profitMargin, sellingPrice, purchaseLocation]
        );
        connection.release();

        res.status(201).json({
            id: result.insertId,
            message: 'Produto criado com sucesso'
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Atualizar produto
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { name, details, size, costPrice, profitMargin, sellingPrice, purchaseLocation, quantity } = req.body;

        const connection = await pool.getConnection();
        await connection.query(
            'UPDATE products SET name = ?, details = ?, size = ?, cost_price = ?, profit_margin = ?, selling_price = ?, purchase_location = ?, quantity = ? WHERE id = ? AND user_id = ?',
            [name, details, size, costPrice, profitMargin, sellingPrice, purchaseLocation, quantity, id, req.user.id]
        );
        connection.release();

        res.json({ message: 'Produto atualizado com sucesso' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Deletar produto
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;

        const connection = await pool.getConnection();
        await connection.query('DELETE FROM products WHERE id = ? AND user_id = ?', [id, req.user.id]);
        connection.release();

        res.json({ message: 'Produto deletado com sucesso' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
