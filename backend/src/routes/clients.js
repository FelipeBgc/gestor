import express from 'express';
import pool from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Listar clientes
router.get('/', authenticateToken, async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [clients] = await connection.query(
            'SELECT * FROM clients WHERE user_id = ? ORDER BY name ASC',
            [req.user.id]
        );
        connection.release();
        res.json(clients);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Criar cliente
router.post('/', authenticateToken, async (req, res) => {
    try {
        const { name, source, type, cpf, cnpj, razaoSocial, phone, address, birthday, notes } = req.body;

        const connection = await pool.getConnection();
        const [result] = await connection.query(
            'INSERT INTO clients (user_id, name, source, type, cpf, cnpj, razao_social, phone, address, birthday, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [req.user.id, name, source, type, cpf, cnpj, razaoSocial, phone, address, birthday, notes]
        );
        connection.release();

        res.status(201).json({
            id: result.insertId,
            message: 'Cliente criado com sucesso'
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Atualizar cliente
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { name, source, type, cpf, cnpj, razaoSocial, phone, address, birthday, notes } = req.body;

        const connection = await pool.getConnection();
        await connection.query(
            'UPDATE clients SET name = ?, source = ?, type = ?, cpf = ?, cnpj = ?, razao_social = ?, phone = ?, address = ?, birthday = ?, notes = ? WHERE id = ? AND user_id = ?',
            [name, source, type, cpf, cnpj, razaoSocial, phone, address, birthday, notes, id, req.user.id]
        );
        connection.release();

        res.json({ message: 'Cliente atualizado com sucesso' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Deletar cliente
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;

        const connection = await pool.getConnection();
        await connection.query('DELETE FROM clients WHERE id = ? AND user_id = ?', [id, req.user.id]);
        connection.release();

        res.json({ message: 'Cliente deletado com sucesso' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
