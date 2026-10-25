import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  Flame,
  Award,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Lock,
  ArrowRight,
  X
} from 'lucide-react';

interface LaunchSalesFunnelProps {
  isOpen: boolean;
  onClose: () => void;
  onGoToApp: () => void;
}

export const LaunchSalesFunnel: React.FC<LaunchSalesFunnelProps> = ({
  isOpen,
  onClose,
  onGoToApp
}) => {
  const [includeOrderBump, setIncludeOrderBump] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'gcash' | 'maya' | 'card'>('gcash');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    botTrapField: '' // Honeypot field
  });

  if (!isOpen) return null;

  const basePrice = 299;
  const bumpPrice = 149;
  const totalPrice = includeOrderBump ? basePrice + bumpPrice : basePrice;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Silent Honeypot Bot Interception: If bot filled the trap field, silently pretend success
    if (formData.botTrapField.trim() !== '') {
      console.warn('Bot submission intercepted silently by KusinaKita honeypot.');
      setIsSubmitted(true);
      return;
    }
    // Legitimate human submission
    setIsSubmitted(true);
  };

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-md flex justify-center p-2 sm:p-4 md:p-6 animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-auto">
        
        {/* Sticky Exit Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-stone-900/60 hover:bg-stone-900 text-white transition-all hover:scale-105 cursor-pointer shadow-md"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Urgency Ticker */}
        <div className="bg-gradient-to-r from-red-600 via-orange-600 to-amber-600 text-white py-2 px-4 text-center text-xs sm:text-sm font-bold tracking-wide flex items-center justify-center gap-2 shadow-inner">
          <Flame className="w-4 h-4 animate-bounce text-amber-200" />
          <span>72-HOUR FLASH LAUNCH: ₱299 Introductory Offer (First 250 Copies Only — 184 Na Ang Naka-Avail!)</span>
        </div>

        {/* Main Sales Funnel Container */}
        <div className="p-4 sm:p-8 md:p-12 space-y-12">
          
          {/* Hero Section */}
          <section className="text-center space-y-5 max-w-3xl mx-auto">
            <div className="flex justify-center mb-1">
              <img
                src="/brand-logo-main.png"
                alt="KusinaKita - Asian and Carinderia"
                className="h-20 sm:h-24 w-auto object-contain"
              />
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300 uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              Subok sa Kalan • 100% Proven &amp; Tested • Hindi Ito AI
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-extrabold text-stone-900 tracking-tight leading-tight">
              Tigilan ang Panghuhula ng Presyo. <br />
              <span className="text-emerald-700 underline decoration-amber-400 decoration-wavy decoration-2">
                Kitang-Kita ang Tubo
              </span>{' '}
              Bago Mo Pa Sindihan ang Kalan.
            </h1>

            <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
              Ang nag-iisang <strong>Master 572+ Negosyo Recipe Guide</strong> na may kasamang{' '}
              <strong>Interactive Food Costing &amp; SRP Calculator OS</strong>. Binuo mula sa 25+ taong lihim ng
              retiradong Head Cook ng malaking carinderia chain at diskarte ng self-made fastfood entrepreneur.
            </p>

            {/* 3D App Icon & Boxshot Preview */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-4">
              <div className="relative group">
                <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-3xl overflow-hidden shadow-2xl shadow-emerald-700/20 border-2 border-stone-200/80 transform group-hover:scale-105 transition-transform duration-300">
                  <img src="/logo.png" alt="KusinaKita 3D App Icon" className="w-full h-full object-cover" />
                </div>
                <span className="absolute -bottom-3 -right-2 bg-amber-500 text-stone-950 text-[11px] font-black px-2.5 py-1 rounded-full shadow-md uppercase tracking-wider">
                  Lifetime App OS
                </span>
              </div>

              <div className="text-left space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-stone-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>572+ Commercial Carinderia &amp; Asian Recipes</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-stone-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Automatic Costing: LPG, Mantika, at Puhunan per Plate</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-stone-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Batch Scaling: 4 Servings hanggang 50-Pax Feast in 1-Click</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-stone-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Printable Kitchen Portion Sheets (Para sa 'Tamang Sandok')</span>
                </div>
              </div>
            </div>

            {/* Anchor CTA Button */}
            <a
              href="#order-section"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white font-bold text-base sm:text-lg shadow-xl shadow-emerald-700/30 transition-all cursor-pointer group"
            >
              <span>KUNIN ANG KUSINAKITA BUNDLE SA ₱299 LANG</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <p className="text-[11px] text-stone-400 font-medium">
              Instant digital download &amp; web app access • One-time payment • No monthly fees
            </p>
          </section>

          {/* Section: The Agitation (Bakit Lugi ang Carinderia?) */}
          <section className="bg-stone-50 border border-stone-200 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-2 text-red-600 font-bold text-xs uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4" />
              <span>Ang Mapait na Katotohanan sa Negosyo ng Pagkain</span>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 leading-snug">
              Bakit Ubos ang Ulam Mo sa Tanghalian Pero Pagod Lang ang Natitira sa Bulsa Mo?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm text-stone-700">
              <div className="bg-white p-4 rounded-2xl border border-stone-200 space-y-1">
                <span className="font-bold text-red-600 block">❌ Ang "Kopya-Presyo" Trap</span>
                <p className="text-stone-600">
                  Ginaya mo ang ₱60 Adobo ng katabi mo. Pero hindi mo alam, may sariling babuyan sila at bultuhan ang bili,
                  samantalang ikaw ay tingi kung bumili sa palengke. Lugi ka bago ka pa mag-luto.
                </p>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-stone-200 space-y-1">
                <span className="font-bold text-red-600 block">❌ Ang mga "Invisible Leaks" (LPG at Mantika)</span>
                <p className="text-stone-600">
                  Karne at gulay lang ang kinwenta mo. Nakalimutan mo ang ₱1,100 na tangke ng LPG, ang mantika na
                  itinatapon, at ang ₱4.00 na takeout container sa bawat order.
                </p>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-stone-200 space-y-1">
                <span className="font-bold text-red-600 block">❌ Ang Sakit ng "Iba-Ibang Sandok"</span>
                <p className="text-stone-600">
                  Kapag ikaw ang sumandok, may 12 servings ang isang kaldero. Kapag ang tauhan mo, naging 8 na lang. Ang 4 na
                  servings na nawala? 'Yun ang buong netong tubo mo para sa araw na 'yun.
                </p>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-stone-200 space-y-1">
                <span className="font-bold text-red-600 block">❌ Ang Pekeng "AI Recipes" sa Internet</span>
                <p className="text-stone-600">
                  Mga recipe na gawa-gawa lang ng computer algorithm na hindi pa naisaing sa totoong kalan. Pag niluto mo,
                  matabang, matigas, at nagrereklamo ang suki mo.
                </p>
              </div>
            </div>
          </section>

          {/* Section: The 3 Human Credibility Pillars */}
          <section className="space-y-6">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-700">
                Lihim ng Kusina Vault
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
                Hindi Ito Gawa sa AI. Ito ang Timpla ng mga Taong Nabuhay at Yumaman sa Kusina.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-b from-stone-50 to-white p-6 rounded-2xl border border-stone-200 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-700 font-bold">
                  👨‍🍳
                </div>
                <h3 className="font-serif font-bold text-base text-stone-900">
                  Ang Retiradong Head Cook (25+ Taon)
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Inilabas ang commercial tenderizing secrets nang hindi nauubos ang gasul, ang marination proportions para
                  manuot ang lasa sa buto, at ang standard batch yield formula.
                </p>
              </div>

              <div className="bg-gradient-to-b from-stone-50 to-white p-6 rounded-2xl border border-stone-200 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">
                  📈
                </div>
                <h3 className="font-serif font-bold text-base text-stone-900">
                  Ang Self-Made Fastfood Founder
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Nagbahagi ng totoong costing diskarte. Paano kumita ng 40% hanggang 60% kahit tumataas ang presyo ng karne
                  sa palengke, at ang sikreto ng "Pang-Salba" high-margin companion dishes.
                </p>
              </div>

              <div className="bg-gradient-to-b from-stone-50 to-white p-6 rounded-2xl border border-stone-200 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 font-bold">
                  🌏
                </div>
                <h3 className="font-serif font-bold text-base text-stone-900">
                  Asian Masterclass Training Vault
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Mga putahe mula sa mamahaling culinary seminars sa Taiwan, Japan, at Hong Kong—ngunit in-adjust para sa
                  panlasa ng Pinoy at mga sangkap na nabibili lang sa lokal na palengke.
                </p>
              </div>
            </div>
          </section>

          {/* Section: The Complete 572+ Master Recipe Breakdown */}
          <section className="bg-emerald-950 text-white rounded-3xl p-6 sm:p-10 space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                Ang Buong Koleksyon
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                Ano ang Makukuha Mo sa Loob ng KusinaKita Master Bundle?
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              <div className="bg-emerald-900/40 p-4 rounded-xl border border-emerald-800 space-y-1.5">
                <span className="font-bold text-amber-300 block text-sm">🥘 150+ Carinderia Classics</span>
                <p className="text-emerald-200">
                  Caldereta, Kare-Kare, Dinuguan, Bopis, Menudo, Sinigang, Pinakbet, at Crispy Bicol Express na may exact gramo at SRP formula.
                </p>
              </div>

              <div className="bg-emerald-900/40 p-4 rounded-xl border border-emerald-800 space-y-1.5">
                <span className="font-bold text-amber-300 block text-sm">🍜 120+ Asian Comfort Hits</span>
                <p className="text-emerald-200">
                  Taiwanese Fried Chicken, Dimsum Siomai, Sweet &amp; Sour Fish, Tonkatsu, Pad Thai, at Beef Pares Mami.
                </p>
              </div>

              <div className="bg-emerald-900/40 p-4 rounded-xl border border-emerald-800 space-y-1.5">
                <span className="font-bold text-amber-300 block text-sm">🥩 100+ Western &amp; Sizzling</span>
                <p className="text-emerald-200">
                  Sizzling Sisig, Salisbury Steak, Garlic Butter Chicken, Creamy Carbonara, Pork Chop Gravy, at Buffalo Wings.
                </p>
              </div>

              <div className="bg-emerald-900/40 p-4 rounded-xl border border-emerald-800 space-y-1.5">
                <span className="font-bold text-amber-300 block text-sm">🍧 100+ Palamig &amp; Desserts (80% Margin)</span>
                <p className="text-emerald-200">
                  Samalamig, Gulaman at Sago, Halo-Halo Special, Mango Float, Leche Flan commercial batch, at Ube Halaya.
                </p>
              </div>

              <div className="bg-emerald-900/40 p-4 rounded-xl border border-emerald-800 space-y-1.5">
                <span className="font-bold text-amber-300 block text-sm">⚡ 102+ Tipid 15-Minute Meals</span>
                <p className="text-emerald-200">
                  Pang-araw-araw na budget ulam para sa mga manggagawa at estudyante na mababa ang puhunan pero mabilis maubos.
                </p>
              </div>

              <div className="bg-emerald-900/40 p-4 rounded-xl border border-emerald-800 space-y-1.5">
                <span className="font-bold text-amber-300 block text-sm">📱 The Interactive Costing Web App</span>
                <p className="text-emerald-200">
                  Live dynamic pricing table, margin sliders (30%-70%), portion multiplier (1x-10x), at offline kitchen mode.
                </p>
              </div>
            </div>
          </section>

          {/* Section: 3 Free Launch Bonuses */}
          <section className="space-y-6">
            <div className="text-center space-y-1">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-600">
                Limited Launch Add-ons
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
                Libre Kapag Umorder Ka Ngayong Launch Window:
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl border-2 border-dashed border-amber-300 bg-amber-50/50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-800 bg-amber-200 px-2 py-0.5 rounded-full">
                    Bonus #1
                  </span>
                  <span className="text-xs font-semibold text-stone-400 line-through">₱499 Value</span>
                </div>
                <h4 className="font-bold text-sm text-stone-900">Franchise Crispy Chicken &amp; Thick Gravy</h4>
                <p className="text-xs text-stone-600">
                  Ang exact 11-spice copycat batter at gravy formula na hindi lumalabnaw kahit buong araw nakatambay.
                </p>
              </div>

              <div className="p-5 rounded-2xl border-2 border-dashed border-amber-300 bg-amber-50/50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-800 bg-amber-200 px-2 py-0.5 rounded-full">
                    Bonus #2
                  </span>
                  <span className="text-xs font-semibold text-stone-400 line-through">₱299 Value</span>
                </div>
                <h4 className="font-bold text-sm text-stone-900">Palengke Inflation &amp; LPG Survival Guide</h4>
                <p className="text-xs text-stone-600">
                  Mga alternatibong sangkap kapag nag-spike ang sibuyas o karne, at paano makatipid ng 30% sa gasul.
                </p>
              </div>

              <div className="p-5 rounded-2xl border-2 border-dashed border-amber-300 bg-amber-50/50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-800 bg-amber-200 px-2 py-0.5 rounded-full">
                    Bonus #3
                  </span>
                  <span className="text-xs font-semibold text-stone-400 line-through">₱199 Value</span>
                </div>
                <h4 className="font-bold text-sm text-stone-900">Barangay &amp; DTI Business Starter Kit</h4>
                <p className="text-xs text-stone-600">
                  Step-by-step checklist sa pag-rehistro ng carinderia o food cart nang walang aberya at penalty.
                </p>
              </div>
            </div>
          </section>

          {/* Section: 30-Day Money-Back Guarantee */}
          <section className="bg-amber-50 border border-amber-200 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0 text-amber-700">
              <Award className="w-12 h-12 stroke-[1.8]" />
            </div>
            <div className="space-y-2 text-center sm:text-left">
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">
                Ang Aming 30-Day "Kahit Niluto Mo Na" Money-Back Guarantee
              </h3>
              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                Subukan mo ang mga recipe. Gamitin mo ang live costing calculator. Kung sa loob ng 30 araw ay hindi naging
                malinaw ang kita mo, o pakiramdam mo ay hindi sulit ang ₱299 na ibinayad mo, mag-email o mag-message ka lang sa
                amin at ibabalik namin ang 100% ng bayad mo. Walang tanong-tanong. Walang samaan ng loob.
              </p>
            </div>
          </section>

          {/* Section: The Order Form & Checkout (ID: order-section) */}
          <section id="order-section" className="bg-white border-2 border-emerald-600 rounded-3xl p-6 sm:p-10 space-y-8 shadow-2xl">
            <div className="text-center space-y-2">
              <span className="text-xs font-black uppercase tracking-widest text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                Step 2: Piliin ang Paraan ng Pagbabayad
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-stone-900">
                Kumpletuhin ang Iyong KusinaKita Access
              </h2>
              <p className="text-xs text-stone-500">
                Kabuuang Halaga ng Bundle: <span className="line-through">₱4,990</span> • Ngayong Launch Promo: <strong>₱299 Lamang</strong>
              </p>
            </div>

            {isSubmitted ? (
              <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-8 text-center space-y-4 animate-fadeIn">
                <div className="w-16 h-16 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-stone-900">Salamat sa Iyong Tiwala!</h3>
                <p className="text-sm text-stone-700 max-w-md mx-auto">
                  Ang iyong login link at download instructions para sa <strong>KusinaKita Master Bundle</strong> ay naipadala na sa iyong email: <strong>{formData.email}</strong>.
                </p>
                <button
                  onClick={onGoToApp}
                  className="px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow cursor-pointer"
                >
                  Buksan ang KusinaKita Recipe &amp; Costing App
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 max-w-xl mx-auto">
                {/* Contact Fields */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Pangalan (Full Name)</label>
                    <input
                      type="text"
                      required
                      placeholder="Hal. Maria Dela Cruz"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm text-stone-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Email Address (Dito ipapadala ang access)</label>
                    <input
                      type="email"
                      required
                      placeholder="maria@gmail.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm text-stone-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Mobile / GCash Number</label>
                    <input
                      type="tel"
                      required
                      placeholder="0917 123 4567"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm text-stone-900"
                    />
                  </div>

                  {/* MANDATORY INVISIBLE HONEYPOT DECEPTION FIELD */}
                  <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }} aria-hidden="true">
                    <label htmlFor="company_fax_trap">Do not fill this field</label>
                    <input
                      type="text"
                      id="company_fax_trap"
                      name="company_fax_trap"
                      tabIndex={-1}
                      autoComplete="off"
                      value={formData.botTrapField}
                      onChange={(e) => setFormData({ ...formData, botTrapField: e.target.value })}
                    />
                  </div>
                </div>

                {/* 1-Click Impulse Order Bump Box */}
                <div className="bg-amber-50 border-2 border-amber-400 rounded-2xl p-4 sm:p-5 space-y-2 relative">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="orderBump"
                      checked={includeOrderBump}
                      onChange={(e) => setIncludeOrderBump(e.target.checked)}
                      className="mt-1 w-5 h-5 rounded border-amber-400 text-amber-600 focus:ring-amber-500 cursor-pointer"
                    />
                    <label htmlFor="orderBump" className="cursor-pointer text-xs sm:text-sm text-stone-800 space-y-1">
                      <span className="font-extrabold text-amber-900 block">
                        ⚡ ONE-TIME OFFER: Idagdag ang Franchise Pizza &amp; Pasta Secret Formula Vault sa ₱149 na lang! (Kaltas 70%)
                      </span>
                      <span className="text-stone-600 block text-xs">
                        Sikreto ng matagal umalsa na commercial pizza dough at sweet-savory spaghetti sauce na gamit ng mga sikat na local pizza parlor. I-check ang box para isama!
                      </span>
                    </label>
                  </div>
                </div>

                {/* Payment Rail Selector */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-stone-700">Pumili ng Payment Gateway:</label>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('gcash')}
                      className={`p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                        paymentMethod === 'gcash'
                          ? 'border-blue-500 bg-blue-50 text-blue-900 ring-2 ring-blue-400'
                          : 'border-stone-200 hover:border-stone-300 text-stone-700'
                      }`}
                    >
                      <span className="text-base">💙</span>
                      <span>GCash QR</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('maya')}
                      className={`p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                        paymentMethod === 'maya'
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-400'
                          : 'border-stone-200 hover:border-stone-300 text-stone-700'
                      }`}
                    >
                      <span className="text-base">💚</span>
                      <span>Maya QR</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                        paymentMethod === 'card'
                          ? 'border-purple-500 bg-purple-50 text-purple-900 ring-2 ring-purple-400'
                          : 'border-stone-200 hover:border-stone-300 text-stone-700'
                      }`}
                    >
                      <span className="text-base">💳</span>
                      <span>Card / BDO</span>
                    </button>
                  </div>
                </div>

                {/* Total & Submit Button */}
                <div className="pt-4 border-t border-stone-200 space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-stone-600 font-medium">Kabuuang Babayaran:</span>
                    <span className="font-mono text-2xl font-black text-emerald-700">₱{totalPrice}</span>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 rounded-2xl bg-emerald-700 hover:bg-emerald-800 active:scale-[0.98] text-white font-extrabold text-base sm:text-lg shadow-xl shadow-emerald-700/30 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Lock className="w-5 h-5 text-emerald-200" />
                    <span>I-SECURE ANG ASENSO BUNDLE (₱{totalPrice})</span>
                  </button>

                  <div className="flex items-center justify-center gap-4 text-[11px] text-stone-400">
                    <span className="flex items-center gap-1">
                      <Lock className="w-3 h-3 text-stone-400" /> 256-Bit SSL Encrypted
                    </span>
                    <span>•</span>
                    <span>Instant Email Delivery</span>
                  </div>
                </div>
              </form>
            )}
          </section>

          {/* Section: Frequently Asked Questions */}
          <section className="space-y-4 max-w-2xl mx-auto">
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-center text-stone-900">
              Mga Madalas Itanong (FAQs)
            </h3>

            <div className="space-y-2">
              {[
                {
                  q: 'Kailangan ba ng internet para magamit ang KusinaKita?',
                  a: 'Hindi! Kapag na-download mo na ang guide at na-load ang KusinaKita Web App sa iyong browser, gagana ito kahit offline ka sa loob ng iyong kusina o sa palengke nang walang data.'
                },
                {
                  q: 'Bakit sinasabing "Hindi ito AI"?',
                  a: 'Dahil ang bawat gramo ng sangkap, marination time, at portion yield ay galing sa totoong karanasan ng 25-taong retiradong Head Cook at fastfood founder. Hindi ito hula-hula ng computer.'
                },
                {
                  q: 'Paano ko matatanggap ang bundle matapos magbayad?',
                  a: 'Agad-agad! Pagkatapos makumpleto ang GCash, Maya, o card payment, makikita mo agad ang instant download link at matatanggap mo rin ito sa iyong email.'
                },
                {
                  q: 'Paano kung nalilito ako sa pag-compute ng food cost?',
                  a: 'Napakadali! I-type mo lang ang presyo ng karne at gulay sa palengke sa araw na ito, at ang KusinaKita na ang magkukwenta ng eksaktong Suggested Retail Price (SRP) at tubo bawat plato.'
                }
              ].map((faq, idx) => (
                <div key={idx} className="border border-stone-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => toggleFaq(idx)}
                    type="button"
                    className="w-full p-4 text-left font-bold text-sm text-stone-800 flex justify-between items-center bg-stone-50 hover:bg-stone-100 transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    {activeFaq === idx ? <ChevronUp className="w-4 h-4 text-stone-500" /> : <ChevronDown className="w-4 h-4 text-stone-500" />}
                  </button>
                  {activeFaq === idx && (
                    <div className="p-4 bg-white text-xs sm:text-sm text-stone-600 leading-relaxed border-t border-stone-100">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Bottom Dismiss / Explore App Button */}
          <div className="text-center pt-6 border-t border-stone-200">
            <button
              onClick={onClose}
              className="text-xs font-semibold text-stone-500 hover:text-stone-800 transition-colors cursor-pointer"
            >
              Gusto ko munang subukan ang libreng recipe calculator bago bumili →
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
