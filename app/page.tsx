
"use client";

import { useState } from "react";

const initialRegions = [
  { id: "lombardia", name: "Lombardia", points: 12500, flag: "🇮🇹" },
  { id: "campania", name: "Campania", points: 11200, flag: "🇮🇹" },
  { id: "sicilia", name: "Sicilia", points: 9800, flag: "🇮🇹" },
  { id: "lazio", name: "Lazio", points: 8400, flag: "🇮🇹" },
  { id: "veneto", name: "Veneto", points: 7100, flag: "🇮🇹" },
  { id: "piemonte", name: "Piemonte", points: 5900, flag: "🇮🇹" },
  { id: "puglia", name: "Puglia", points: 4800, flag: "🇮🇹" },
  { id: "toscana", name: "Toscana", points: 3600, flag: "🇮🇹" },
  { id: "emilia-romagna", name: "Emilia-Romagna", points: 3100, flag: "🇮🇹" },
  { id: "calabria", name: "Calabria", points: 2800, flag: "🇮🇹" },
  { id: "sardegna", name: "Sardegna", points: 2500, flag: "🇮🇹" },
  { id: "liguria", name: "Liguria", points: 2100, flag: "🇮🇹" },
  { id: "marche", name: "Marche", points: 1900, flag: "🇮🇹" },
  { id: "abruzzo", name: "Abruzzo", points: 1700, flag: "🇮🇹" },
  { id: "friuli-venezia-giulia", name: "Friuli-Venezia Giulia", points: 1500, flag: "🇮🇹" },
  { id: "trentino-alto-adige", name: "Trentino-Alto Adige", points: 1300, flag: "🇮🇹" },
  { id: "umbria", name: "Umbria", points: 1100, flag: "🇮🇹" },
  { id: "basilicata", name: "Basilicata", points: 900, flag: "🇮🇹" },
  { id: "molise", name: "Molise", points: 700, flag: "🇮🇹" },
  { id: "valle-d-aosta", name: "Valle d'Aosta", points: 500, flag: "🇮🇹" },
];

export default function Home() {
  const [regions, setRegions] = useState(initialRegions);
  const [selectedRegion, setSelectedRegion] = useState(initialRegions[0].id);

const stripePaymentUrl = `https://buy.stripe.com/test_00w9AUgBa7gzcyj1r5bwk00?client_reference_id=${selectedRegion}&prefilled_email=test@example.com`;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white p-4 md:p-8 font-sans pb-24">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="text-center space-y-2 py-6">
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 px-4 py-1.5 rounded-full text-indigo-300 text-sm font-semibold mb-2">
            🇮🇹 Sfida Nazionale 2026
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight bg-gradient-to-r from-white via-indigo-200 to-indigo-400 bg-clip-text text-transparent">
            Regions Battle Italia
          </h1>
          <p className="text-slate-400 text-base md:text-lg max-w-xl mx-auto">
            Porta la tua regione in cima alla classifica globale. Ogni voto la fa salire verso la vittoria!
          </p>
        </header>

        {/* Griglia Principale */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Classifica */}
          <div className="lg:col-span-2 bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                🏆 Classifica Live
              </h2>
              <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full font-medium flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                In tempo reale
              </span>
            </div>

            <div className="space-y-2">
              {regions.map((region, index) => {
                const isSelected = selectedRegion === region.id;
                return (
                  <div
                    key={region.id}
                    onClick={() => setSelectedRegion(region.id)}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all duration-200 ${
                      isSelected
                        ? "bg-indigo-600/20 border-indigo-500 shadow-lg shadow-indigo-500/10 scale-[1.01]"
                        : "bg-slate-800/40 border-slate-800 hover:border-slate-700 hover:bg-slate-800/80"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-7 text-center font-bold text-sm ${
                        index === 0 ? "text-amber-400" : index === 1 ? "text-slate-300" : index === 2 ? "text-amber-600" : "text-slate-500"
                      }`}>
                        #{index + 1}
                      </span>
                      <span className="text-xl">{region.flag}</span>
                      <span className="font-semibold text-slate-100 text-sm md:text-base">{region.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-indigo-300 text-sm md:text-base">
                        {region.points.toLocaleString()} pts
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sostieni */}
          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-2xl flex flex-col justify-between space-y-6 lg:sticky lg:top-8">
            <div>
              <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
                ⚡ Sostieni una Regione
              </h2>
              <p className="text-slate-400 text-sm mb-6">
                Seleziona una regione e aggiungi punti per farla scalare in classifica.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-2">
                    Regione Selezionata
                  </label>
                  <select
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 font-medium focus:outline-none focus:border-indigo-500 transition-colors"
                  >
                    {regions.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.flag} {r.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="bg-indigo-950/40 border border-indigo-500/30 rounded-xl p-4 text-center">
                  <span className="text-xs text-indigo-300 uppercase tracking-wider font-semibold block mb-1">
                    Pacchetto Sostegno
                  </span>
                  <span className="text-3xl font-black text-white">100 Punti</span>
                  <span className="text-xs text-slate-400 block mt-1">Valore: 1,00 €</span>
                </div>
              </div>
            </div>

            <a
              href={stripePaymentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 px-6 rounded-xl text-center shadow-lg shadow-indigo-600/30 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
            >
              💳 Paga 1€ e Aggiungi 100 Punti
            </a>
          </div>

        </div>
      </div>
    </main>
  );
}
