import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function runMigrations() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 3306,
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
    });

    try {
        // Criar banco de dados
        await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'gestor_loja'}`);
        await connection.changeUser({ database: process.env.DB_NAME || 'gestor_loja' });

        console.log('✓ Banco de dados criado/verificado');

        // Tabela de usuários
        await connection.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(100) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                shop_name VARCHAR(255) NOT NULL,
                email VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);
        console.log('✓ Tabela users criada');

        // Tabela de produtos/estoque
        await connection.query(`
            CREATE TABLE IF NOT EXISTS products (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                name VARCHAR(255) NOT NULL,
                details TEXT,
                size VARCHAR(100),
                cost_price DECIMAL(10, 2),
                profit_margin DECIMAL(5, 2),
                selling_price DECIMAL(10, 2),
                purchase_location VARCHAR(255),
                quantity INT DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);
        console.log('✓ Tabela products criada');

        // Tabela de clientes
        await connection.query(`
            CREATE TABLE IF NOT EXISTS clients (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                name VARCHAR(255) NOT NULL,
                source VARCHAR(100),
                type ENUM('person', 'company') DEFAULT 'person',
                cpf VARCHAR(14),
                cnpj VARCHAR(18),
                razao_social VARCHAR(255),
                phone VARCHAR(20),
                address TEXT,
                birthday DATE,
                notes TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);
        console.log('✓ Tabela clients criada');

        // Tabela de pedidos
        await connection.query(`
            CREATE TABLE IF NOT EXISTS orders (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                code VARCHAR(100) UNIQUE,
                client_id INT,
                order_date DATE,
                product_id INT,
                quantity INT,
                discount DECIMAL(10, 2) DEFAULT 0,
                freight DECIMAL(10, 2) DEFAULT 0,
                fees DECIMAL(10, 2) DEFAULT 0,
                total DECIMAL(10, 2),
                payment_method ENUM('cash', 'credit', 'debit', 'pix', 'other'),
                payment_status ENUM('pending', 'partial', 'paid') DEFAULT 'pending',
                signal_amount DECIMAL(10, 2),
                signal_date DATE,
                installments_qty INT,
                installment_value DECIMAL(10, 2),
                notes TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (client_id) REFERENCES clients(id),
                FOREIGN KEY (product_id) REFERENCES products(id)
            )
        `);
        console.log('✓ Tabela orders criada');

        // Tabela de agenda/eventos
        await connection.query(`
            CREATE TABLE IF NOT EXISTS agenda_events (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                event_date DATE,
                notes TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);
        console.log('✓ Tabela agenda_events criada');

        // Tabela de movimentações financeiras
        await connection.query(`
            CREATE TABLE IF NOT EXISTS financial_movements (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                order_id INT,
                type ENUM('received', 'receivable', 'investment') DEFAULT 'receivable',
                amount DECIMAL(10, 2),
                due_date DATE,
                payment_date DATE,
                notes TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (order_id) REFERENCES orders(id)
            )
        `);
        console.log('✓ Tabela financial_movements criada');

        // Inserir usuário padrão
        await connection.query(`
            INSERT IGNORE INTO users (username, password, shop_name)
            VALUES ('admin', '$2a$10$Nq.yNrKmZyJD4XdMhXhGiOlfHzKbCKxflMgQmW9OKzQqPNLDGKAle', 'Minha Loja')
        `);
        console.log('✓ Usuário padrão (admin/admin123) inserido');

        console.log('\n✅ Migrações completadas com sucesso!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Erro nas migrações:', error.message);
        process.exit(1);
    } finally {
        await connection.end();
    }
}

runMigrations();
