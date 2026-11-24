import { Request, Response, NextFunction } from "express";
import { query } from "../db";

type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  color: string;
  mark: string;
};

type Order = {
  id: string;
  customerName: string;
  address: string;
  date: string;
  total: number;
  status: string;
  items: { productId: string; quantity: number }[];
};

export async function getProducts(
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const result = await query<Product>(
      `SELECT id, name, category, price::float8 AS price, description, color, mark
       FROM products
       ORDER BY name`,
    );
    res.status(200).json(result.rows);
  } catch (error) {
    next(error);
  }
}

export async function getOrders(
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const result = await query<Order>(
      `SELECT
         o.id,
         u.name AS "customerName",
         o.address,
         TO_CHAR(o.order_date, 'YYYY-MM-DD') AS date,
         o.total::float8 AS total,
         o.status,
         COALESCE(
           JSON_AGG(
             JSON_BUILD_OBJECT('productId', oi.product_id, 'quantity', oi.quantity)
             ORDER BY oi.product_id
           ) FILTER (WHERE oi.product_id IS NOT NULL),
           '[]'::json
         ) AS items
       FROM orders o
       JOIN users u ON u.id = o.user_id
       LEFT JOIN order_items oi ON oi.order_id = o.id
       GROUP BY o.id, u.name
       ORDER BY o.order_date DESC, o.id DESC`,
    );
    res.status(200).json(result.rows);
  } catch (error) {
    next(error);
  }
}
