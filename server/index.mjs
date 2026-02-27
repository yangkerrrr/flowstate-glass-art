import express from "express";
import cors from "cors";
import { neon } from "@neondatabase/serverless";

const PORT = process.env.PORT ? Number(process.env.PORT) : 8787;
const DATABASE_URL = process.env.NEON_DATABASE_URL || process.env.DATABASE_URL;
const ADMIN_API_KEY = process.env.ADMIN_API_KEY;

if (!DATABASE_URL) {
  // eslint-disable-next-line no-console
  console.error("Missing NEON_DATABASE_URL (or DATABASE_URL).");
  process.exit(1);
}

const sql = neon(DATABASE_URL);

const app = express();
app.use(cors());
app.use(express.json());

function requireAdmin(req, res, next) {
  if (!ADMIN_API_KEY) {
    return res.status(500).json({ error: "ADMIN_API_KEY is not configured" });
  }
  const key = req.header("x-admin-key");
  if (!key || key !== ADMIN_API_KEY) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  return next();
}

app.get("/api/health", async (_req, res) => {
  const rows = await sql`select 1 as ok`;
  res.json({ ok: true, db: rows?.[0]?.ok === 1 });
});

// Public products (active only)
app.get("/api/products", async (_req, res) => {
  const rows = await sql`
    select id, name, description, price, category, image_url, accent_color, is_active, created_at
    from products
    where is_active = true
    order by created_at desc
  `;
  res.json(rows);
});

// Admin products
app.get("/api/admin/products", requireAdmin, async (_req, res) => {
  const rows = await sql`
    select id, name, description, price, category, image_url, accent_color, is_active, created_at
    from products
    order by created_at desc
  `;
  res.json(rows);
});

app.post("/api/admin/products", requireAdmin, async (req, res) => {
  const { name, description, price, category, image_url, accent_color } = req.body ?? {};
  if (!name || typeof name !== "string") return res.status(400).json({ error: "name is required" });
  if (!category || typeof category !== "string") return res.status(400).json({ error: "category is required" });
  const parsedPrice = Number(price);
  if (!Number.isFinite(parsedPrice)) return res.status(400).json({ error: "price must be a number" });

  const rows = await sql`
    insert into products (name, description, price, category, image_url, accent_color, is_active)
    values (${name}, ${description ?? null}, ${parsedPrice}, ${category}, ${image_url ?? null}, ${accent_color ?? null}, true)
    returning id, name, description, price, category, image_url, accent_color, is_active, created_at
  `;
  res.status(201).json(rows?.[0] ?? null);
});

app.put("/api/admin/products/:id", requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { name, description, price, category, image_url, accent_color } = req.body ?? {};
  const parsedPrice = Number(price);
  if (!id) return res.status(400).json({ error: "id is required" });
  if (!name || typeof name !== "string") return res.status(400).json({ error: "name is required" });
  if (!category || typeof category !== "string") return res.status(400).json({ error: "category is required" });
  if (!Number.isFinite(parsedPrice)) return res.status(400).json({ error: "price must be a number" });

  const rows = await sql`
    update products
    set
      name = ${name},
      description = ${description ?? null},
      price = ${parsedPrice},
      category = ${category},
      image_url = ${image_url ?? null},
      accent_color = ${accent_color ?? null},
      updated_at = now()
    where id = ${id}
    returning id, name, description, price, category, image_url, accent_color, is_active, created_at
  `;
  res.json(rows?.[0] ?? null);
});

app.patch("/api/admin/products/:id/active", requireAdmin, async (req, res) => {
  const { id } = req.params;
  const rows = await sql`
    update products
    set is_active = not is_active, updated_at = now()
    where id = ${id}
    returning id, is_active
  `;
  res.json(rows?.[0] ?? null);
});

app.delete("/api/admin/products/:id", requireAdmin, async (req, res) => {
  const { id } = req.params;
  await sql`delete from products where id = ${id}`;
  res.status(204).end();
});

// Admin orders
app.get("/api/admin/orders", requireAdmin, async (_req, res) => {
  const rows = await sql`
    select id, user_email, total_amount, status, items, shipping_address, created_at
    from orders
    order by created_at desc
  `;
  res.json(rows);
});

app.patch("/api/admin/orders/:id/status", requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body ?? {};
  if (!status || typeof status !== "string") return res.status(400).json({ error: "status is required" });
  const rows = await sql`
    update orders
    set status = ${status}, updated_at = now()
    where id = ${id}
    returning id, status
  `;
  res.json(rows?.[0] ?? null);
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Neon API listening on http://localhost:${PORT}`);
});
