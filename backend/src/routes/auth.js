import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/database.js';

const router = express.Router();

// Login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Usuário e senha são obrigatórios' });
        }

        const connection = await pool.getConnection();
        const [users] = await connection.query('SELECT * FROM users WHERE username = ?', [username]);
        connection.release();

        if (users.length === 0) {
            return res.status(401).json({ error: 'Usuário ou senha incorretos' });
        }

        const user = users[0];
        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.status(401).json({ error: 'Usuário ou senha incorretos' });
        }

        const token = jwt.sign(
            { id: user.id, username: user.username, shopName: user.shop_name },
            process.env.JWT_SECRET || 'sua_chave_secreta',
            { expiresIn: '7d' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                username: user.username,
                shopName: user.shop_name
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Registrar
router.post('/register', async (req, res) => {
    try {
        const { username, password, shopName } = req.body;

        if (!username || !password || !shopName) {
            return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const connection = await pool.getConnection();
        try {
            await connection.query(
                'INSERT INTO users (username, password, shop_name) VALUES (?, ?, ?)',
                [username, hashedPassword, shopName]
            );

            const [newUsers] = await connection.query('SELECT * FROM users WHERE username = ?', [username]);
            const newUser = newUsers[0];

            const token = jwt.sign(
                { id: newUser.id, username: newUser.username, shopName: newUser.shop_name },
                process.env.JWT_SECRET || 'sua_chave_secreta',
                { expiresIn: '7d' }
            );

            res.status(201).json({
                token,
                user: {
                    id: newUser.id,
                    username: newUser.username,
                    shopName: newUser.shop_name
                }
            });
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ error: 'Usuário já existe' });
            }
            throw error;
        } finally {
            connection.release();
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
