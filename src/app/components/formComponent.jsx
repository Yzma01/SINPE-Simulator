"use client";
import React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "../Providers/userProvider";

export default function FormComponent() {
  const [amount, setAmount] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [description, setDescription] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { user } = useUser();

  console.log("🐕🐕", user);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!amount || !recipientPhone) {
      setError("Please complete all required fields");
      setIsLoading(false);
      return;
    }

    if (!user || !user.identification) {
      setError("User information not available");
      setIsLoading(false);
      return;
    }

    const body = {
      clientId: user.identification,
      amount: parseFloat(amount),
      recipientPhone,
    };

    try {
      const response = await makeFetch("/api/transaction", "POST", body);

      if (response.token) {
        const confirmResponse = await makeFetch("/api/transaction", "PUT", {
          token: response.token,
        });

        if (confirmResponse.voucher) {
          setShowConfirmation(true);
        } else {
          setError(confirmResponse.message || "Error confirming transaction");
        }
      } else {
        setError(response.message || "Transaction failed");
      }
    } catch (error) {
      console.error("Transaction error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewTransaction = () => {
    setShowConfirmation(false);
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-96 p-5 bg-gray-300 rounded-md border-2 border-gray-800 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)]">
        <div className="relative w-full text-center">
          {!showConfirmation ? (
            <>
              <div className="my-5 text-2xl font-black text-center text-gray-800">
                ROMAAR
              </div>
              <form
                className="flex flex-col items-center gap-5"
                onSubmit={handleSubmit}
              >
                <input
                  className="w-full h-10 px-3 py-2 text-gray-800 font-semibold bg-white border-2 border-gray-800 rounded-md shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] outline-none focus:border-blue-500 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  placeholder="Recipient's phone number"
                  type="number"
                  value={recipientPhone}
                  onChange={(e) => setRecipientPhone(e.target.value)}
                  required
                />
                <input
                  className="w-full h-10 px-3 py-2 text-gray-800 font-semibold bg-white border-2 border-gray-800 rounded-md shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] outline-none focus:border-blue-500 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  placeholder="Amount to send"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="1"
                  step="any"
                  required
                />
                <textarea
                  className="w-full px-3 py-2 text-gray-800 font-semibold bg-white border-2 border-gray-800 rounded-md shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] resize-none outline-none focus:border-blue-500 font-sans"
                  placeholder="Description (optional)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />

                {error && (
                  <div className="w-full p-2 text-sm font-semibold text-center text-red-700 bg-red-100 bg-opacity-25 rounded-md">
                    {error}
                  </div>
                )}

                <button
                  className="w-44 h-11 my-5 px-4 py-2 text-gray-800 font-semibold bg-white border-2 border-gray-800 rounded-md shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] transition duration-200 hover:bg-blue-500 hover:text-white active:shadow-none active:translate-x-1 active:translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? "Processing..." : "Send money"}
                </button>
              </form>
            </>
          ) : (
            <div className="flex flex-col items-center gap-5 py-5 animate-[fadeIn_0.5s_ease-in-out]">
              <div className="my-5 text-2xl font-black text-center text-gray-800">
                Successful Transfer!
              </div>
              <div className="w-full p-4 bg-white border-2 border-gray-800 rounded-md shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)]">
                <p className="my-2 font-semibold text-gray-800">
                  You have sent ₡{amount} to the number {recipientPhone}.
                </p>
                <p className="my-2 text-sm italic font-semibold text-gray-800">
                  Description: {description || "Transferencia SINPE"}
                </p>
              </div>
              <button
                className="w-44 h-11 my-5 px-4 py-2 text-gray-800 font-semibold bg-white border-2 border-gray-800 rounded-md shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] transition duration-200 hover:bg-blue-500 hover:text-white active:shadow-none active:translate-x-1 active:translate-y-1"
                onClick={handleNewTransaction}
              >
                New Transfer
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
