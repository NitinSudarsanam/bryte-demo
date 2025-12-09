"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import Header from "@/app/components/header";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSent, setIsSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setIsSent(false);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      if (res.ok) {
        setIsSent(true);
        setName("");
        setEmail("");
        setMessage("");
        setIsDialogOpen(false);
      }
    } catch (err) {
      // Error handling - could show error state if needed
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      <Header />
      <div style={{ minHeight: '100vh', padding: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ maxWidth: '600px', width: '100%' }}>
        <div style={{
          background: 'var(--darkgreen)',
          borderRadius: '6px',
          padding: '22px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '22px' }}>
            <h1 style={{
              fontSize: '24px',
              fontWeight: '500',
              color: 'var(--mauve-3)',
              marginBottom: '8px',
              lineHeight: '1.2'
            }}>
              Contact Us
            </h1>
            <p style={{
              color: 'var(--mauve-3)',
              lineHeight: '1.4'
            }}>
              We'd love to hear from you!
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '22px' }}>
            <div>
              <label htmlFor="name" style={{
                display: 'block',
                fontWeight: '500',
                color: 'var(--mauve-3)',
                marginBottom: '8px',
                lineHeight: '1.2',
                fontSize: '15px'
              }}>
                Name
              </label>
              <input
                id="name"
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '6px',
                  border: '1px solid var(--mauve-6)',
                  fontSize: '15px',
                  lineHeight: '1',
                  outline: 'none',
                  background: 'var(--background)',
                  color: 'var(--foreground)',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--violet-9)';
                  e.target.style.backgroundColor = 'var(--mauve-3)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--mauve-6)';
                  e.target.style.backgroundColor = 'var(--background)';
                }}
              />
            </div>

            <div>
              <label htmlFor="email" style={{
                display: 'block',
                fontWeight: '500',
                color: 'var(--mauve-3)',
                marginBottom: '8px',
                lineHeight: '1.2',
                fontSize: '15px'
              }}>
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '6px',
                  border: '1px solid var(--mauve-6)',
                  fontSize: '15px',
                  lineHeight: '1',
                  outline: 'none',
                  background: 'var(--background)',
                  color: 'var(--foreground)',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--violet-9)';
                  e.target.style.backgroundColor = 'var(--mauve-3)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--mauve-6)';
                  e.target.style.backgroundColor = 'var(--background)';
                }}
              />
            </div>

            <div>
              <label htmlFor="message" style={{
                display: 'block',
                fontWeight: '500',
                color: 'var(--mauve-3)',
                marginBottom: '8px',
                lineHeight: '1.2',
                fontSize: '15px'
              }}>
                Message
              </label>
              <textarea
                id="message"
                placeholder="Tell us what's on your mind..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={4}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '6px',
                  border: '1px solid var(--mauve-6)',
                  fontSize: '15px',
                  lineHeight: '1.4',
                  outline: 'none',
                  resize: 'none',
                  background: 'var(--background)',
                  color: 'var(--foreground)',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--violet-9)';
                  e.target.style.backgroundColor = 'var(--mauve-3)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--mauve-6)';
                  e.target.style.backgroundColor = 'var(--background)';
                }}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || isSent}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '6px',
                fontSize: '15px',
                lineHeight: '1',
                fontWeight: '500',
                border: 'none',
                cursor: (isSubmitting || isSent) ? 'not-allowed' : 'pointer',
                background: isSubmitting ? 'var(--mauve-9)' : '#FCE794',
                color: '#6E7E4A',
                transition: 'background-color 0.2s, opacity 0.2s',
                boxSizing: 'border-box',
                textAlign: 'center'
              }}
              onMouseEnter={(e) => {
                if (!isSubmitting && !isSent) {
                  e.currentTarget.style.opacity = '0.9';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSubmitting && !isSent) {
                  e.currentTarget.style.opacity = '1';
                }
              }}
            >
              {isSubmitting ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6E7E4A' }}>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5" style={{ color: '#6E7E4A' }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </span>
              ) : isSent ? (
                "Message Sent!"
              ) : (
                "Send Message"
              )}
            </button>
          </form>
        </div>
      </div>
      </div>
    </div>
  );
}
