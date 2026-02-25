import type { NextApiRequest, NextApiResponse } from "next";
import { addProduct, getProducts } from "@/lib/server/dashboard-store";
import type { NewProductPayload } from "@/lib/types";

function isValidStatus(status: string): status is NewProductPayload["status"] {
  return status === "In Stock" || status === "Low Stock" || status === "Out of Stock";
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    return res.status(200).json({ products: getProducts() });
  }

  if (req.method === "POST") {
    const body = req.body as Partial<NewProductPayload>;
    if (
      !body.name ||
      !body.category ||
      typeof body.price !== "number" ||
      typeof body.stock !== "number" ||
      !body.sku ||
      !body.status ||
      !isValidStatus(body.status)
    ) {
      return res.status(400).json({ error: "Invalid product payload." });
    }

    const product = addProduct({
      name: body.name,
      category: body.category,
      price: body.price,
      stock: body.stock,
      sku: body.sku,
      status: body.status,
      image: body.image,
    });
    return res.status(201).json({ product });
  }

  res.setHeader("Allow", "GET,POST");
  return res.status(405).json({ error: "Method not allowed." });
}

