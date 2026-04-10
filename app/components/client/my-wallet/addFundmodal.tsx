"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { showFundAddedToast } from "@/app/components/ui/toasts";

interface Props {
  onClose: () => void;
}

const quickAmounts = ["$50", "$100", "$200", "$350", "$500", "$1000"];

const gateways = [
  {
    name: "Mastercard",
    icon: (
      <div className="flex -space-x-1.5">
        <div className="w-5 h-5 rounded-full bg-red-500" />
        <div className="w-5 h-5 rounded-full bg-yellow-400" />
      </div>
    ),
  },
  {
    name: "Visa Card",
    icon: <span className="text-blue-700 font-extrabold text-sm italic">VISA</span>,
  },
  {
    name: "Paypal",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#003087">
        <path d="M7.076 21.337H2.47a.641.641 0 01-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 00-.607-.541c-.013.076-.026.175-.041.254-.59 3.025-2.566 6.082-8.558 6.082H9.825l-1.27 8.048h3.426l.858-5.43h2.19c4.303 0 6.957-2.137 7.817-6.37.34-1.683.133-3.026-.624-4.043z" />
      </svg>
    ),
  },
  {
    name: "Apple Pay",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="black">
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
      </svg>
    ),
  },
  {
    name: "Google Pay",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5">
        <path d="M12 11.45v2.1h5.87c-.24 1.37-1.77 4.01-5.87 4.01-3.53 0-6.41-2.92-6.41-6.53s2.88-6.53 6.41-6.53c2.01 0 3.36.86 4.13 1.6l2.81-2.71C17.24 1.79 14.83.75 12 .75 6.48.75 2 5.28 2 10.75s4.48 10 10 10c5.77 0 9.6-4.06 9.6-9.77 0-.66-.07-1.16-.16-1.66H12v2.13z" fill="#4285F4" />
      </svg>
    ),
  },
];

const AddFundModal: React.FC<Props> = ({ onClose }) => {
  const [amount, setAmount] = useState("");
  const [selectedGateway, setSelectedGateway] = useState("Mastercard");

  const handleAddFund = () => {
    if (!amount) return;
    // Replace with your actual API call:
    // await fetch("/api/wallet/fund", { method: "POST", body: JSON.stringify({ amount, gateway: selectedGateway }) });
    onClose();
    showFundAddedToast();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center mt-20 z-50 px-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
          <h2 className="text-xl font-bold text-black">Add Fund</h2>
          <button onClick={onClose} className="text-black hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <div className="px-6 py-5 max-h-[70vh] overflow-y-auto">
          {/* Enter Amount */}
          <div className="mb-5">
            <label className="block text-sm font-semibold text-black mb-2">Enter Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Type here"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-black focus:outline-none focus:ring-2 focus:ring-[#e84545]/20 focus:border-[#e84545]/40"
            />
          </div>

          {/* Quick amounts */}
          <div className="mb-6">
            <p className="text-sm font-semibold text-black mb-3">Or select amount</p>
            <div className="flex gap-2 flex-wrap">
              {quickAmounts.map((q) => (
                <button
                  key={q}
                  onClick={() => setAmount(q.replace("$", ""))}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    amount === q.replace("$", "")
                      ? "bg-[#2a2a50] text-white"
                      : "bg-[#1c1c3a] text-white hover:bg-[#2a2a50]"
                  }`}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Payment Gateway */}
          <div>
            <p className="text-sm font-semibold text-black mb-3">Select Payment Gateway</p>
            <div className="flex flex-col gap-2">
              {gateways.map((g) => (
                <button
                  key={g.name}
                  onClick={() => setSelectedGateway(g.name)}
                  className="flex items-center justify-between px-4 py-3 border border-gray-100 rounded-xl bg-white hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 flex items-center justify-center">{g.icon}</div>
                    <span className="text-sm font-medium text-black">{g.name}</span>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selectedGateway === g.name ? "border-[#1c1c3a]" : "border-gray-300"
                  }`}>
                    {selectedGateway === g.name && (
                      <div className="w-2.5 h-2.5 rounded-full bg-[#1c1c3a]" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Add Fund button */}
        <div className="px-6 pb-6 pt-3">
          <button
            onClick={handleAddFund}
            className="w-full py-3 bg-[#e84545] hover:bg-[#d03535] text-white font-bold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!amount}
          >
            Add Fund
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddFundModal;