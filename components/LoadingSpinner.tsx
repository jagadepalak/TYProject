"use client";

export default function LoadingSpinner({ text }: { text?: string }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      {text && (
        <p className="mt-4 text-gray-400 text-sm">
          {text}
        </p>
      )}
    </div>
  );
}
