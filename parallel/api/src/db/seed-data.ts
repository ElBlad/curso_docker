import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { pool } from "./index";
import seedRecords from "./seed-data.json";

type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  color: string;
  mark: string;
};

type User = {
  id: string;
  name: string;
  password: string;
};

type Order = {
  id: string;
  address: string;
  date: string;
  total: number;
  status: string;
  items: { productId: string; quantity: number }[];
};

const users: User[] = [
  { id: "client", name: "client", password: "Password123" },
  { id: "admin", name: "admin", password: "Password123" },
];

const products: Product[] = seedRecords.products;
const orders: Order[] = seedRecords.orders;

function seedEnabled(name: string): boolean {
  const value = process.env[name];
  if (value === "true") return true;
  if (value === "false" || value === undefined) return false;
  throw new Error(`${name} must be "true" or "false".`);
}

const seedProducts = seedEnabled("SEED_PRODUCTS");
const seedOrders = seedEnabled("SEED_ORDERS");

async function seedData(): Promise<void> {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    const schema = await readFile(join(__dirname, "initial-schema.sql"), "utf8");
    await client.query(schema);

    for (const user of users) {
      await client.query(
        `INSERT INTO users (id, name, password)
         VALUES ($1, $2, $3)
         ON CONFLICT (id) DO NOTHING`,
        [user.id, user.name, user.password]
      );
    }

    if (seedProducts) {
      for (const product of products) {
        await client.query(
          `INSERT INTO products (id, name, category, price, description, color, mark)
           VALUES ($1, $2, $3, $4, $5, $6, $7)
           ON CONFLICT (id) DO NOTHING`,
          [
            product.id,
            product.name,
            product.category,
            product.price,
            product.description,
            product.color,
            product.mark,
          ]
        );
      }
    }

    if (seedOrders) {
      for (const order of orders) {
        await client.query(
          `INSERT INTO orders (id, user_id, address, order_date, total, status)
           VALUES ($1, $2, $3, $4, $5, $6)
           ON CONFLICT (id) DO NOTHING`,
          [order.id, "client", order.address, order.date, order.total, order.status]
        );

        for (const item of order.items) {
          await client.query(
            `INSERT INTO order_items (order_id, product_id, quantity)
             SELECT $1, $2, $3
             WHERE EXISTS (SELECT 1 FROM products WHERE id = $2)
             ON CONFLICT (order_id, product_id) DO NOTHING`,
            [order.id, item.productId, item.quantity]
          );
        }
      }
    }

    await client.query("COMMIT");
    console.log(
      `Database schema is ready. Seeded products: ${seedProducts}; seeded orders: ${seedOrders}.`
    );
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

seedData().catch((error: unknown) => {
  console.error("Failed to initialize database:", error);
  process.exitCode = 1;
});
