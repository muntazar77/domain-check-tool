"use client";

import { useState } from "react";

const api_ley = process.env.NEXT_PUBLIC_DOMAINR_API_KEY;


const page = () => {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

const fetchDomainStatus = async (domains) => {
  try {
    const results = await Promise.all(
      domains.map(async (domain) => {
        const res = await fetch(
          `https://domainr.p.rapidapi.com/v2/status?mashape-key=${api_ley}&domain=${domain.trim()}`
        );
        if (!res.ok) throw new Error("Network response was not ok");
        const data = await res.json();
        return { domain, data };
      })
    );
    return results;
  } catch (err) {
    setError("Error fetching domain status");
    return null;
  }
};

  // Handle form submit
const handleSubmit = async (e) => {
  e.preventDefault();
  setError(null);
  setResult(null);
  const input = e.target.elements.domain.value;
  // Split by comma or whitespace
  const domains = input.split(/[\s,]+/).filter(Boolean);
  const data = await fetchDomainStatus(domains);
  if (data) setResult(data);
};

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Check Domain status</h1>
      <div className="bg-white p-6 rounded shadow-md w-100">
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Enter Domain:
        </label>
        <form className="mb-4" onSubmit={handleSubmit}>
       
          <textarea
            className="w-full p-2 border border-gray-300 rounded mb-4"
            placeholder="Enter multiple domains separated by commas or spaces"
            name="domain"
            rows="3"
            required
          ></textarea>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Check Domain
          </button>
        </form>
        <div className="mt-4">
          {error && <div className="text-red-500">{error}</div>}
             {result && (
  <div>
    {result.map((item, idx) => {
      // Domainr API returns item.data.status as an array of objects
      // We'll join all status codes for display
      const statuses = Array.isArray(item.data.status)
        ? item.data.status.map((s) => s.status).join(", ")
        : "unknown";
      // You can also use the first status for color
      const firstStatus = Array.isArray(item.data.status) && item.data.status.length > 0
        ? item.data.status[0].status
        : "unknown";
      return (
        <div key={idx} className="mb-2">
          <h2 className={`text-lg font-semibold ${firstStatus === 'active' ? 'text-green-500' : 'text-red-500'}`}>
            {item.domain} - {statuses}
          </h2>
          <pre className="text-xs bg-gray-100 p-2 rounded">
            {JSON.stringify(item.data, null, 2)}
          </pre>
        </div>
      );
    })}
  </div>
)}
        
        </div>
      </div>
    </div>
  );
};

export default page;