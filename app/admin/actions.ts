"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { createAdminSession, clearAdminSession, getAdminSession } from "@/lib/admin-auth";
import type { AffiliateNetwork, AdSlot, AirportStatus } from "@prisma/client";

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  const user = await db.adminUser.findUnique({ where: { email } });
  if (!user) redirect("/admin/login?error=1");

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) redirect("/admin/login?error=1");

  await createAdminSession({ userId: user.id, email: user.email, role: user.role });
  redirect("/admin");
}

export async function logoutAction() {
  await clearAdminSession();
  redirect("/admin/login");
}

async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  return session;
}

export async function updateAirportStatus(airportId: string, status: AirportStatus) {
  await requireAdmin();
  await db.airport.update({ where: { id: airportId }, data: { status } });
  revalidatePath("/admin/airports");
}

export async function updateAirportCore(airportId: string, formData: FormData) {
  await requireAdmin();
  await db.airport.update({
    where: { id: airportId },
    data: {
      name: String(formData.get("name")),
      overview: String(formData.get("overview")),
      metaTitle: String(formData.get("metaTitle") || "") || null,
      metaDescription: String(formData.get("metaDescription") || "") || null,
      websiteUrl: String(formData.get("websiteUrl") || "") || null,
      heroImageUrl: String(formData.get("heroImageUrl") || "") || null,
    },
  });
  revalidatePath("/admin/airports");
  revalidatePath("/airport", "layout");
  revalidatePath("/");
  revalidatePath("/search");
}

export async function updateAffiliateConfig(network: AffiliateNetwork, formData: FormData) {
  await requireAdmin();
  const affiliateId = String(formData.get("affiliateId") || "") || null;
  const isEnabled = formData.get("isEnabled") === "on";
  await db.affiliateConfig.upsert({
    where: { network },
    update: { affiliateId, isEnabled },
    create: { network, affiliateId, isEnabled },
  });
  revalidatePath("/admin/affiliates");
}

export async function updateAdPlacement(slot: AdSlot, formData: FormData) {
  await requireAdmin();
  const adUnitId = String(formData.get("adUnitId") || "") || null;
  const isEnabled = formData.get("isEnabled") === "on";
  await db.adPlacement.upsert({
    where: { slot },
    update: { adUnitId, isEnabled },
    create: { slot, adUnitId, isEnabled },
  });
  revalidatePath("/admin/ads");
}

export async function createFaq(airportId: string, formData: FormData) {
  await requireAdmin();
  await db.fAQ.create({
    data: {
      airportId,
      question: String(formData.get("question")),
      answer: String(formData.get("answer")),
    },
  });
  revalidatePath(`/admin/airports/${airportId}`);
}

export async function deleteFaq(faqId: string, airportId: string) {
  await requireAdmin();
  await db.fAQ.delete({ where: { id: faqId } });
  revalidatePath(`/admin/airports/${airportId}`);
}
