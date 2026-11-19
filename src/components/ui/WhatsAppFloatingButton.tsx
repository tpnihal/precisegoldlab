import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X } from 'lucide-react';
import { site } from '@/config/site';

export const WhatsAppFloatingButton: React.FC = () => {
  const [showTooltip, setShowTooltip] = useState(false);

  // WhatsApp click handler that opens with a pre-filled professional inquiry message
  const prefilledMessage = encodeURIComponent(
    'Hello Precise Gold Laboratory, I would like to inquire about gold testing / fire assay services.'
  );
  const whatsappUrl = `https://wa.me/${site.contact.whatsappNumber}?text=${prefilledMessage}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-auto">
      {/* Tooltip Pill */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="mb-3 mr-1 max-w-[210px] rounded-2xl bg-[#0F172A] border border-[#25D366]/30 px-3.5 py-2.5 shadow-2xl text-xs text-white"
          >
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="font-semibold text-[#25D366] flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#25D366] animate-pulse" />
                Online Now
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowTooltip(false);
                }}
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Dismiss message"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
            <p className="text-gray-300 leading-tight">
              Chat instantly on WhatsApp for quick valuation & fire assay quotes.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button */}
      <motion.a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Precise Gold Laboratory on WhatsApp"
        onMouseEnter={() => setShowTooltip(true)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="group relative flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_8px_28px_rgba(37,211,102,0.45)] ring-2 ring-white/20 transition-all duration-300 hover:bg-[#20bd5a] hover:shadow-[0_12px_36px_rgba(37,211,102,0.6)] focus:outline-none focus:ring-4 focus:ring-[#25D366]/40"
      >
        {/* Soft pulsing ring */}
        <span
          className="absolute inset-0 -z-10 rounded-full bg-[#25D366]/40 animate-ping opacity-60"
          style={{ animationDuration: '2.5s' }}
        />

        {/* WhatsApp Icon */}
        <svg
          viewBox="0 0 24 24"
          className="h-7 w-7 sm:h-8 sm:w-8 fill-current drop-shadow-sm transition-transform duration-300 group-hover:scale-110"
          aria-hidden="true"
        >
          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.04 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19.01L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.81 13.47 3.81 11.91C3.81 7.37 7.5 3.67 12.05 3.67M9.05 7.42C8.84 7.42 8.5 7.5 8.21 7.81C7.93 8.12 7.13 8.87 7.13 10.4C7.13 11.93 8.25 13.41 8.4 13.62C8.56 13.82 10.6 16.97 13.72 18.32C14.46 18.64 15.04 18.83 15.49 18.97C16.23 19.21 16.91 19.17 17.44 19.09C18.03 19 19.27 18.34 19.53 17.61C19.79 16.88 19.79 16.26 19.71 16.13C19.63 16 19.42 15.93 19.11 15.77C18.8 15.62 17.27 14.87 16.98 14.77C16.7 14.66 16.49 14.61 16.28 14.92C16.07 15.23 15.47 15.93 15.29 16.14C15.11 16.34 14.93 16.37 14.62 16.21C14.31 16.06 13.31 15.73 12.12 14.67C11.2 13.85 10.58 12.84 10.4 12.53C10.22 12.22 10.38 12.06 10.54 11.9C10.68 11.76 10.85 11.53 11.01 11.35C11.16 11.16 11.22 11.03 11.32 10.83C11.42 10.62 11.37 10.44 11.29 10.29C11.22 10.13 10.6 8.61 10.34 7.99C10.09 7.39 9.84 7.47 9.65 7.46C9.48 7.46 9.27 7.42 9.05 7.42Z" />
        </svg>

        {/* Small notification badge */}
        <span className="absolute top-0 right-0 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-500 ring-2 ring-white text-[9px] font-bold text-white">
          1
        </span>
      </motion.a>
    </div>
  );
};
