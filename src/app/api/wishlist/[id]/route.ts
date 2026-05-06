import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { syncWishlistStatusesForUser } from "@/lib/wishlist-status";
import { z } from "zod";

const patchSchema = z.object({
  action: z.enum(["bought", "skip"]),
});

type RouteContext = { params: Promise<{ id: string }> };

/**
 * PATCH /api/wishlist/:id — tandai Bought / Skip (hanya jika masa cooling-off selesai).
 */
export async function PATCH(req: Request, context: RouteContext) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  await syncWishlistStatusesForUser(session.user.id);

  const json = await req.json().catch(() => ({}));
  const parsed = patchSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Payload tidak valid" }, { status: 400 });
  }

  const item = await prisma.wishlistItem.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!item) {
    return NextResponse.json({ error: "Item tidak ditemukan" }, { status: 404 });
  }

  const now = new Date();
  const coolingDone = item.coolingOffEndsAt <= now;
  const canAct =
    item.status === "READY" || (item.status === "PENDING_COOLING" && coolingDone);

  if (!canAct) {
    return NextResponse.json(
      {
        error:
          "Timer cooling-off belum selesai. Tunggu sampai waktu habis sebelum membeli atau melewati.",
      },
      { status: 403 },
    );
  }

  if (item.status === "BOUGHT" || item.status === "SKIPPED") {
    return NextResponse.json({ error: "Item sudah diproses sebelumnya" }, { status: 400 });
  }

  const nextStatus = parsed.data.action === "bought" ? "BOUGHT" : "SKIPPED";

  const updated = await prisma.wishlistItem.update({
    where: { id },
    data: { status: nextStatus },
  });

  return NextResponse.json({ item: updated });
}
