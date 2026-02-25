import type { NextApiRequest, NextApiResponse } from "next";
import { addUser, getUsers } from "@/lib/server/dashboard-store";
import type { NewUserPayload } from "@/lib/types";

function isValidPlan(plan: string): plan is NewUserPayload["plan"] {
  return plan === "Free" || plan === "Pro";
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    return res.status(200).json({ users: getUsers() });
  }

  if (req.method === "POST") {
    const body = req.body as Partial<NewUserPayload>;

    if (!body.name || !body.email || !body.plan || !isValidPlan(body.plan)) {
      return res.status(400).json({ error: "Invalid user payload." });
    }

    const user = addUser({
      name: body.name,
      email: body.email,
      plan: body.plan,
      avatar: body.avatar,
    });
    return res.status(201).json({ user });
  }

  res.setHeader("Allow", "GET,POST");
  return res.status(405).json({ error: "Method not allowed." });
}

