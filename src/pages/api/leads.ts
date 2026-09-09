import type { APIRoute } from "astro";
import { neon } from "@neondatabase/serverless";

// Server-rendered on Vercel (adapter configured in astro.config.mjs); every
// other route stays static. See docs/db/schema.sql for the table this writes to.
export const prerender = false;

interface LeadPayload {
  sourcePage?: string;
  formId?: string;
  name?: string;
  phone?: string;
  serviceType?: string;
  from?: string;
  to?: string;
  datetime?: string;
  note?: string;
}

export const POST: APIRoute = async ({ request }) => {
  const databaseUrl = import.meta.env.DATABASE_URL;
  if (!databaseUrl) {
    return new Response(JSON.stringify({ error: "DATABASE_URL chưa được cấu hình" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  let body: LeadPayload;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Payload không hợp lệ" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const phone = body.phone?.trim();
  if (!phone) {
    return new Response(JSON.stringify({ error: "Thiếu số điện thoại" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const sql = neon(databaseUrl);

  try {
    await sql`
      insert into leads (source_page, form_id, name, phone, service_type, from_location, to_location, travel_at, note)
      values (
        ${body.sourcePage ?? null},
        ${body.formId ?? null},
        ${body.name ?? null},
        ${phone},
        ${body.serviceType ?? null},
        ${body.from ?? null},
        ${body.to ?? null},
        ${body.datetime ?? null},
        ${body.note ?? null}
      )
    `;
  } catch (err) {
    console.error("Insert lead failed", err);
    return new Response(JSON.stringify({ error: "Không lưu được, thử lại sau" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
};
