"use client";

export default function StartupForm() {
  const handleSubmit = () => {
    alert("Pitch submitted successfully!");
  };

  return (
    <form className="space-y-6">

      <div>
        <label className="block mb-2 text-gray-300">
          Startup Name
        </label>
        <input
          type="text"
          placeholder="Enter startup name"
          className="w-full px-4 py-2 rounded-lg bg-gray-700 text-gray-100 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label className="block mb-2 text-gray-300">
          Domain
        </label>
        <select
          className="w-full px-4 py-2 rounded-lg bg-gray-700 text-gray-100 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option>Select domain</option>
          <option>FinTech</option>
          <option>HealthTech</option>
          <option>EdTech</option>
          <option>AI / ML</option>
          <option>E-Commerce</option>
        </select>
      </div>

      <div>
        <label className="block mb-2 text-gray-300">
          Funding Required
        </label>
        <input
          type="text"
          placeholder="e.g. ₹50 Lakhs"
          className="w-full px-4 py-2 rounded-lg bg-gray-700 text-gray-100 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label className="block mb-2 text-gray-300">
          Startup Description
        </label>
        <textarea
          rows={4}
          placeholder="Describe your startup idea"
          className="w-full px-4 py-2 rounded-lg bg-gray-700 text-gray-100 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        ></textarea>
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        className="w-full py-3 bg-green-600 hover:bg-green-700 rounded-lg text-lg font-semibold"
      >
        Submit Pitch
      </button>

    </form>
  );
}
