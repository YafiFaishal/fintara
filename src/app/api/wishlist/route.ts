import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { computeCleanBalance } from "@/lib/budget-math";
import { getCoolingOffEndsAt } from "@/lib/cooling-off";
import { evaluateBalanceAlerts } from "@/lib/balance-alerts";
import { syncWishlistStatusesForUser } from "@/lib/wishlist-status";
import { getMonthYear } from "@/lib/month";
import { z } from "zod";

const createSchema = z.object({
  name: z.string().min(1).max(200),
  price: z.number().int().min(0),
  monthYear: z.string().regex(/^\d{4}-\d{2}$/),
});

/**
 * GET /api/wishlist?month=YYYY-MM — item wishlist + log alert terkait.
 */
export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await syncWishlistStatusesForUser(session.user.id);

  const url = new URL(req.url);
  const monthYear = url.searchParams.get("month") ?? getMonthYear();

  const budget = await prisma.monthlyBudget.findUnique({
    where: {
      userId_monthYear: { userId: session.user.id, monthYear },
    },
    include: { necessities: true },
  });

  if (!budget) {
    return NextResponse.json({ items: [], monthYear, cleanBalance: 0, budgetId: null });
  }

  const amounts = budget.necessities.map((n) => n.amount);
  const cleanBalance = computeCleanBalance(budget.totalIncome, amounts);

  const items = await prisma.wishlistItem.findMany({
    where: { userId: session.user.id, budgetId: budget.id },
    orderBy: { createdAt: "desc" },
    include: {
      alertLogs: {
        orderBy: { createdAt: "desc" },
        take: 3,
      },
    },
  });

  return NextResponse.json({
    monthYear,
    budgetId: budget.id,
    cleanBalance,
    items,
  });
}

/**
 * POST /api/wishlist — tambah item; hitung timer server-side + simpan alert.
 */
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await syncWishlistStatusesForUser(session.user.id);

  try {
    const json = await req.json();
    const parsed = createSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }
    const { name, price, monthYear } = parsed.data;

    const budget = await prisma.monthlyBudget.findUnique({
      where: {
        userId_monthYear: { userId: session.user.id, monthYear },
      },
      include: { necessities: true },
    });

    if (!budget) {
      return NextResponse.json(
        { error: "Atur budget untuk bulan ini terlebih dahulu" },
        { status: 400 },
      );
    }

    const amounts = budget.necessities.map((n) => n.amount);
    const cleanBalance = computeCleanBalance(budget.totalIncome, amounts);

    const { warnings, cautions, remaining } = evaluateBalanceAlerts(cleanBalance, price);
    const createdAt = new Date();
    const coolingOffEndsAt = getCoolingOffEndsAt(createdAt, price);

    const initialStatus =
      coolingOffEndsAt <= createdAt ? ("READY" as const) : ("PENDING_COOLING" as const);

    const item = await prisma.$transaction(async (tx) => {
      const w = await tx.wishlistItem.create({
        data: {
          userId: session.user.id,
          budgetId: budget.id,
          name: name.trim(),
          price,
          coolingOffEndsAt,
          status: initialStatus,
        },
      });

      const logs: { alertType: "WARNING" | "CAUTION"; message: string }[] = [];
      for (const message of warnings) {
        logs.push({ alertType: "WARNING", message });
      }
      for (const message of cautions) {
        logs.push({ alertType: "CAUTION", message });
      }

      for (const log of logs) {
        await tx.alertLog.create({
          data: {
            userId: session.user.id,
            wishlistItemId: w.id,
            alertType: log.alertType,
            message: log.message,
          },
        });
      }

      return tx.wishlistItem.findUniqueOrThrow({
        where: { id: w.id },
        include: {
          alertLogs: { orderBy: { createdAt: "desc" } },
        },
      });
    });

    return NextResponse.json({
      item,
      evaluation: {
        cleanBalance,
        remainingAfterPurchase: remaining,
        warnings,
        cautions,
      },
    });
  } catch {
    return NextResponse.json({ error: "Gagal menambah wishlist" }, { status: 500 });
  }
}
