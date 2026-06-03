export const paystackConfig = {
  secretKey: process.env.PAYSTACK_SECRET_KEY as string,
  publicKey: process.env.PAYSTACK_PUBLIC_KEY as string,
  baseUrl: "https://api.paystack.co",
};

export async function initializePayment(data: {
  email: string;
  amount: number; // in kobo
  reference: string;
  callback_url: string;
  metadata?: any;
}) {
  const response = await fetch(`${paystackConfig.baseUrl}/transaction/initialize`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${paystackConfig.secretKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok || !result.status) {
    throw new Error(result.message || "Failed to initialize payment");
  }

  return result.data;
}

export async function verifyPayment(reference: string) {
  const response = await fetch(`${paystackConfig.baseUrl}/transaction/verify/${reference}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${paystackConfig.secretKey}`,
    },
  });

  const result = await response.json();

  if (!response.ok || !result.status) {
    throw new Error(result.message || "Failed to verify payment");
  }

  return result.data;
}
