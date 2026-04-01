import { useState } from "react";
import axios from "axios";

const EVENT_OPTIONS = [
  { label: "Payment Success", value: "payment.success" },
  { label: "Payment Failed", value: "payment.failed" },
  { label: "User Signup", value: "user.signup" },
  { label: "User Login", value: "user.login" },
  { label: "Order Created", value: "order.created" },
];

export default function TestWebhook({ projectId, apiKey }) {
  const [event, setEvent] = useState("");
  const [amount, setAmount] = useState("");
  const [user, setUser] = useState("");
  const [loading, setLoading] = useState(false);

  const sendWebhook = async () => {
    if (!event || !amount || !user) {
      showToast("Fill all fields", "error");
      return;
    }

    try {
      setLoading(true);

      const BASE_URL = import.meta.env.VITE_API_URL;

      await axios.post(
        `${BASE_URL}/api/webhook/${projectId}`,
        {
          event,
          data: {
            amount: Number(amount),
            user,
          },
        },
        {
          headers: {
            "x-api-key": apiKey,
          },
        },
      );

      // ✅ Reset fields
      setEvent("");
      setAmount("");
      setUser("");

      showToast("Webhook sent successfully 🚀", "success");

    } catch (err) {
      console.error(err);
      showToast("Failed to send webhook", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
      <h3 className="text-sm font-semibold text-white mb-4">
        Test Webhook
      </h3>

      {/* CLEAN GRID (FIX ALIGNMENT) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">

        {/* EVENT SELECT */}
        <div>
          <label className="text-xs text-slate-400 mb-1 block">
            Event Type
          </label>
          <select
            value={event}
            onChange={(e) => setEvent(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="" disabled>
              Select event
            </option>
            {EVENT_OPTIONS.map((e) => (
              <option key={e.value} value={e.value}>
                {e.label}
              </option>
            ))}
          </select>
        </div>

        {/* AMOUNT */}
        <div>
          <label className="text-xs text-slate-400 mb-1 block">
            Amount
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount (₹)"
            className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* USER */}
        <div>
          <label className="text-xs text-slate-400 mb-1 block">
            User
          </label>
          <input
            value={user}
            onChange={(e) => setUser(e.target.value)}
            placeholder="User name"
            className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* BUTTON */}
        <div className="flex items-end">
          <button
            onClick={sendWebhook}
            disabled={loading}
            className="w-full px-4 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white font-medium transition disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </div>

      </div>
    </div>
  );
}

/* 🔥 SIMPLE TOAST SYSTEM */
function showToast(message, type = "success") {
  const toast = document.createElement("div");
  toast.innerText = message;

  toast.className = `
    fixed top-5 right-5 px-4 py-2 rounded-lg text-white text-sm shadow-lg z-50
    ${type === "success" ? "bg-green-500" : "bg-red-500"}
  `;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 2500);
}