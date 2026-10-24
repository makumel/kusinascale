import React, { useState } from 'react';
import { X, Send, Sparkles, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface SuggestionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SuggestionModal: React.FC<SuggestionModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [businessType, setBusinessType] = useState('Carinderia / Turo-turo');
  const [recipeIdea, setRecipeIdea] = useState('');
  const [notes, setNotes] = useState('');

  // Invisible Honeypot Deception Trap
  // Automated spam scrapers fill every input field they encounter in DOM
  const [honeypotValue, setHoneypotValue] = useState('');

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // DECEPTION DEFENSE:
    // If the honeypot field has ANY content, a bot is detected.
    // We execute the deceptive response: show simulated success to trick the bot,
    // while silently dropping the payload so no spam pollutes our pipeline.
    if (honeypotValue && honeypotValue.trim() !== '') {
      setTimeout(() => {
        setIsSubmitting(false);
        setSubmitted(true);
      }, 600);
      return;
    }

    // Normal genuine human submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 700);
  };

  const handleResetAndClose = () => {
    setSubmitted(false);
    setName('');
    setContact('');
    setRecipeIdea('');
    setNotes('');
    setHoneypotValue('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-auto p-6 sm:p-8">
        {/* Close Button */}
        <button
          onClick={handleResetAndClose}
          type="button"
          aria-label="Isara ang modal"
          className="absolute top-5 right-5 p-2 text-stone-500 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded-full transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-stone-900">
              Maraming Salamat, Ka-Negosyo!
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-sm mx-auto">
              Natanggap namin ang iyong recipe suggestion. Pag-aaralan ng aming culinary &amp; costing
              team ang ingredients at breakdown para maisama sa susunod na KusinaScale update!
            </p>
            <div className="pt-2">
              <button
                onClick={handleResetAndClose}
                type="button"
                className="px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-medium text-sm transition-all cursor-pointer shadow-xs"
              >
                Bumalik sa KusinaScale
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="flex items-center gap-2 text-orange-600 text-xs font-semibold uppercase tracking-wider mb-1">
                <Sparkles className="w-4 h-4" />
                <span>Negosyo Community Request</span>
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">
                Mag-Suggest ng Recipe o Feature
              </h3>
              <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                May paborito ka bang ulam o palamig na gusto mong gawan ng detalyadong food costing at
                presyuhan? Ipadala sa amin!
              </p>
            </div>

            {/* INVISIBLE HONEYPOT TRAP (Anti-Bot Deception Defense) */}
            <div
              className="opacity-0 absolute -left-[9999px] h-0 w-0 overflow-hidden pointer-events-none"
              aria-hidden="true"
            >
              <label htmlFor="website_url_hp">Do not fill this field if human</label>
              <input
                id="website_url_hp"
                type="text"
                name="website_url"
                value={honeypotValue}
                onChange={(e) => setHoneypotValue(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Pangalan o Brand ng Negosyo <span className="text-orange-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Hal. Ate Susan / Susan's Sisig Corner"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Contact (Mobile / Email)
                  </label>
                  <input
                    type="text"
                    placeholder="0917-xxx-xxxx o email"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Klase ng Negosyo
                  </label>
                  <select
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value)}
                    className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 cursor-pointer"
                  >
                    <option value="Carinderia / Turo-turo">Carinderia / Turo-turo</option>
                    <option value="Cloud Kitchen / Delivery">Cloud Kitchen / Delivery</option>
                    <option value="Food Stall / Kiosk">Food Stall / Kiosk</option>
                    <option value="Catering & Events">Catering &amp; Events</option>
                    <option value="Home Baker / Palamig">Home Baker / Palamig</option>
                    <option value="Nagsisimula pa lamang">Nagsisimula pa lamang</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Iminumungkahing Recipe o Ulam <span className="text-orange-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Hal. Pork Dinuguan, Siomai Negosyo, Mango Graham Shake..."
                  value={recipeIdea}
                  onChange={(e) => setRecipeIdea(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Karagdagang Detalye o Tanong sa Costing
                </label>
                <textarea
                  rows={3}
                  placeholder="May partikular ka bang gustong i-cost? Halimbawa: Ilang kilo ang kasya sa 50 servings, o paano i-compute ang sauce..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 resize-none"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[11px] text-stone-500 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Protected by Secure Submission Guard</span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 active:bg-orange-800 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 text-white font-semibold text-xs sm:text-sm shadow-md transition-all cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Ipinapadala...</span>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Ipadala ang Suhestiyon</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
