export default function StartupCard() {
return (
<div className="border rounded-xl p-4 shadow">
<h2 className="text-xl font-semibold">Startup Name</h2>
<p className="text-gray-600 text-sm mt-2">
Industry: FinTech
</p>
<p className="mt-2 text-sm">
Funding Required: ₹10,00,000
</p>
<button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">
View Details
</button>
</div>
);
}