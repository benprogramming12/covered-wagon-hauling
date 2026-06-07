import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendAdminNotification(quote: {
  name: string;
  email: string;
  phone: string;
  scheduledDate: string;
  scheduledTime: string;
  pickupAddress: string;
  dropoffAddress: string;
  cargoDescription: string;
}) {
  if (!process.env.SMTP_USER) return;
  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: process.env.NOTIFY_EMAIL,
    subject: `New Quote Request from ${quote.name}`,
    html: `
      <h2>New Quote Request — Covered Wagon Hauling LLC</h2>
      <p><strong>Name:</strong> ${quote.name}</p>
      <p><strong>Email:</strong> ${quote.email}</p>
      <p><strong>Phone:</strong> ${quote.phone}</p>
      <p><strong>Date/Time:</strong> ${quote.scheduledDate} at ${quote.scheduledTime}</p>
      <p><strong>Pickup:</strong> ${quote.pickupAddress}</p>
      <p><strong>Dropoff:</strong> ${quote.dropoffAddress}</p>
      <p><strong>Cargo:</strong> ${quote.cargoDescription}</p>
      <p><a href="${process.env.NEXTAUTH_URL}/admin">View in Dashboard →</a></p>
    `,
  });
}

export async function sendDepositRequest(
  customerEmail: string,
  customerName: string,
  paymentUrl: string,
  depositAmount: number,
  scheduledDate: string
) {
  if (!process.env.SMTP_USER) return;
  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: customerEmail,
    subject: "Covered Wagon Hauling — Your Quote is Ready",
    html: `
      <h2>Hi ${customerName},</h2>
      <p>Your quote is ready! To confirm your booking on <strong>${scheduledDate}</strong>, please pay the 50% deposit of <strong>$${depositAmount.toFixed(2)}</strong>.</p>
      <p><a href="${paymentUrl}" style="background:#C9960A;color:#fff;padding:12px 24px;text-decoration:none;border-radius:6px;display:inline-block;font-weight:bold;">Pay Deposit Now →</a></p>
      <p>The remaining balance will be collected after the job is completed.</p>
      <p>Questions? Call us anytime.</p>
      <p>— Covered Wagon Hauling LLC</p>
    `,
  });
}
