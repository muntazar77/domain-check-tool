// pages/domain-checker.js
'use client';

import { useState } from 'react';
export default function DomainChecker() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const checkDomain = async () => {
    if (!query.trim()) return; // لا تبحث إذا كان الحقل فارغًا
    
    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch(
        `https://api.domainr.com/v2/search?query=${query}&client_id=f06095f1d5msh20d1ffe76723b88p12e87fjsn3d4d2de96aea`
      );
      
      if (!res.ok) throw new Error('فشل في جلب البيانات');
      
      const data = await res.json();
      setResults(data.results || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>مدقق النطاقات (Domainr API)</h1>
      
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="أدخل كلمة مثل 'tech'..."
        style={{ padding: '8px', width: '300px' }}
      />
      
      <button 
        onClick={checkDomain}
        disabled={loading}
        style={{ marginLeft: '10px', padding: '8px 16px' }}
      >
        {loading ? 'جاري g البحث...' : 'تحقق'}
      </button>
      
      {error && <p style={{ color: 'red' }}>❌ {error}</p>}
      
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {results.map((domain) => (
          <li key={domain.domain} style={{ margin: '10px 0' }}>
            {domain.domain} - 
            {domain.availability === 'available' ? (
              <span style={{ color: 'green' }}> 🟢 متاح</span>
            ) : (
              <span style={{ color: 'red' }}> 🔴 محجوز</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}