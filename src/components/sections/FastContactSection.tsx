import React, { useState } from 'react';
import { CheckCircle2, ExternalLink, Loader2, Mail, MapPin, Phone, Send } from 'lucide-react';
import { site } from '@/config/site';

export const FastContactSection: React.FC = () => {
  const services = site.hero3DCards.map((c) => c.title);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [service, setService] = useState(services[0]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [mapLoaded, setMapLoaded] = useState(false);

  // Send inquiry via PHP backend endpoint (/contact.php)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || (!phone.trim() && !email.trim())) {
      setError('Please provide your name and at least a phone number or email address.');
      return;
    }
    setError('');
    setSuccessMessage('');
    setSubmitting(true);

    const payload = {
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      service: service,
      message: message.trim(),
    };

    try {
      const response = await fetch('/contact.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json().catch(() => null);

      if (response.ok && result?.success) {
        setSuccessMessage(
          result.message ||
            'Thank you! Your inquiry has been sent to info@precisegoldlab.com. Our team will contact you shortly.'
        );
        setName('');
        setPhone('');
        setEmail('');
        setMessage('');
      } else {
        // Fallback: If running in static preview without a local PHP server, open email client directly
        const emailSubject = encodeURIComponent(`Gold Testing Inquiry: ${service} - ${name.trim()}`);
        const emailBody = encodeURIComponent(
          `Hello Precise Gold Laboratory,\n\n` +
          `• Name: ${name.trim()}\n` +
          `• Phone: ${phone.trim() || 'N/A'}\n` +
          `• Email: ${email.trim() || 'N/A'}\n` +
          `• Service: ${service}\n` +
          `• Message: ${message.trim() || 'General inquiry'}\n`
        );
        window.location.href = `mailto:${site.contact.email}?subject=${emailSubject}&body=${emailBody}`;
        setSuccessMessage(`Opening your email client to dispatch directly to ${site.contact.email}...`);
      }
    } catch {
      // Network or PHP endpoint unavailable (e.g. running on Vite localhost without PHP)
      const emailSubject = encodeURIComponent(`Gold Testing Inquiry: ${service} - ${name.trim()}`);
      const emailBody = encodeURIComponent(
        `Hello Precise Gold Laboratory,\n\n` +
        `• Name: ${name.trim()}\n` +
        `• Phone: ${phone.trim() || 'N/A'}\n` +
        `• Email: ${email.trim() || 'N/A'}\n` +
        `• Service: ${service}\n` +
        `• Message: ${message.trim() || 'General inquiry'}\n`
      );
      window.location.href = `mailto:${site.contact.email}?subject=${emailSubject}&body=${emailBody}`;
      setSuccessMessage(`Opening your email client to dispatch directly to ${site.contact.email}...`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleWhatsAppDirect = () => {
    if (!name.trim()) {
      setError('Please enter your name before connecting on WhatsApp.');
      return;
    }
    setError('');
    const text = [
      `Hello Precise Gold Laboratory LLC,`,
      `Name: ${name.trim()}`,
      phone.trim() ? `Phone: ${phone.trim()}` : '',
      `Service: ${service}`,
      message.trim() ? `Message: ${message.trim()}` : '',
    ]
      .filter(Boolean)
      .join('\n');

    const waUrl = `https://wa.me/${site.contact.whatsappNumber}?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="relative bg-[#FAF8F5] py-28 lg:py-36 text-[#111111]"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-[#9A7722]">
            Direct Contact &amp; Location
          </span>
          <h2
            id="contact-heading"
            className="mt-3 font-display text-3xl font-bold tracking-tight text-[#111111] sm:text-4xl"
          >
            Connect with Our Laboratory
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#555555]">
            Walk into our Ground Floor Gold Souq facility, submit the form below to email our Zoho inbox (
            <a
              href={`mailto:${site.contact.email}`}
              className="font-semibold text-[#111111] underline decoration-[#D4AF37] underline-offset-4 hover:text-[#9A7722]"
            >
              {site.contact.email}
            </a>
            ), or chat with our assay desk on WhatsApp.
          </p>
        </div>

        {/* 2-Column Split: PHP Contact Form + Map & Location Card */}
        <div className="mt-16 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-start">
          {/* Left: Contact Form */}
          <div className="lg:col-span-7 rounded-3xl border border-black/10 bg-[#FFFFFF] p-8 sm:p-12 shadow-[0_20px_50px_-20px_rgba(17,17,17,0.08)]">
            <h3 className="font-display text-xl font-bold text-[#111111]">
              Send Laboratory Inquiry
            </h3>
            <p className="mt-1 text-xs text-[#555555]">
              Processed via PHP mail handler directly to {site.contact.email}.
            </p>

            <form onSubmit={handleSubmit} className="mt-8">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="fast-name"
                    className="block text-xs font-bold uppercase tracking-[0.14em] text-[#111111]"
                  >
                    Your Name *
                  </label>
                  <input
                    id="fast-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Tariq Al Mansoori"
                    className="mt-2 w-full rounded-xl border border-black/15 bg-[#FAF8F5] px-4 py-3.5 text-sm text-[#111111] placeholder:text-[#555555]/60 focus:border-[#D4AF37] focus:bg-[#FFFFFF] focus:outline-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor="fast-phone"
                    className="block text-xs font-bold uppercase tracking-[0.14em] text-[#111111]"
                  >
                    Phone / WhatsApp *
                  </label>
                  <input
                    id="fast-phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+971 5X XXX XXXX"
                    className="mt-2 w-full rounded-xl border border-black/15 bg-[#FAF8F5] px-4 py-3.5 text-sm text-[#111111] placeholder:text-[#555555]/60 focus:border-[#D4AF37] focus:bg-[#FFFFFF] focus:outline-none"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label
                  htmlFor="fast-email"
                  className="block text-xs font-bold uppercase tracking-[0.14em] text-[#111111]"
                >
                  Email Address (Optional)
                </label>
                <input
                  id="fast-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="yourname@company.com"
                  className="mt-2 w-full rounded-xl border border-black/15 bg-[#FAF8F5] px-4 py-3.5 text-sm text-[#111111] placeholder:text-[#555555]/60 focus:border-[#D4AF37] focus:bg-[#FFFFFF] focus:outline-none"
                />
              </div>

              <div className="mt-6">
                <label
                  htmlFor="fast-service"
                  className="block text-xs font-bold uppercase tracking-[0.14em] text-[#111111]"
                >
                  Select Service
                </label>
                <select
                  id="fast-service"
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-black/15 bg-[#FAF8F5] px-4 py-3.5 text-sm font-medium text-[#111111] focus:border-[#D4AF37] focus:bg-[#FFFFFF] focus:outline-none"
                >
                  {services.map((s) => (
                    <option key={s} value={s} className="bg-[#FFFFFF] text-[#111111]">
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-6">
                <label
                  htmlFor="fast-message"
                  className="block text-xs font-bold uppercase tracking-[0.14em] text-[#111111]"
                >
                  Message / Sample Notes
                </label>
                <textarea
                  id="fast-message"
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Sample type, approximate weight, scrap gold lot, or required turnaround..."
                  className="mt-2 w-full rounded-xl border border-black/15 bg-[#FAF8F5] px-4 py-3.5 text-sm text-[#111111] placeholder:text-[#555555]/60 focus:border-[#D4AF37] focus:bg-[#FFFFFF] focus:outline-none"
                />
              </div>

              {error && (
                <p role="alert" className="mt-4 text-xs font-semibold text-red-600">
                  {error}
                </p>
              )}

              {successMessage && !error && (
                <div className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-xs font-semibold text-emerald-800">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
                  <span>{successMessage}</span>
                </div>
              )}

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex min-h-[48px] items-center gap-2.5 rounded-full bg-[#111111] px-7 py-3.5 font-display text-xs font-bold uppercase tracking-[0.16em] text-[#FFFFFF] shadow-sm transition-all duration-300 ease-luxe hover:-translate-y-0.5 hover:bg-[#D4AF37] hover:text-[#111111] disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>Sending Email...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Send to info@precisegoldlab.com</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleWhatsAppDirect}
                  className="inline-flex min-h-[48px] items-center gap-2.5 rounded-full border border-[#25D366] bg-[#25D366]/10 px-6 py-3.5 font-display text-xs font-bold uppercase tracking-[0.14em] text-[#1e8346] transition-all duration-300 ease-luxe hover:-translate-y-0.5 hover:bg-[#25D366] hover:text-white"
                >
                  <Phone className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Chat on WhatsApp</span>
                </button>
              </div>
            </form>
          </div>

          {/* Right: Location & Official Contact Channels */}
          <div className="lg:col-span-5 flex flex-col justify-between rounded-3xl border border-black/10 bg-[#FFFFFF] p-8 sm:p-10 shadow-[0_20px_50px_-20px_rgba(17,17,17,0.08)]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-[#FAF8F5] px-3.5 py-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-[#9A7722]">
                <MapPin className="h-3.5 w-3.5 text-[#D4AF37]" aria-hidden="true" />
                <span>Ground Floor · Dubai Gold Souq</span>
              </div>

              <h3 className="mt-4 font-display text-2xl font-bold text-[#111111]">
                Precise Gold Laboratory LLC
              </h3>
              <p className="mt-1.5 text-sm text-[#555555]">
                Ground Floor, Regal Sky Gold Building, Dubai Gold Souq, Deira, Dubai, UAE
              </p>

              <div className="mt-6 space-y-4 border-y border-black/10 py-5 text-sm">
                <a
                  href={`mailto:${site.contact.email}`}
                  className="flex items-center gap-3 font-semibold text-[#111111] transition-colors hover:text-[#9A7722]"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#D4AF37]/15 text-[#9A7722]">
                    <Mail className="h-4 w-4 text-[#D4AF37]" aria-hidden="true" />
                  </div>
                  <div>
                    <div className="text-[11px] font-mono uppercase tracking-wider text-[#777777]">Official Email</div>
                    <span className="text-sm">{site.contact.email}</span>
                  </div>
                </a>

                <a
                  href={site.contact.tel}
                  className="flex items-center gap-3 font-semibold text-[#111111] transition-colors hover:text-[#9A7722]"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#D4AF37]/15 text-[#9A7722]">
                    <Phone className="h-4 w-4 text-[#D4AF37]" aria-hidden="true" />
                  </div>
                  <div>
                    <div className="text-[11px] font-mono uppercase tracking-wider text-[#777777]">Direct Telephone</div>
                    <span className="text-sm">{site.contact.phoneDisplay}</span>
                  </div>
                </a>
              </div>
            </div>

            {/* Facade Google Maps Embed */}
            <div className="mt-8 overflow-hidden rounded-2xl border border-black/10 bg-[#FAF8F5]">
              {!mapLoaded ? (
                <div className="relative flex aspect-video w-full flex-col items-center justify-center bg-[#EAE5DA] p-6 text-center">
                  <MapPin className="h-8 w-8 text-[#D4AF37]" aria-hidden="true" />
                  <p className="mt-2 font-display text-sm font-bold text-[#111111]">
                    Interactive Map Facade
                  </p>
                  <p className="mt-1 text-xs text-[#555555]">
                    Click to load Google Maps for Dubai Gold Souq
                  </p>
                  <button
                    type="button"
                    onClick={() => setMapLoaded(true)}
                    className="mt-4 rounded-full bg-[#111111] px-5 py-2 font-display text-xs font-bold uppercase tracking-[0.14em] text-[#FFFFFF] transition-all hover:bg-[#D4AF37] hover:text-[#111111]"
                  >
                    Load Interactive Map
                  </button>
                </div>
              ) : (
                <iframe
                  title="Precise Gold Laboratory Location Map"
                  src={site.contact.mapEmbed}
                  width="100%"
                  height="260"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="h-[260px] w-full"
                />
              )}
              <div className="flex items-center justify-between bg-[#FFFFFF] p-3 text-xs">
                <span className="font-mono text-[#555555]">25.2710° N, 55.2966° E</span>
                <a
                  href={site.contact.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-semibold text-[#9A7722] hover:text-[#111111]"
                >
                  <span>Open in Google Maps</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
