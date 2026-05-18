import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const DEFAULT_FAQS = [
  {
    category: "Orders",
    question: "How do I place an order?",
    answer: "You can securely place an order by browsing our product collections, adding your desired items to the cart, and proceeding to our secure checkout page. We accept all major credit cards and Apple/Google Pay."
  },
  {
    category: "Orders",
    question: "Can I cancel my order?",
    answer: "Orders can be canceled within 2 hours of placement. Because we strive for lightning-fast dispatch, orders that have already entered the shipping process cannot be canceled but can be returned."
  },
  {
    category: "Delivery",
    question: "How long does delivery take?",
    answer: "Standard domestic delivery takes 3-5 business days. We also offer Express shipping at checkout, which typically arrives within 1-2 business days. Delivery times exclude processing weekends."
  },
  {
    category: "Delivery",
    question: "Do you ship internationally?",
    answer: "Yes, Pretty Chi Hairs ships globally! International shipping times vary between 7-14 business days depending on customs processing in your destination country."
  },
  {
    category: "Products",
    question: "Are your hairs 100% human?",
    answer: "Absolutely. All our bundles, closures, and wigs are crafted from 100% virgin human hair. We never mix synthetic fibers, ensuring a natural look that can be bleached, dyed, and heat-styled."
  },
  {
    category: "Products",
    question: "How long do they last?",
    answer: "With proper care and maintenance, our hair can last between 2 to 4 years. We recommend co-washing regularly and storing units on a mannequin head when not in use."
  },
  {
    category: "Booking",
    question: "How do I book a service?",
    answer: "Simply visit our Booking portal, select your desired aesthetic service, choose your preferred expert stylist, and lock in a date/time that works for your schedule."
  },
  {
    category: "Booking",
    question: "Can I reschedule my appointment?",
    answer: "Yes, you can reschedule up to 24 hours before your appointment time without any penalty. Rescheduling within 24 hours may incur a late-change fee."
  },
  {
    category: "Returns",
    question: "Do you accept returns?",
    answer: "Yes, we accept returns within 14 days of delivery. For sanitary reasons, the hair must be completely unaltered, unwashed, and the original hygiene ties must remain perfectly intact."
  },
  {
    category: "Returns",
    question: "What if I receive a damaged item?",
    answer: "If you receive a defective or damaged product, please contact us immediately at hello@prettychihairs.com with photos of the issue. We will expedite a replacement to you immediately."
  }
];

export async function POST() {
  try {
    const count = await prisma.fAQ.count();
    if (count > 0) {
      return NextResponse.json({ message: "Already seeded" });
    }

    await prisma.fAQ.createMany({
      data: DEFAULT_FAQS
    });

    return NextResponse.json({ success: true, seeded: DEFAULT_FAQS.length });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
