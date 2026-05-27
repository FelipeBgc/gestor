CREATE TABLE IF NOT EXISTS shops (
    id uuid NOT NULL DEFAULT gen_random_uuid(), PRIMARY KEY (id),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    shop_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now(),
    UNIQUE(user_id)
);

CREATE TABLE IF NOT EXISTS products (
    id uuid NOT NULL DEFAULT gen_random_uuid(), PRIMARY KEY (id),
    shop_id UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
    product_name VARCHAR(255) NOT NULL,
    details TEXT,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS product_images (
    id uuid NOT NULL DEFAULT gen_random_uuid(), PRIMARY KEY (id),
    shop_id UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    product_name VARCHAR(255) NOT NULL,
    size VARCHAR(50),
    image_data TEXT,
    created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS inventory_lots (
    id uuid NOT NULL DEFAULT gen_random_uuid(), PRIMARY KEY (id),
    shop_id UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    product_name VARCHAR(255) NOT NULL,
    size VARCHAR(50),
    purchase_location VARCHAR(255),
    unit_price DECIMAL(10, 2),
    quantity INT,
    total_value DECIMAL(15, 2),
    cost_price DECIMAL(10, 2),
    profit_margin DECIMAL(5, 2),
    selling_price DECIMAL(10, 2),
    quantity_sold INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS clients (
    id uuid NOT NULL DEFAULT gen_random_uuid(), PRIMARY KEY (id),
    shop_id UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    source VARCHAR(100),
    client_type VARCHAR(20),
    cpf VARCHAR(14),
    cnpj VARCHAR(18),
    razao_social VARCHAR(255),
    phone VARCHAR(20),
    address TEXT,
    birthday DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS orders (
    id uuid NOT NULL DEFAULT gen_random_uuid(), PRIMARY KEY (id),
    shop_id UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
    order_code VARCHAR(50) NOT NULL UNIQUE,
    client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
    order_date DATE NOT NULL,
    product_name VARCHAR(255),
    batch_id UUID REFERENCES inventory_lots(id) ON DELETE SET NULL,
    quantity INT,
    discount DECIMAL(10, 2) DEFAULT 0,
    freight DECIMAL(10, 2) DEFAULT 0,
    fees DECIMAL(10, 2) DEFAULT 0,
    total_value DECIMAL(15, 2),
    payment_method VARCHAR(50),
    payment_status VARCHAR(20) DEFAULT 'pending',
    signal_amount DECIMAL(15, 2),
    signal_date DATE,
    installments_qty INT,
    installment_value DECIMAL(15, 2),
    notes TEXT,
    is_paid BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS schedule_events (
    id uuid NOT NULL DEFAULT gen_random_uuid(), PRIMARY KEY (id),
    shop_id UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
    event_date DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS investments (
    id uuid NOT NULL DEFAULT gen_random_uuid(), PRIMARY KEY (id),
    shop_id UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
    amount DECIMAL(15, 2),
    date TIMESTAMP DEFAULT now(),
    created_at TIMESTAMP DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_products_shop_id ON products(shop_id);
CREATE INDEX IF NOT EXISTS idx_inventory_shop_id ON inventory_lots(shop_id);
CREATE INDEX IF NOT EXISTS idx_inventory_product_id ON inventory_lots(product_id);
CREATE INDEX IF NOT EXISTS idx_clients_shop_id ON clients(shop_id);
CREATE INDEX IF NOT EXISTS idx_orders_shop_id ON orders(shop_id);
CREATE INDEX IF NOT EXISTS idx_orders_client_id ON orders(client_id);
CREATE INDEX IF NOT EXISTS idx_schedule_shop_id ON schedule_events(shop_id);
CREATE INDEX IF NOT EXISTS idx_investments_shop_id ON investments(shop_id);
CREATE INDEX IF NOT EXISTS idx_product_images_shop_id ON product_images(shop_id);
CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON product_images(product_id);

ALTER TABLE shops ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_lots ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedule_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE investments ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS users_can_view_own_shops ON shops;
CREATE POLICY users_can_view_own_shops
    ON shops FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS users_can_insert_own_shops ON shops;
CREATE POLICY users_can_insert_own_shops
    ON shops FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS users_can_update_own_shops ON shops;
CREATE POLICY users_can_update_own_shops
    ON shops FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS users_can_view_products ON products;
CREATE POLICY users_can_view_products
    ON products FOR SELECT USING (shop_id IN (SELECT id FROM shops WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS users_can_insert_products ON products;
CREATE POLICY users_can_insert_products
    ON products FOR INSERT WITH CHECK (shop_id IN (SELECT id FROM shops WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS users_can_update_products ON products;
CREATE POLICY users_can_update_products
    ON products FOR UPDATE USING (shop_id IN (SELECT id FROM shops WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS users_can_view_inventory ON inventory_lots;
CREATE POLICY users_can_view_inventory
    ON inventory_lots FOR SELECT USING (shop_id IN (SELECT id FROM shops WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS users_can_insert_inventory ON inventory_lots;
CREATE POLICY users_can_insert_inventory
    ON inventory_lots FOR INSERT WITH CHECK (shop_id IN (SELECT id FROM shops WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS users_can_update_inventory ON inventory_lots;
CREATE POLICY users_can_update_inventory
    ON inventory_lots FOR UPDATE USING (shop_id IN (SELECT id FROM shops WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS users_can_view_clients ON clients;
CREATE POLICY users_can_view_clients
    ON clients FOR SELECT USING (shop_id IN (SELECT id FROM shops WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS users_can_insert_clients ON clients;
CREATE POLICY users_can_insert_clients
    ON clients FOR INSERT WITH CHECK (shop_id IN (SELECT id FROM shops WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS users_can_update_clients ON clients;
CREATE POLICY users_can_update_clients
    ON clients FOR UPDATE USING (shop_id IN (SELECT id FROM shops WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS users_can_view_orders ON orders;
CREATE POLICY users_can_view_orders
    ON orders FOR SELECT USING (shop_id IN (SELECT id FROM shops WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS users_can_insert_orders ON orders;
CREATE POLICY users_can_insert_orders
    ON orders FOR INSERT WITH CHECK (shop_id IN (SELECT id FROM shops WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS users_can_update_orders ON orders;
CREATE POLICY users_can_update_orders
    ON orders FOR UPDATE USING (shop_id IN (SELECT id FROM shops WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS users_can_view_schedule ON schedule_events;
CREATE POLICY users_can_view_schedule
    ON schedule_events FOR SELECT USING (shop_id IN (SELECT id FROM shops WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS users_can_insert_schedule_events ON schedule_events;
CREATE POLICY users_can_insert_schedule_events
    ON schedule_events FOR INSERT WITH CHECK (shop_id IN (SELECT id FROM shops WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS users_can_update_schedule_events ON schedule_events;
CREATE POLICY users_can_update_schedule_events
    ON schedule_events FOR UPDATE USING (shop_id IN (SELECT id FROM shops WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS users_can_view_investments ON investments;
CREATE POLICY users_can_view_investments
    ON investments FOR SELECT USING (shop_id IN (SELECT id FROM shops WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS users_can_insert_investments ON investments;
CREATE POLICY users_can_insert_investments
    ON investments FOR INSERT WITH CHECK (shop_id IN (SELECT id FROM shops WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS users_can_view_product_images ON product_images;
CREATE POLICY users_can_view_product_images
    ON product_images FOR SELECT USING (shop_id IN (SELECT id FROM shops WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS users_can_insert_product_images ON product_images;
CREATE POLICY users_can_insert_product_images
    ON product_images FOR INSERT WITH CHECK (shop_id IN (SELECT id FROM shops WHERE user_id = auth.uid()));

