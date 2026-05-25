import express from 'express';
import pool from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Listar eventos da agenda
router.get('/', authenticateToken, async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [events] = await connection.query(
            'SELECT * FROM agenda_events WHERE user_id = ? ORDER BY event_date DESC',
            [req.user.id]
        );
        connection.release();
        res.json(events);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Criar evento
router.post('/', authenticateToken, async (req, res) => {
    try {
        const { eventDate, notes } = req.body;

        const connection = await pool.getConnection();
        const [result] = await connection.query(
            'INSERT INTO agenda_events (user_id, event_date, notes) VALUES (?, ?, ?)',
            [req.user.id, eventDate, notes]
        );
        connection.release();

        res.status(201).json({
            id: result.insertId,
            message: 'Evento criado com sucesso'
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Atualizar evento
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { eventDate, notes } = req.body;

        const connection = await pool.getConnection();
        await connection.query(
            'UPDATE agenda_events SET event_date = ?, notes = ? WHERE id = ? AND user_id = ?',
            [eventDate, notes, id, req.user.id]
        );
        connection.release();

        res.json({ message: 'Evento atualizado com sucesso' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Deletar evento
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;

        const connection = await pool.getConnection();
        await connection.query('DELETE FROM agenda_events WHERE id = ? AND user_id = ?', [id, req.user.id]);
        connection.release();

        res.json({ message: 'Evento deletado com sucesso' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
