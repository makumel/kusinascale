import React, { useState } from 'react';
import { X, Send, Sparkles, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

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
  const [honeypotValue, setHoneypotValue] = useState('');

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // DECEPTION DEFENSE:
    // If the honeypot field has ANY content, a bot is detected.
    // Silently drop payload to prevent spam in database.
    if (honeypotValue && honeypotValue.trim() !== '') {
      setTimeout(() => {
        setIsSubmitting(false);
        setSubmitted(true);
      }, 600);
      return;
    }

    // Normal genuine human submission -> persist to Supabase
    try {
      await supabase.from('kusina_suggestions').insert([
        {
          recipe_name: recipeIdea,
          category: businessType,
          notes: `${name ? `Mula kay: ${name} (${contact}). ` : ''}${notes}`,
        }
      ]);
    } catch (err) {
      console.warn('Supabase save error (fallback to local state):', err);
    } finally {
      setIsSubmitting(false);
      setSubmitted(true);
    }
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
        <button
          onClick={handleResetAndClose}
          type="button"
          className="absolute top-5 right-5 p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
          aria-label="Isara ang modal"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="py-8 text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-stone-900 mb-2">
              Maraming Salamat, Ka-Negosyo!
            </h3>
            <p className="text-sm text-stone-600 max-w-sm mb-6 leading-relaxed">
              Natanggap na namin ang iyong recipe suggestion. Iko-compute ng KusinaScale team ang costing nito para maisama sa susunod na database update!
            </p>
            <button
              onClick={handleResetAndClose}
              type="button"
              className="px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-semibold text-sm shadow-md transition-all cursor-pointer"
            >
              Bumalik sa Mga Recipe
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-orange-600 mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Community Negosyo Hub</span>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-stone-900 leading-tight mb-2">
              Mag-suggest ng Recipe
            </h2>

            <p className="text-xs sm:text-sm text-stone-600 mb-6 leading-relaxed">
              May ulam ka bang paninda na gusto mong gawan ng detalyadong costing guide? Ibahagi sa amin!
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Invisible Honeypot Field */}
              <div
                aria-hidden="true"
                tabIndex={-1}
                className="opacity-0 absolute -left-[9999px] h-0 w-0 overflow-hidden pointer-events-none select-none"
              >
                <label htmlFor="website_url_field">Website URL (Leave blank)</label>
                <input
                  type="text"
                  id="website_url_field"
                  name="website_url_field"
                  value={honeypotValue}
                  onChange={(e) => setHoneypotValue(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Pangalan ng Ulam o Recipe <span className="text-orange-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Hal. Beef Pares Retiro Style, Pork Sisig, atbp."
                  value={recipeIdea}
                  onChange={(e) => setRecipeIdea(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Uri ng Negosyo
                  </label>
                  <select
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all bg-white"
                  >
                    <option value="Carinderia / Turo-turo">Carinderia / Turo-turo</option>
                    <option value="Food Cart / Kiosk">Food Cart / Kiosk</option>
                    <option value="Cloud Kitchen / Online">Cloud Kitchen / Online</option>
                    <option value="Catering / Handaan">Catering / Handaan</option>
                    <option value="Pang-Bahay Lamang">Pang-Bahay Lamang</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Iyong Pangalan (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Kusinero / Ka-Negosyo"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Special Notes o Sikretong Rekado (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="May partikular ka bang rekado o paraan ng pagluluto?"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-orange-600 hover:bg-orange-700 active:scale-[0.98] text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Ipinapadala...' : 'Ipadala ang Suggestion'}</span>
                </button>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-stone-500 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Protected by Secure Submission Guard &amp; Supabase Cloud</span>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
