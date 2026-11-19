import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  ExternalLink,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  Sparkles,
} from 'lucide-react';
import { FORM_ENDPOINT, site } from '@/config/site';

type FormState = {
  name: string;
  phone: string;
  email: string;
  clientType: 'Individual' | 'Business';
  service: string;
  sampleDetails: string;
  preferredDateTime: string;
  message: string;
  honeypot: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

const SERVICE_OPTIONS = [
  'Fire Assay Gold Testing (Cupellation)',
  'Gold Purity Verification (18K – 24K)',
  'Jewelry Testing',
  'Bulk Gold Testing (Traders / Wholesalers)',
  'Gold Coin & Bullion Testing',
  'Scrap Gold Valuation & Direct Selling',
];

export const BookingContact: React.FC = () => {
  const [form, setForm] = useState<FormState>({
    name: '',
    phone: '',
    email: '',
    clientType: 'Individual',
    service: SERVICE_OPTIONS[0],
    sampleDetails: '',
    preferredDateTime: '',
    message: '',
    honeypot: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<'endpoint' | 'whatsapp' | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  const validate = (): FormErrors => {
    const next: FormErrors = {};
    if (!form.name.trim() || form.name.trim().length < 2) {
      next.name = 'Please enter your full name.';
    }
    if (!form.phone.trim() || !/^[+\d\s()-]{7,20}$/.test(form.phone.trim())) {
      next.phone = 'Please enter a valid phone or WhatsApp number.';
    }
    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      next.email = 'Please enter a valid email address.';
    }
    if (!form.sampleDetails.trim()) {
      next.sampleDetails =
        'Please specify your sample type or approximate weight (e.g., 250g scrap, 1kg bar).';
    }
    return next;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.honeypot) return;

    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);

    if (FORM_ENDPOINT) {
      try {
        const res = await fetch(FORM_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            name: form.name,
            phone: form.phone,
            email: form.email,
            clientType: form.clientType,
            service: form.service,
            sampleDetails: form.sampleDetails,
            preferredDateTime: form.preferredDateTime,
            message: form.message,
          }),
        });
        if (res.ok) {
          setSubmitted('endpoint');
          setSubmitting(false);
          return;
        }
      } catch {
        /* Fall back to WhatsApp below */
      }
    }

    const lines = [
      `*Appointment / Assay Request — ${site.name}*`,
      `• *Name:* ${form.name}`,
      `• *Client Type:* ${form.clientType}`,
      `• *Phone/WhatsApp:* ${form.phone}`,
      form.email ? `• *Email:* ${form.email}` : '',
      `• *Service:* ${form.service}`,
      `• *Sample / Weight:* ${form.sampleDetails}`,
      form.preferredDateTime ? `• *Preferred Date/Time:* ${form.preferredDateTime}` : '',
      form.message ? `• *Notes:* ${form.message}` : '',
    ]
      .filter(Boolean)
      .join('\n');

    const waUrl = `${site.contact.whatsapp}?text=${encodeURIComponent(lines)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
    setSubmitted('whatsapp');
    setSubmitting(false);
  };

  const inputBase =
    'mt-1.5 w-full rounded-xl border border-gold/30 bg-[#050505] px-4 py-3 text-sm text-white placeholder-gray-400 transition-all duration-300 focus:border-gold-light focus:outline-none focus:ring-2 focus:ring-gold/35 focus:shadow-gold-glow';

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="relative bg-[#000000] py-24 lg:py-32"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(255,90,31,0.13),transparent_60%),radial-gradient(ellipse_at_top_left,rgba(212,175,55,0.10),transparent_60%)]"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/35 bg-gold/10 px-3.5 py-1 text-xs font-mono uppercase tracking-[0.22em] text-gold-light">
            <Sparkles className="h-3.5 w-3.5 text-fire" />
            Section 07 · Book Assay or Scrap Valuation
          </span>
          <h2
            id="contact-heading"
            className="mt-4 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl"
          >
            Schedule Your Gold Test in Dubai Gold Souq
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-gray-300 sm:text-base">
            Book a priority furnace slot or walk into our ground-floor reception in the Regal Sky
            Gold building.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Left Column: Booking Form */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-gold/35 bg-[#111111]/95 p-6 sm:p-8 shadow-gold-glow backdrop-blur-xl">
              {submitted ? (
                <div role="status" aria-live="polite" className="py-10 text-center">
                  <span className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full border border-gold bg-gold/15 text-gold-light shadow-gold-glow">
                    <CheckCircle2 className="h-8 w-8" />
                  </span>
                  <h3 className="mt-5 font-display text-2xl font-bold text-white">
                    {submitted === 'endpoint'
                      ? 'Appointment Request Received'
                      : 'WhatsApp Booking Prepared'}
                  </h3>
                  <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-gray-300">
                    {submitted === 'endpoint'
                      ? 'Our laboratory reception team will confirm your assay slot shortly via phone or WhatsApp.'
                      : 'We opened a pre-filled WhatsApp message to our laboratory desk (+971 54 581 9443). Send the message to lock in your priority slot.'}
                  </p>
                  <div className="mt-6 flex flex-wrap justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => setSubmitted(null)}
                      className="rounded-full border border-gold/45 px-5 py-2.5 font-display text-xs font-semibold uppercase tracking-[0.16em] text-gold-light transition-colors hover:bg-gold hover:text-neutral-950"
                    >
                      Submit Another Request
                    </button>
                    <a
                      href={site.contact.tel}
                      className="rounded-full bg-gradient-to-r from-amber to-fire px-5 py-2.5 font-display text-xs font-bold uppercase tracking-[0.16em] text-white"
                    >
                      Call {site.contact.phoneDisplay}
                    </a>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate>
                  <div>
                    <span className="block font-mono text-xs uppercase tracking-[0.18em] text-gold-light">
                      Client Profile
                    </span>
                    <div
                      role="group"
                      aria-label="Client profile type"
                      className="mt-2 grid grid-cols-2 gap-2 rounded-xl border border-gold/25 bg-[#050505] p-1"
                    >
                      {(['Individual', 'Business'] as const).map((type) => {
                        const active = form.clientType === type;
                        return (
                          <button
                            key={type}
                            type="button"
                            aria-pressed={active}
                            onClick={() => setForm((f) => ({ ...f, clientType: type }))}
                            className={`rounded-lg py-2.5 font-display text-xs font-bold uppercase tracking-[0.16em] transition-all ${
                              active
                                ? 'bg-gradient-to-r from-gold-light to-amber text-neutral-950 shadow'
                                : 'text-gray-200 hover:text-white'
                            }`}
                          >
                            {type === 'Individual' ? 'Individual / Private' : 'Business / Trader'}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Honeypot field */}
                  <div className="sr-only" aria-hidden="true">
                    <label htmlFor="company_website">Company Website</label>
                    <input
                      id="company_website"
                      name="company_website"
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      value={form.honeypot}
                      onChange={(e) => setForm((f) => ({ ...f, honeypot: e.target.value }))}
                    />
                  </div>

                  <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="booking-name"
                        className="block text-xs font-medium text-white"
                      >
                        Full Name or Company <span className="text-fire">*</span>
                      </label>
                      <input
                        id="booking-name"
                        name="name"
                        type="text"
                        required
                        autoComplete="name"
                        placeholder="e.g. Tariq Al Mansoori"
                        value={form.name}
                        aria-invalid={Boolean(errors.name)}
                        aria-describedby={errors.name ? 'err-name' : undefined}
                        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                        className={inputBase}
                      />
                      {errors.name && (
                        <p id="err-name" role="alert" className="mt-1 text-xs text-amber">
                          {errors.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="booking-phone"
                        className="block text-xs font-medium text-white"
                      >
                        Phone / WhatsApp <span className="text-fire">*</span>
                      </label>
                      <input
                        id="booking-phone"
                        name="phone"
                        type="tel"
                        required
                        autoComplete="tel"
                        placeholder="+971 5X XXX XXXX"
                        value={form.phone}
                        aria-invalid={Boolean(errors.phone)}
                        aria-describedby={errors.phone ? 'err-phone' : undefined}
                        onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                        className={inputBase}
                      />
                      {errors.phone && (
                        <p id="err-phone" role="alert" className="mt-1 text-xs text-amber">
                          {errors.phone}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="booking-email"
                        className="block text-xs font-medium text-white"
                      >
                        Email Address (Optional)
                      </label>
                      <input
                        id="booking-email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        placeholder="you@company.ae"
                        value={form.email}
                        aria-invalid={Boolean(errors.email)}
                        aria-describedby={errors.email ? 'err-email' : undefined}
                        onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                        className={inputBase}
                      />
                      {errors.email && (
                        <p id="err-email" role="alert" className="mt-1 text-xs text-amber">
                          {errors.email}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="booking-service"
                        className="block text-xs font-medium text-white"
                      >
                        Required Service
                      </label>
                      <select
                        id="booking-service"
                        name="service"
                        value={form.service}
                        onChange={(e) => setForm((f) => ({ ...f, service: e.target.value }))}
                        className={inputBase}
                      >
                        {SERVICE_OPTIONS.map((opt) => (
                          <option key={opt} value={opt} className="bg-[#0a0a0a] text-white">
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="booking-sample"
                        className="block text-xs font-medium text-white"
                      >
                        Sample Type & Approx. Weight <span className="text-fire">*</span>
                      </label>
                      <input
                        id="booking-sample"
                        name="sampleDetails"
                        type="text"
                        required
                        placeholder="e.g. 1 kg cast bar, 180g 22K jewelry scrap"
                        value={form.sampleDetails}
                        aria-invalid={Boolean(errors.sampleDetails)}
                        aria-describedby={errors.sampleDetails ? 'err-sample' : undefined}
                        onChange={(e) => setForm((f) => ({ ...f, sampleDetails: e.target.value }))}
                        className={inputBase}
                      />
                      {errors.sampleDetails && (
                        <p id="err-sample" role="alert" className="mt-1 text-xs text-amber">
                          {errors.sampleDetails}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="booking-datetime"
                        className="block text-xs font-medium text-white"
                      >
                        Preferred Date & Time
                      </label>
                      <input
                        id="booking-datetime"
                        name="preferredDateTime"
                        type="text"
                        placeholder="e.g. Today 4:30 PM or Tomorrow Morning"
                        value={form.preferredDateTime}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, preferredDateTime: e.target.value }))
                        }
                        className={inputBase}
                      />
                    </div>
                  </div>

                  <div className="mt-5">
                    <label
                      htmlFor="booking-message"
                      className="block text-xs font-medium text-white"
                    >
                      Additional Instructions
                    </label>
                    <textarea
                      id="booking-message"
                      name="message"
                      rows={3}
                      placeholder="Let us know if you require full bar melting, drill sampling or urgent settlement..."
                      value={form.message}
                      onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                      className={inputBase}
                    />
                  </div>

                  <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="inline-flex min-h-[50px] items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-amber via-fire to-fire-deep px-8 py-3.5 font-display text-xs sm:text-sm font-bold uppercase tracking-[0.16em] text-white shadow-fire-glow transition-all duration-300 ease-luxe hover:-translate-y-0.5 hover:brightness-110 disabled:opacity-60"
                    >
                      <Send className="h-4 w-4" />
                      <span>
                        {submitting
                          ? 'Submitting...'
                          : FORM_ENDPOINT
                          ? 'Confirm Appointment'
                          : 'Book via Instant WhatsApp'}
                      </span>
                    </button>

                    <p className="text-xs text-gray-300">
                      Direct Lab Line:{' '}
                      <a href={site.contact.tel} className="font-semibold text-gold-light">
                        {site.contact.phoneDisplay}
                      </a>
                    </p>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Right Column: Direct Contact Cards + Click-to-Load Interactive Map Facade */}
          <div className="flex flex-col gap-8 lg:col-span-5">
            <div className="rounded-3xl border border-gold/35 bg-[#111111]/95 p-6 backdrop-blur-xl">
              <h3 className="font-display text-lg font-bold text-white">
                Direct Laboratory Desk — Dubai Gold Souq
              </h3>
              <p className="mt-1 text-xs text-gray-300">
                Ground Floor, Regal Sky Gold Building ({site.contact.geo.lat.toFixed(4)}° N,{' '}
                {site.contact.geo.lng.toFixed(4)}° E)
              </p>

              <ul className="mt-5 space-y-3.5 text-sm">
                <li className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-light" />
                  <div>
                    <p className="font-medium text-white">{site.contact.address.line1}</p>
                    <p className="text-xs text-gray-300">
                      {site.contact.address.line2}, {site.contact.address.city},{' '}
                      {site.contact.address.country}
                    </p>
                    <a
                      href={site.contact.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-gold-light hover:text-amber"
                    >
                      <span>Open in Google Maps</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </li>

                <li className="flex items-center gap-3">
                  <Phone className="h-4 w-4 shrink-0 text-gold-light" />
                  <a
                    href={site.contact.tel}
                    className="font-medium text-white hover:text-gold-light"
                  >
                    {site.contact.phoneDisplay}
                  </a>
                </li>

                <li className="flex items-center gap-3">
                  <MessageCircle className="h-4 w-4 shrink-0 text-gold-light" />
                  <a
                    href={site.contact.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-white hover:text-gold-light"
                  >
                    WhatsApp Lab Desk ({site.contact.phoneDisplay})
                  </a>
                </li>

                <li className="flex items-center gap-3">
                  <Mail className="h-4 w-4 shrink-0 text-gold-light" />
                  <a
                    href={`mailto:${site.contact.email}`}
                    className="font-medium text-white hover:text-gold-light"
                  >
                    {site.contact.email}
                  </a>
                </li>

                <li className="flex items-start gap-3 border-t border-white/10 pt-3">
                  <Clock className="mt-0.5 h-4 w-4 shrink-0 text-gold-light" />
                  <div className="text-xs text-gray-300">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-white">Laboratory Hours</p>
                      {site.openingHours.isPlaceholder && (
                        <span className="rounded-full border border-amber/45 bg-amber/15 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-amber">
                          Placeholder · Confirm
                        </span>
                      )}
                    </div>
                    {site.openingHours.display.map((row) => (
                      <p key={row.days} className="mt-0.5">
                        {row.days}: <span className="text-gold-light">{row.hours}</span>
                      </p>
                    ))}
                  </div>
                </li>
              </ul>
            </div>

            {/* Click-to-Load Interactive Map Facade */}
            <div className="relative overflow-hidden rounded-3xl border border-gold/35 bg-[#111111] shadow-gold-glow">
              {mapLoaded ? (
                <iframe
                  src={site.contact.mapEmbed}
                  title="Precise Gold Testing Laboratory in Regal Sky Gold Building, Dubai Gold Souq"
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  className="h-72 w-full border-0"
                />
              ) : (
                <div className="relative flex h-72 flex-col items-center justify-center bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.18),rgba(5,5,5,0.96)_75%)] p-6 text-center">
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 opacity-25"
                    style={{
                      backgroundImage:
                        'linear-gradient(to right, rgba(212,175,55,0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(212,175,55,0.2) 1px, transparent 1px)',
                      backgroundSize: '32px 32px',
                    }}
                  />
                  <span className="relative inline-flex h-12 w-12 items-center justify-center rounded-full border border-gold bg-gold/15 text-gold-light shadow-gold-glow">
                    <MapPin className="h-5 w-5" />
                  </span>
                  <p className="relative mt-3 font-display text-base font-bold text-white">
                    Precise Gold Testing Laboratory
                  </p>
                  <p className="relative mt-1 text-xs text-gray-300">
                    Regal Sky Gold Building · Dubai Gold Souq ({site.contact.geo.lat},{' '}
                    {site.contact.geo.lng})
                  </p>

                  <div className="relative mt-4 flex flex-wrap items-center justify-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => setMapLoaded(true)}
                      className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-gradient-to-r from-gold-light to-amber px-5 py-2.5 font-display text-xs font-bold uppercase tracking-[0.15em] text-neutral-950 shadow-gold-glow transition-transform duration-300 ease-luxe hover:-translate-y-0.5"
                    >
                      <MapPin className="h-3.5 w-3.5" />
                      <span>Load Interactive Map</span>
                    </button>

                    <a
                      href={site.contact.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full border border-gold/45 bg-[#050505]/85 px-4 py-2.5 font-display text-xs font-semibold uppercase tracking-[0.14em] text-gold-light transition-colors hover:border-gold"
                    >
                      <span>Directions</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
