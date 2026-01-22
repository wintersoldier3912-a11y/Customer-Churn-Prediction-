
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  AreaChart, Area 
} from 'recharts';

const CHURN_DATA = [
  { name: 'Month-to-month', churn: 1655, active: 2220 },
  { name: 'One year', churn: 166, active: 1307 },
  { name: 'Two year', churn: 48, active: 1647 },
];

const TENURE_CHURN = [
  { tenure: '0-12', rate: 0.45 },
  { tenure: '13-24', rate: 0.28 },
  { tenure: '25-36', rate: 0.19 },
  { tenure: '37-48', rate: 0.15 },
  { tenure: '49-60', rate: 0.11 },
  { tenure: '61-72', rate: 0.05 },
];

const HEATMAP_DATA = [
  { x: 'Tenure', y: 'MonthlyCharges', val: 0.25 },
  { x: 'Tenure', y: 'TotalCharges', val: 0.83 },
  { x: 'Tenure', y: 'Churn', val: -0.35 },
  { x: 'MonthlyCharges', y: 'TotalCharges', val: 0.65 },
  { x: 'MonthlyCharges', y: 'Churn', val: 0.19 },
  { x: 'TotalCharges', y: 'Churn', val: -0.20 },
];

const features = ['Tenure', 'MonthlyCharges', 'TotalCharges', 'Churn'];

const Dashboard: React.FC = () => {
  const getHeatmapColor = (val: number) => {
    if (val > 0.5) return 'bg-indigo-600 text-white';
    if (val > 0) return 'bg-indigo-200 text-indigo-900';
    if (val > -0.2) return 'bg-slate-100 text-slate-500';
    return 'bg-rose-200 text-rose-900';
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Customers', value: '7,043', change: '+2.1%', color: 'indigo' },
          { label: 'Churn Rate', value: '26.5%', change: '-0.4%', color: 'rose' },
          { label: 'Avg Monthly Revenue', value: '$64.76', change: '+$1.2', color: 'emerald' },
          { label: 'Retention Score', value: '82/100', change: '+5', color: 'amber' },
        ].map((card, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <p className="text-slate-500 text-sm font-medium">{card.label}</p>
            <div className="flex items-baseline justify-between mt-2">
              <h3 className="text-2xl font-bold text-slate-800">{card.value}</h3>
              <span className={`text-xs font-semibold px-2 py-1 rounded-full bg-${card.color}-50 text-${card.color}-600`}>
                {card.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Plot 1: Churn by Contract Type */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Churn by Contract Type</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={CHURN_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <Tooltip 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                />
                <Legend iconType="circle" />
                <Bar dataKey="active" name="Retention" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="churn" name="Churn" fill="#f43f5e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Plot 2: Churn Probability by Tenure */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Churn Rate vs. Tenure (Months)</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={TENURE_CHURN}>
                <defs>
                  <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="tenure" axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip />
                <Area type="monotone" dataKey="rate" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorRate)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* New Enhanced Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Feature Correlation Matrix</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-separate border-spacing-1">
              <thead>
                <tr>
                  <th className="p-2"></th>
                  {features.map(f => <th key={f} className="p-2 text-xs font-bold text-slate-500 uppercase tracking-wider">{f}</th>)}
                </tr>
              </thead>
              <tbody>
                {features.map((f1) => (
                  <tr key={f1}>
                    <td className="p-2 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">{f1}</td>
                    {features.map((f2) => {
                      const pair = HEATMAP_DATA.find(d => (d.x === f1 && d.y === f2) || (d.x === f2 && d.y === f1));
                      const val = f1 === f2 ? 1.00 : pair ? pair.val : 0;
                      return (
                        <td key={f2} className={`p-4 text-center rounded-lg text-sm font-mono ${getHeatmapColor(val)}`}>
                          {val.toFixed(2)}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-6 text-xs text-slate-500 leading-relaxed">
            <strong>Key Insight:</strong> High negative correlation between <span className="font-bold text-rose-600">Tenure and Churn (-0.35)</span> suggests that the longer a customer stays, the less likely they are to leave. Total charges and Tenure have a massive positive correlation (0.83) as expected.
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Service Churn Distribution</h3>
          <div className="space-y-6">
            {[
              { label: 'Fiber Optic Users', churn: 42, color: 'bg-rose-500' },
              { label: 'DSL Users', churn: 19, color: 'bg-indigo-500' },
              { label: 'No Tech Support', churn: 38, color: 'bg-amber-500' },
              { label: 'With Tech Support', churn: 15, color: 'bg-emerald-500' }
            ].map((item, i) => (
              <div key={i}>
                <div className="flex justify-between text-xs font-bold text-slate-600 mb-2">
                  <span>{item.label}</span>
                  <span>{item.churn}% Churn</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div 
                    className={`${item.color} h-2 rounded-full transition-all duration-1000`} 
                    style={{width: `${item.churn}%`}}
                  ></div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 p-4 bg-slate-50 border border-slate-200 rounded-xl">
             <p className="text-xs text-slate-600 leading-relaxed italic">
               Fiber optic users have the highest churn rate (42%), likely due to higher price points and competitive switching offers.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
