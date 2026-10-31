import { NextRequest, NextResponse } from "next/server";
import { eq, desc } from "drizzle-orm";
import { db } from "@/db";
import { friendInvitations, reports } from "@/db/schema";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  try {
    const rows = await db
      .select()
      .from(friendInvitations)
      .where(eq(friendInvitations.reportId, id))
      .orderBy(desc(friendInvitations.createdAt));
    return NextResponse.json({ invitations: rows });
  } catch (err) {
    console.error("Failed to load invitations:", err);
    return NextResponse.json({ invitations: [] });
  }
}

export async function POST(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const [report] = await db
    .select({ id: reports.id })
    .from(reports)
    .where(eq(reports.id, id))
    .limit(1);

  if (!report) {
    return NextResponse.json(
      { error: "Report not found." },
      { status: 404 }
    );
  }

  const body = await req.json().catch(() => ({}));
  const email = (body.email ?? "").toString().trim().toLowerCase().slice(0, 120);
  const name = (body.name ?? "").toString().trim().slice(0, 60);
  const permission = (body.permission ?? "blind").toString().trim();

  if (!email || !email.includes("@")) {
    return NextResponse.json(
      { error: "A valid email address is required." },
      { status: 400 }
    );
  }

  try {
    const [row] = await db
      .insert(friendInvitations)
      .values({
        reportId: id,
        email,
        name: name || email.split("@")[0],
        permission,
        status: "pending",
      })
      .returning();

    return NextResponse.json({ invitation: row });
  } catch (err) {
    console.error("Failed to create invitation:", err);
    return NextResponse.json(
      { error: "Failed to create invitation record." },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const inviteId = body.inviteId;
  const action = body.action;

  if (!inviteId) {
    return NextResponse.json({ error: "Missing inviteId." }, { status: 400 });
  }

  try {
    if (action === "opened") {
      const [updated] = await db
        .update(friendInvitations)
        .set({
          status: "opened",
          openedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(friendInvitations.id, inviteId))
        .returning();

      return NextResponse.json({ ok: true, invitation: updated });
    }

    if (action === "permission" && body.permission) {
      const [updated] = await db
        .update(friendInvitations)
        .set({
          permission: body.permission,
          updatedAt: new Date(),
        })
        .where(eq(friendInvitations.id, inviteId))
        .returning();

      return NextResponse.json({ ok: true, invitation: updated });
    }

    if (action === "completed") {
      const [updated] = await db
        .update(friendInvitations)
        .set({
          status: "completed",
          updatedAt: new Date(),
        })
        .where(eq(friendInvitations.id, inviteId))
        .returning();

      return NextResponse.json({ ok: true, invitation: updated });
    }

    return NextResponse.json({ error: "Invalid action." }, { status: 400 });
  } catch (err) {
    console.error("Failed to update invitation:", err);
    return NextResponse.json(
      { error: "Failed to update invitation." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const { searchParams } = new URL(req.url);
  const inviteId = searchParams.get("inviteId");

  if (!inviteId) {
    return NextResponse.json({ error: "Missing inviteId." }, { status: 400 });
  }

  try {
    await db.delete(friendInvitations).where(eq(friendInvitations.id, inviteId));
    return NextResponse.json({ ok: true, deletedId: inviteId });
  } catch (err) {
    console.error("Failed to delete invitation:", err);
    return NextResponse.json({ error: "Failed to delete invitation." }, { status: 500 });
  }
}
