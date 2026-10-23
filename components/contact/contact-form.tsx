"use client";

import { useActionState, useId } from "react";
import { CheckCircle2, Loader2, Send, TriangleAlert } from "lucide-react";
import { sendContactMessage, type ContactState } from "@/app/actions/contact";

const initialState: ContactState = { status: "idle" };

export function ContactForm() {
  // React 19: pending flips while the server action runs, and the form
  // resets to defaultValue afterwards, so errors echo values back.
  const [state, formAction, pending] = useActionState(sendContactMessage, initialState);
  const id = useId();
  const errors = state.fieldErrors ?? {};
  const values = state.values ?? {};

  return (
    <form action={formAction} className="contact-form" noValidate aria-busy={pending} aria-describedby={`${id}-status`}>
      <div className="contact-form-head">
        <p className="section-kicker">Send a message</p>
        <h3>Tell me about your project or role.</h3>
      </div>

      <div className="contact-form-grid">
        <div className="field">
          <label htmlFor={`${id}-name`}>Name</label>
          <input
            id={`${id}-name`}
            name="name"
            type="text"
            autoComplete="name"
            required
            maxLength={80}
            defaultValue={values.name}
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={errors.name ? `${id}-name-error` : undefined}
          />
          {errors.name ? <span className="field-error" id={`${id}-name-error`}>{errors.name}</span> : null}
        </div>

        <div className="field">
          <label htmlFor={`${id}-email`}>Email</label>
          <input
            id={`${id}-email`}
            name="email"
            type="email"
            autoComplete="email"
            required
            maxLength={120}
            defaultValue={values.email}
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? `${id}-email-error` : undefined}
          />
          {errors.email ? <span className="field-error" id={`${id}-email-error`}>{errors.email}</span> : null}
        </div>

        <div className="field field-wide">
          <label htmlFor={`${id}-message`}>Message</label>
          <textarea
            id={`${id}-message`}
            name="message"
            rows={5}
            required
            maxLength={2000}
            defaultValue={values.message}
            placeholder="What are you building, and how can I help?"
            aria-invalid={errors.message ? true : undefined}
            aria-describedby={errors.message ? `${id}-message-error` : undefined}
          />
          {errors.message ? <span className="field-error" id={`${id}-message-error`}>{errors.message}</span> : null}
        </div>

        <div className="field-honeypot" aria-hidden="true">
          <label htmlFor={`${id}-company`}>Company</label>
          <input id={`${id}-company`} name="company" type="text" tabIndex={-1} autoComplete="off" />
        </div>
      </div>

      <div className="contact-form-footer">
        <button type="submit" className="hero-button primary" disabled={pending}>
          {pending
            ? <><Loader2 className="spin" aria-hidden="true" />Sending…</>
            : <>Send message<Send aria-hidden="true" /></>}
        </button>
        <p id={`${id}-status`} className={`form-status ${state.status}`} role="status" aria-live="polite">
          {state.status === "success" ? <><CheckCircle2 aria-hidden="true" />{state.message}</> : null}
          {state.status === "error" ? <><TriangleAlert aria-hidden="true" />{state.message}</> : null}
        </p>
      </div>
    </form>
  );
}
