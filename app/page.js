
"use client";
import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

export default function DomainChecker() {
  const [domain, setDomain] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fileContent, setFileContent] = useState("");

  const checkSingleDomain = async () => {
    setLoading(true);
    setResults([]);
    try {
      const res = await fetch(`/api/check?domain=${domain}`);
      const data = await res.json();
      setResults([{ domain, ...data }]);
    } catch (err) {
      setResults([{ domain, error: 'Error checking domain status' }]);
    }
    setLoading(false);
  };

  const checkBulkDomains = async () => {
    setLoading(true);
    setResults([]);
    const domains = fileContent
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);

    const fetches = domains.map(async (domain) => {
      try {
        const res = await fetch(`/api/check?domain=${domain}`);
        const data = await res.json();
        return { domain, ...data };
      } catch {
        return { domain, error: 'Error checking domain' };
      }
    });

    const results = await Promise.all(fetches);
    setResults(results);
    setLoading(false);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      setFileContent(e.target.result);
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">🔍 Domain Availability Checker</h1>

      <div className="flex gap-2">
        <Input
          placeholder="e.g. quranapp.com"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
        />
        <Button onClick={checkSingleDomain} disabled={loading || !domain}>
          {loading ? 'Checking...' : 'Check Single'}
        </Button>
      </div>

      <div className="space-y-2">
        <input type="file" accept=".txt" onChange={handleFileUpload} />
        <Button onClick={checkBulkDomains} disabled={loading || !fileContent}>
          {loading ? 'Checking Bulk...' : 'Check From File'}
        </Button>
      </div>

      {results.length > 0 && (
        <Card>
          <CardContent className="p-4 space-y-2">
            {results.map(({ domain, available, error }) => (
              <div key={domain}>
                {error ? (
                  <p className="text-red-500">❌ {domain}: {error}</p>
                ) : available ? (
                  <div>
                    <p className="text-green-600 font-semibold">✅ {domain} is available!</p>
                    <a
                      href={`https://www.namecheap.com/domains/registration/results/?domain=${domain}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      ➕ Buy on Namecheap
                    </a>
                  </div>
                ) : (
                  <p className="text-red-600 font-semibold">❌ {domain} is taken.</p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
