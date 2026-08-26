'use client';
export const dynamic = 'force-dynamic';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Region {
  id: string;
  name: string;
  points: number;
}

export default function Home() {
  const [regions, setRegions] = useState<Region[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [amount, setAmount] = useState<number>(1);
  const [nickname, setNickname] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    // Caricamento iniziale regioni
    const fetchRegions = async () => {
      const { data } = await supabase
        .from('regions')
        .select('*')
        .order('points', { ascending: false });
      if (data) setRegions(data);
    };

    fetchRegions();

    // Aggiornamento classifica in Tempo Reale
    const channel = supabase
      .channel('realtime-regions')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'regions' },
        (payload) => {
          setRegions((prev) =>
            prev
              .map((r) => (r.id === payload.new.id ? (payload.new as Region) : r))
              .sort((a, b) => b.points - a.points)
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Gestione checkout Stripe
  const handleCheckout = async () => {
    if (!selectedRegion) return;
    setLoading(true);

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          regionId: selectedRegion.id,
          regionName: selectedRegion.name,
          amount: Number(amount),
          nickname: nickname || 'Anonimo',
        }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Errore nel checkout');
      }
    } catch (err) {
      console.error(err);
      alert('Si è verificato un errore');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6 flex flex-col items-center">
      <h1 className="text-4xl font-extrabold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-white to-red-500 text-center">
        🇮🇹 Sfida delle Regioni
      </h1>
      <p className="text-slate-400 mb-8 text-center max-w-md">
        Fai salire in classifica la tua regione sostenendola live!
      </p>

      <div className="w-full max-w-2xl grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Classifica */}
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
          <h2 className="text-xl font-bold mb-4 text-amber-400">🏆 Classifica Live</h2>
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
            {regions.map((region, index) => (
              <div
                key={region.id}
                onClick={() => setSelectedRegion(region)}
                className={`flex justify-between items-center p-3 rounded-xl cursor-pointer transition border ${
                  selectedRegion?.id === region.id
                    ? 'bg-indigo-600/30 border-indigo-500'
                    : 'bg-slate-800/60 border-slate-700/50 hover:bg-slate-800'
                }`}
              >
                <span className="font-semibold text-sm">
                  {index + 1}. {region.name}
                </span>
                <span className="font-mono text-amber-400 font-bold text-sm">
                  {region.points} pts
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Form di Voto */}
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-bold mb-4 text-indigo-400">⚡ Sostieni una Regione</h2>
            {selectedRegion ? (
              <div className="space-y-4">
                <p className="text-sm text-slate-300">
                  Stai votando per: <strong className="text-white text-base">{selectedRegion.name}</strong>
                </p>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Il tuo Nickname (Opzionale)
                  </label>
                  <input
                    type="text"
                    placeholder="Es. Mario Rossi"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Importo (€) — 1€ = 100 Punti
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            ) : (
              <p className="text-slate-500 text-sm italic">
                Seleziona una regione dalla classifica per iniziare.
              </p>
            )}
          </div>

          <button
            disabled={!selectedRegion || loading}
            onClick={handleCheckout}
            className="w-full mt-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl font-bold text-white shadow-lg hover:opacity-90 disabled:opacity-50 transition cursor-pointer"
          >
            {loading ? 'Caricamento...' : `Paga ${amount}€ e Aggiungi ${amount * 100} Punti`}
          </button>
        </div>
      </div>
    </main>
  );
}
