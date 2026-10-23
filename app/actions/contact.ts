"use server";

import { Resend } from "resend";

export type ContactField = "name" | "email" | "message";

export type ContactState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Partial<Record<ContactField, string>>;
  /** Echoed back on error so the form can keep what the visitor typed. */
  values?: Partial<Record<ContactField, string>>;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const FALLBACK_TO = "mangalarapuarvind@gmail.com";
const FALLBACK_FROM = "Portfolio <onboarding@resend.dev>";

/** Single-line fields: strip newlines so they can never inject extra headers. */
const singleLine = (value: FormDataEntryValue | null, max: number) =>
  String(value ?? "").replace(/[\r\n]+/g, " ").trim().slice(0, max);

export async function sendContactMessage(_previous: ContactState, formData: FormData): Promise<ContactState> {
  // Honeypot: real visitors never see or fill this field.
  if (String(formData.get("company") ?? "").trim()) {
    return { status: "success", message: "Thanks! Your message is on its way." };
  }

  const name = singleLine(formData.get("name"), 80);
  const email = singleLine(formData.get("email"), 120);
  const message = String(formData.get("message") ?? "").trim().slice(0, 2000);
  const values = { name, email, message };

  const fieldErrors: ContactState["fieldErrors"] = {};
  if (name.length < 2) fieldErrors.name = "Please enter your name.";
  if (!EMAIL_PATTERN.test(email)) fieldErrors.email = "Please enter a valid email address.";
  if (message.length < 10) fieldErrors.message = "Tell me a little more (at least 10 characters).";
  if (Object.keys(fieldErrors).length) {
    return { status: "error", message: "Please fix the highlighted fields.", fieldErrors, values };
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is not set. Contact form cannot send email.");
    return {
      status: "error",
      message: "The contact form isn't connected yet. Please email me directly instead.",
      values,
    };
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: process.env.CONTACT_FROM_EMAIL ?? FALLBACK_FROM,
      to: process.env.CONTACT_TO_EMAIL ?? FALLBACK_TO,
      replyTo: email,
      subject: `Portfolio message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
    });

    if (error) {
      console.error("Resend rejected the message:", error);
      return { status: "error", message: "Sending failed. Please try again or email me directly.", values };
    }

    return { status: "success", message: "Thanks! Your message is on its way. I usually reply within a day." };
  } catch (error) {
    console.error("Contact form error:", error);
    return { status: "error", message: "Sending failed. Please try again or email me directly.", values };
  }
}
