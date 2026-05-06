import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { computeCleanBalance } from "@/lib/budget-math";
import { getMonthYear } from "@/lib/month";
import { z } from "zod";

const necessitySchema = z.object({
  name: z.string().min(1).max(120),
  amount: z.number().int().min(0),
});

const upsertSchema = z.object({
  monthYear: z.string().regex(/^\d{4}-\d{2}$/, "Format bulan harus YYYY-MM"),
  totalIncome: z.number().int().min(0),
  necessities: z.array(necessitySchema).max(50),
});

/**
 * GET /api/budgets?month=YYYY-MM — budget + kebutuhan + saldo bersih.
 */
export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const monthYear = url.searchParams.get("month") ?? getMonthYear();

  const budget = await prisma.monthlyBudget.findUnique({
    where: {
      userId_monthYear: { userId: session.user.id, monthYear },
    },
    include: { necessities: true },
  });

  if (!budget) {
    return NextResponse.json({
      monthYear,
      budget: null,
      cleanBalance: 0,
      totalNecessities: 0,
    });
  }

  const amounts = budget.necessities.map((n) => n.amount);
  const cleanBalance = computeCleanBalance(budget.totalIncome, amounts);
  const totalNecessities = amounts.reduce((a, b) => a + b, 0);

  return NextResponse.json({
    monthYear,
    budget: {
      id: budget.id,
      totalIncome: budget.totalIncome,
      necessities: budget.necessities,
    },
    cleanBalance,
    totalNecessities,
  });
}

/**
 * POST /api/budgets — upsert budget bulanan + ganti daftar kebutuhan.
 */
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const json = await req.json();
    const parsed = upsertSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }
    const { monthYear, totalIncome, necessities } = parsed.data;

    const budget = await prisma.$transaction(async (tx) => {
      const b = await tx.monthlyBudget.upsert({
        where: {
          userId_monthYear: { userId: session.user.id, monthYear },
        },
        create: {
          userId: session.user.id,
          monthYear,
          totalIncome,
        },
        update: { totalIncome },
      });

      await tx.necessity.deleteMany({ where: { budgetId: b.id } });
      if (necessities.length > 0) {
        await tx.necessity.createMany({
          data: necessities.map((n) => ({
            budgetId: b.id,
            name: n.name.trim(),
            amount: n.amount,
          })),
        });
      }

      return tx.monthlyBudget.findUniqueOrThrow({
        where: { id: b.id },
        include: { necessities: true },
      });
    });

    const amounts = budget.necessities.map((n) => n.amount);
    const cleanBalance = computeCleanBalance(budget.totalIncome, amounts);

    return NextResponse.json({
      budget: {
        id: budget.id,
        totalIncome: budget.totalIncome,
        necessities: budget.necessities,
      },
      monthYear,
      cleanBalance,
      totalNecessities: amounts.reduce((a, b) => a + b, 0),
    });
  } catch {
    return NextResponse.json({ error: "Gagal menyimpan budget" }, { status: 500 });
  }
}
