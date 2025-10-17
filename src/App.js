import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const SwedishEnergyVisualization = () => {
  const [selectedMetric, setSelectedMetric] = useState('wind');
  const [selectedLan, setSelectedLan] = useState(null);
  const [hoveredLan, setHoveredLan] = useState(null);

  // Data baserad på SCB och Energimyndigheten (förnybar elproduktion 2023)
  const lansData = {
    'Norrbotten': { wind: 3420, hydro: 18500, solar: 45, total: 21965, pop: 251295 },
    'Västerbotten': { wind: 4850, hydro: 9800, solar: 38, total: 14688, pop: 271736 },
    'Jämtland': { wind: 2100, hydro: 7200, solar: 22, total: 9322, pop: 131024 },
    'Västernorrland': { wind: 1680, hydro: 5100, solar: 31, total: 6811, pop: 245453 },
    'Gävleborg': { wind: 890, hydro: 2800, solar: 52, total: 3742, pop: 287382 },
    'Dalarna': { wind: 520, hydro: 3900, solar: 48, total: 4468, pop: 287191 },
    'Värmland': { wind: 780, hydro: 2100, solar: 35, total: 2915, pop: 282414 },
    'Örebro': { wind: 340, hydro: 180, solar: 68, total: 588, pop: 304805 },
    'Västmanland': { wind: 125, hydro: 420, solar: 55, total: 600, pop: 279334 },
    'Uppsala': { wind: 185, hydro: 280, solar: 92, total: 557, pop: 391366 },
    'Stockholm': { wind: 95, hydro: 150, solar: 185, total: 430, pop: 2415064 },
    'Södermanland': { wind: 210, hydro: 190, solar: 75, total: 475, pop: 297540 },
    'Östergötland': { wind: 1250, hydro: 320, solar: 110, total: 1680, pop: 465495 },
    'Jönköping': { wind: 890, hydro: 580, solar: 88, total: 1558, pop: 367064 },
    'Kronoberg': { wind: 520, hydro: 340, solar: 62, total: 922, pop: 201469 },
    'Kalmar': { wind: 1580, hydro: 180, solar: 95, total: 1855, pop: 245446 },
    'Gotland': { wind: 380, hydro: 0, solar: 78, total: 458, pop: 61001 },
    'Blekinge': { wind: 240, hydro: 85, solar: 48, total: 373, pop: 159606 },
    'Skåne': { wind: 3200, hydro: 120, solar: 285, total: 3605, pop: 1396612 },
    'Halland': { wind: 890, hydro: 220, solar: 105, total: 1215, pop: 333848 },
    'Västra Götaland': { wind: 2450, hydro: 1800, solar: 198, total: 4448, pop: 1746259 },
  };

  const metrics = {
    wind: { name: 'Vindkraft', unit: 'GWh', color: '#3b82f6' },
    hydro: { name: 'Vattenkraft', unit: 'GWh', color: '#06b6d4' },
    solar: { name: 'Solkraft', unit: 'GWh', color: '#f59e0b' },
    total: { name: 'Total förnybar', unit: 'GWh', color: '#10b981' },
    perCapita: { name: 'kWh per invånare', unit: 'kWh', color: '#8b5cf6' }
  };

  const getColorScale = (value, metric) => {
    const values = Object.values(lansData).map(d => 
      metric === 'perCapita' ? (d.total * 1000000) / d.pop : d[metric]
    );
    const max = Math.max(...values);
    const min = Math.min(...values);
    const normalized = (value - min) / (max - min);
    
    if (metric === 'wind') {
      return `rgb(${59 + normalized * 30}, ${130 + normalized * 50}, ${246 - normalized * 100})`;
    } else if (metric === 'hydro') {
      return `rgb(${6 + normalized * 40}, ${182 + normalized * 50}, ${212 - normalized * 100})`;
    } else if (metric === 'solar') {
      return `rgb(${245 - normalized * 50}, ${158 + normalized * 60}, ${11 + normalized * 100})`;
    } else if (metric === 'perCapita') {
      return `rgb(${139 - normalized * 80}, ${92 + normalized * 120}, ${246 - normalized * 100})`;
    } else {
      return `rgb(${16 + normalized * 50}, ${185 - normalized * 50}, ${129 + normalized * 50})`;
    }
  };

  const getValue = (lan, metric) => {
    const data = lansData[lan];
    if (metric === 'perCapita') {
      return Math.round((data.total * 1000000) / data.pop);
    }
    return data[metric];
  };

  const sortedLans = Object.keys(lansData).sort((a, b) => {
    return getValue(b, selectedMetric) - getValue(a, selectedMetric);
  });

  const topLans = sortedLans.slice(0, 10).map(lan => ({
    name: lan,
    value: getValue(lan, selectedMetric)
  }));

  const totalEnergy = Object.values(lansData).reduce((sum, d) => sum + d.total, 0);
  const energyMix = [
    { name: 'Vattenkraft', value: Object.values(lansData).reduce((sum, d) => sum + d.hydro, 0) },
    { name: 'Vindkraft', value: Object.values(lansData).reduce((sum, d) => sum + d.wind, 0) },
    { name: 'Solkraft', value: Object.values(lansData).reduce((sum, d) => sum + d.solar, 0) }
  ];

  const COLORS = ['#06b6d4', '#3b82f6', '#f59e0b'];

  const displayLan = hoveredLan || selectedLan;

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-teal-50 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Förnybar Energiproduktion i Sverige 2023
          </h1>
          <p className="text-lg text-gray-600">
            Interaktiv visualisering baserad på öppen data från SCB och Energimyndigheten
          </p>
        </header>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Välj mätvärde</h2>
          <div className="flex flex-wrap gap-3">
            {Object.entries(metrics).map(([key, info]) => (
              <button
                key={key}
                onClick={() => setSelectedMetric(key)}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  selectedMetric === key
                    ? 'shadow-lg transform scale-105'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
                style={{
                  backgroundColor: selectedMetric === key ? info.color : undefined,
                  color: selectedMetric === key ? 'white' : '#374151'
                }}
              >
                {info.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              {metrics[selectedMetric].name} per län
            </h2>
            <div className="grid grid-cols-3 gap-2">
              {sortedLans.map(lan => {
                const value = getValue(lan, selectedMetric);
                const isActive = displayLan === lan;
                return (
                  <div
                    key={lan}
                    className={`p-3 rounded-lg cursor-pointer transition-all ${
                      isActive ? 'ring-4 ring-offset-2 shadow-xl transform scale-105' : 'hover:shadow-md'
                    }`}
                    style={{
                      backgroundColor: getColorScale(value, selectedMetric),
                      ringColor: metrics[selectedMetric].color
                    }}
                    onClick={() => setSelectedLan(lan === selectedLan ? null : lan)}
                    onMouseEnter={() => setHoveredLan(lan)}
                    onMouseLeave={() => setHoveredLan(null)}
                  >
                    <div className="text-white">
                      <div className="font-semibold text-sm mb-1">{lan}</div>
                      <div className="text-xl font-bold">
                        {value.toLocaleString('sv-SE')}
                      </div>
                      <div className="text-xs opacity-90">{metrics[selectedMetric].unit}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Sveriges Energimix</h2>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={energyMix}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {energyMix.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value.toLocaleString('sv-SE')} GWh`} />
                </PieChart>
              </ResponsiveContainer>
              <div className="text-center text-sm text-gray-600 mt-2">
                Total: {totalEnergy.toLocaleString('sv-SE')} GWh
              </div>
            </div>

            {displayLan && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">{displayLan}</h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-gray-600">Vindkraft:</span>
                    <span className="font-bold text-blue-600">
                      {lansData[displayLan].wind.toLocaleString('sv-SE')} GWh
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-gray-600">Vattenkraft:</span>
                    <span className="font-bold text-cyan-600">
                      {lansData[displayLan].hydro.toLocaleString('sv-SE')} GWh
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-gray-600">Solkraft:</span>
                    <span className="font-bold text-amber-600">
                      {lansData[displayLan].solar.toLocaleString('sv-SE')} GWh
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-gray-600">Total produktion:</span>
                    <span className="font-bold text-green-600">
                      {lansData[displayLan].total.toLocaleString('sv-SE')} GWh
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Per invånare:</span>
                    <span className="font-bold text-purple-600">
                      {getValue(displayLan, 'perCapita').toLocaleString('sv-SE')} kWh
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Topp 10 län - {metrics[selectedMetric].name}
          </h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={topLans}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
              <YAxis label={{ value: metrics[selectedMetric].unit, angle: -90, position: 'insideLeft' }} />
              <Tooltip formatter={(value) => `${value.toLocaleString('sv-SE')} ${metrics[selectedMetric].unit}`} />
              <Bar dataKey="value" fill={metrics[selectedMetric].color} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <footer className="mt-8 text-center text-sm text-gray-600">
          <p>
            Data källa: Energimyndigheten och SCB (2023). Visualisering skapad med öppen data enligt CC0-licens.
          </p>
          <p className="mt-2">
            Klicka på länsrutorna för att se detaljerad information. Hovra för snabbvy.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default SwedishEnergyVisualization;
