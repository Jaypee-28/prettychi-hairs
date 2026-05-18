import { auth } from "@/auth.node";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { sanitizeData } from "@/lib/utils";
import { AccountContent } from "@/components/shop/account-content";

export const metadata = {
  title: "My Account | Pretty Chi Hairs",
  description: "Manage your Pretty Chi Hairs account and profile",
};

export default async function AccountPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/account");
  }

  const rawUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      createdAt: true,
    },
  });

  if (!rawUser) {
    redirect("/login");
  }

  const user = {
    ...sanitizeData(rawUser),
    createdAt: rawUser.createdAt.toISOString(),
  };

  return <AccountContent user={user} />;
}
