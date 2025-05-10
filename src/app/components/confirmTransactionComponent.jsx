import React from "react";

export default function ConfirmTransactionComponent({ 
  transactionData, 
  amount,
  onConfirm, 
  onCancel, 
  isLoading 
}) {

  if (!transactionData) {
    return (
      <div className="flex flex-col items-center gap-5 py-5">
        <div className="my-3 text-lg font-bold text-center text-gray-800">
          Loading transaction details...
        </div>
        <button
          className="w-36 h-11 px-4 py-2 text-gray-800 font-semibold bg-white border-2 border-gray-800 rounded-md shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] transition duration-200 hover:bg-red-500 hover:text-white active:shadow-none active:translate-x-1 active:translate-y-1"
          onClick={onCancel}
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-5 py-5 animate-[fadeIn_0.5s_ease-in-out]">
      <div className="my-3 text-2xl font-black text-center text-gray-800">
        Confirm Transaction
      </div>
      
      <div className="w-full p-4 bg-white border-2 border-gray-800 rounded-md shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)]">
        <h3 className="mb-3 text-lg font-bold text-gray-800 border-b border-gray-300 pb-2">
          Transaction Details
        </h3>
        
        <div className="space-y-2">
          <p className="font-semibold text-gray-800">
            <span className="text-gray-600">Amount:</span> ₡{amount || ''}
          </p>
          
          <p className="font-semibold text-gray-800">
            <span className="text-gray-600">Recipient:</span> {transactionData.recipient?.name || ''}
          </p>
          
          <p className="font-semibold text-gray-800">
            <span className="text-gray-600">Phone:</span> {transactionData.recipient?.phone || ''}
          </p>
          
          <p className="text-sm italic font-semibold text-gray-600 mt-4">
            Please review the details before confirming the transaction
          </p>
        </div>
      </div>
      
      <div className="flex gap-4 mt-2">
        <button
          className="w-36 h-11 px-4 py-2 text-gray-800 font-semibold bg-white border-2 border-gray-800 rounded-md shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] transition duration-200 hover:bg-red-500 hover:text-white active:shadow-none active:translate-x-1 active:translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </button>
        
        <button
          className="w-36 h-11 px-4 py-2 text-gray-800 font-semibold bg-white border-2 border-gray-800 rounded-md shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] transition duration-200 hover:bg-green-500 hover:text-white active:shadow-none active:translate-x-1 active:translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed"
          onClick={onConfirm}
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : "Confirm"}
        </button>
      </div>
    </div>
  );
}