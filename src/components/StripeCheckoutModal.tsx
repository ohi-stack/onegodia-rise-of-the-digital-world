import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  ShieldCheck, 
  Zap, 
  Sparkles, 
  CheckCircle2, 
  ExternalLink, 
  Lock, 
  X, 
  Coins, 
  Trophy, 
  AlertCircle,
  Loader2,
  Check,
  Flame,
  ArrowRight
} from 'lucide-react';
import { StripePass, PlayerProgress } from '../types';
import { sound } from '../services/audioService';
import { attachStripeReceiptToHistory } from '../services/historyService';

interface StripeCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  setProgress?: React.Dispatch<React.SetStateAction<PlayerProgress>>;
  onPaymentSuccess?: (receipt: any) => void;
  preselectedPassId?: string;
}

const STRIPE_PASSES: StripePass[] = [
  {
    id: 'priority_mission_pass',
    name: 'Sector 7 Priority Mission Pass',
    price: '$4.99',
    priceCents: 499,
    badge: 'Popular',
    description: 'Expedite mission verification, unlock double telemetry rewards, and access priority server queues.',
    perks: [
      'Instant Mission 001-006 Priority Routing',
      '+250 Bonus Credits (CR) Instant Payout',
      'Verified Gold Mission Clearance Tag',
      'Unlocked Priority Terminal Access'
    ],
    highlighted: true
  },
  {
    id: 'genesis_bounty_booster',
    name: 'Genesis Bounty Booster Pack',
    price: '$9.99',
    priceCents: 999,
    badge: 'Best Value',
    description: 'Comprehensive booster pack providing instant capital and permanent blueprint telemetry boosts.',
    perks: [
      '+1,000 Bonus Credits (CR) Instant Payout',
      'Exclusive "Genesis Pioneer" Digital Locker Badge',
      '2x Telemetry Calibration Rate on all nodes',
      'Unreal Engine 5 Playable Client Access Priority'
    ]
  },
  {
    id: 'founder_sector_pass',
    name: 'Founder Sector Key & Cyber-Cruiser Skin',
    price: '$19.99',
    priceCents: 1999,
    badge: 'Founder Tier',
    description: 'The ultimate supporter clearance for Onegodia: Rise of the Digital World™.',
    perks: [
      '+2,500 Bonus Credits (CR) Instant Payout',
      'Gold Neon Cyber-Cruiser Vehicle Wrap',
      'Access to Developer Matrix & Prototype Viewports',
      'Permanent Founder Verification in Mission History'
    ]
  }
];

export const StripeCheckoutModal: React.FC<StripeCheckoutModalProps> = ({
  isOpen,
  onClose,
  setProgress,
  onPaymentSuccess,
  preselectedPassId
}) => {
  const [selectedPass, setSelectedPass] = useState<StripePass>(
    STRIPE_PASSES.find(p => p.id === preselectedPassId) || STRIPE_PASSES[0]
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [stripeConfig, setStripeConfig] = useState<{ configured: boolean; mode: string } | null>(null);
  const [lastReceipt, setLastReceipt] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Check server Stripe status on open
  useEffect(() => {
    if (isOpen) {
      setIsSuccess(false);
      setErrorMsg(null);
      fetch('/api/stripe/config')
        .then(res => res.json())
        .then(data => setStripeConfig(data))
        .catch(() => setStripeConfig({ configured: false, mode: 'simulation' }));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleInitiatePayment = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    sound.playClick();

    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          passId: selectedPass.id,
          passName: selectedPass.name,
          amountCents: selectedPass.priceCents,
          currency: 'USD'
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create payment session');
      }

      if (data.url) {
        // Redirect to live Stripe Checkout page
        window.location.href = data.url;
      } else {
        // Handle Sandbox Test Mode / Simulation
        const receipt = {
          sessionId: data.sessionId || `sim_cs_${Date.now()}`,
          passName: selectedPass.name,
          amountTotal: selectedPass.priceCents,
          currency: 'USD',
          paidAt: Date.now(),
          status: 'paid',
          isSimulated: true
        };

        // Attach receipt to Mission History
        attachStripeReceiptToHistory(receipt);

        // Credit player inventory and credits
        if (setProgress) {
          setProgress(prev => {
            const addedCredits = selectedPass.priceCents > 1500 ? 2500 : selectedPass.priceCents > 800 ? 1000 : 250;
            return {
              ...prev,
              credits: prev.credits + addedCredits,
              inventory: [
                ...prev.inventory,
                {
                  id: `stripe-pass-${Date.now()}`,
                  name: selectedPass.name,
                  type: 'Stripe Priority Pass',
                  rarity: 'Foundational',
                  status: 'Active / Stripe Verified',
                  description: selectedPass.description,
                  acquiredDate: new Date().toLocaleDateString(),
                  iconName: 'Shield',
                  metadata: {
                    'Stripe TXN': receipt.sessionId.substring(0, 14),
                    'Price': selectedPass.price,
                    'Clearance': 'Priority VIP'
                  }
                }
              ]
            };
          });
        }

        sound.playReward();
        setLastReceipt(receipt);
        setIsSuccess(true);
        if (onPaymentSuccess) {
          onPaymentSuccess(receipt);
        }
      }
    } catch (err: any) {
      console.error('Payment error:', err);
      setErrorMsg(err.message || 'Payment processing error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div 
        className="w-full max-w-2xl bg-[#0b0d13] border border-[#1e2230] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#1e2230] bg-[#11141e] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-950 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
                  Stripe Mission Clearance Checkout
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-900/60 text-blue-300 border border-blue-500/40">
                  Stripe 2026
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Secure PCI-DSS Compliant Payment Node • Instant In-Game Provisioning
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {isSuccess ? (
            <div className="py-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-950 border border-emerald-500/60 text-emerald-400 flex items-center justify-center mx-auto shadow-lg">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-emerald-300">Payment Processed Successfully!</h3>
                <p className="text-xs text-slate-300 max-w-md mx-auto">
                  Your <strong className="text-white">{selectedPass.name}</strong> has been verified. Telemetry rewards and priority pass have been attached to your Mission History and Digital Locker.
                </p>
              </div>

              {lastReceipt && (
                <div className="p-3.5 rounded-xl bg-[#11131a] border border-emerald-500/30 max-w-md mx-auto text-left font-mono text-xs space-y-1.5">
                  <div className="flex justify-between text-slate-400">
                    <span>Transaction ID:</span>
                    <span className="text-slate-200">{lastReceipt.sessionId.substring(0, 18)}...</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Item:</span>
                    <span className="text-amber-300 font-bold">{lastReceipt.passName}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Amount Paid:</span>
                    <span className="text-emerald-400 font-bold">${(lastReceipt.amountTotal / 100).toFixed(2)} USD</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Status:</span>
                    <span className="text-emerald-300 uppercase font-bold">✓ {lastReceipt.status}</span>
                  </div>
                </div>
              )}

              <div className="pt-2">
                <button
                  onClick={() => {
                    sound.playClick();
                    onClose();
                  }}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg transition-colors inline-flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>Return to Mission Hub</span>
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Stripe Environment Indicator Banner */}
              <div className="p-3 rounded-xl bg-[#11131a] border border-[#1e2230] flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-blue-400" />
                  <span className="text-slate-300">Backend Gateway:</span>
                  <span className={`font-bold ${stripeConfig?.configured ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {stripeConfig?.configured ? `Stripe Live (${stripeConfig.mode})` : 'Stripe Sandbox Test Node'}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">
                  256-Bit SSL
                </span>
              </div>

              {/* Pass Tier Cards */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-300 uppercase font-mono tracking-wider">
                  Select Mission Booster Tier
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {STRIPE_PASSES.map((pass) => {
                    const isSelected = selectedPass.id === pass.id;
                    return (
                      <div
                        key={pass.id}
                        onClick={() => {
                          sound.playClick();
                          setSelectedPass(pass);
                        }}
                        className={`cursor-pointer p-4 rounded-xl border transition-all flex flex-col justify-between relative ${
                          isSelected
                            ? 'bg-blue-950/40 border-blue-500 shadow-md ring-1 ring-blue-500'
                            : 'bg-[#11131a] border-[#1e2230] hover:border-slate-700'
                        }`}
                      >
                        {pass.badge && (
                          <div className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase font-mono bg-blue-600 text-white shadow">
                            {pass.badge}
                          </div>
                        )}
                        <div className="space-y-2">
                          <h4 className="font-bold text-sm text-white leading-snug">{pass.name}</h4>
                          <div className="text-lg font-mono font-black text-amber-300">
                            {pass.price}
                          </div>
                          <p className="text-[11px] text-slate-400 leading-relaxed">
                            {pass.description}
                          </p>
                        </div>

                        <div className="mt-3 pt-3 border-t border-[#1e2230] space-y-1">
                          {pass.perks.slice(0, 3).map((perk, pIdx) => (
                            <div key={pIdx} className="flex items-start gap-1.5 text-[10px] text-slate-300">
                              <Check className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                              <span className="truncate">{perk}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Error Message if any */}
              {errorMsg && (
                <div className="p-3 rounded-xl bg-red-950/50 border border-red-500/50 text-red-200 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Security & Guarantee Note */}
              <div className="p-3 rounded-xl bg-[#0d0f16] border border-[#1e2230] flex items-center gap-3 text-xs text-slate-400 font-sans">
                <ShieldCheck className="w-5 h-5 text-blue-400 shrink-0" />
                <p>
                  Transactions automatically generate a cryptographically signed receipt attached to your <strong>Mission History</strong> tab with instant item provisioning.
                </p>
              </div>
            </>
          )}
        </div>

        {/* Footer Actions */}
        {!isSuccess && (
          <div className="p-4 sm:p-5 border-t border-[#1e2230] bg-[#11141e] flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs font-mono text-slate-400">
              Selected: <strong className="text-white">{selectedPass.name}</strong> • <span className="text-amber-300 font-bold">{selectedPass.price}</span>
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  onClose();
                }}
                className="px-4 py-2 rounded-xl bg-[#11131a] hover:bg-slate-800 text-slate-300 text-xs font-mono font-bold transition-colors w-full sm:w-auto"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={isLoading}
                onClick={handleInitiatePayment}
                className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all w-full sm:w-auto"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Connecting Stripe...</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" />
                    <span>Pay {selectedPass.price} with Stripe</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
