
import React, { useState, useEffect } from 'react';
import { Download, FileText, MessageSquare } from 'lucide-react';

const ModelMetrics: React.FC = () => {
  const [feedbackCount, setFeedbackCount] = useState(0);

  useEffect(() => {
    const csv = localStorage.getItem('outputs/feedback.csv');
    if (csv) {
      const lines = csv.trim().split('\n');
      setFeedbackCount(lines.length - 1); // Subtract header
    }
  }, []);

  const metrics = [
    { name: 'Recall (Target)', value: '0.84', benchmark: '0.72', desc: 'Ability to catch churners' },
    { name: 'Precision', value: '0.52', benchmark: '0.48', desc: 'Reliability of alerts' },
    { name: 'F1 Score', value: '0.64', benchmark: '0.58', desc: 'Harmonic mean of both' },
    { name: 'ROC-AUC', value: '0.87', benchmark: '0.81', desc: 'Model discrimination power' }
  ];

  const downloadFeedbackCSV = () => {
    const csvContent = localStorage.getItem('outputs/feedback.csv');
    if (!csvContent) return alert("No feedback data available.");
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'feedback.csv';
    a.click();
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((m, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10">
                <div className="text-4xl font-black">#0{i+1}</div>
             </div>
             <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">{m.name}</p>
             <h3 className="text-3xl font-black text-slate-800 mt-2">{m.value}</h3>
             <p className="text-xs text-slate-400 mt-1">{m.desc}</p>
             <div className="mt-4 pt-4 border-t border-slate-50 flex justify-between items-center">
               <span className="text-[10px] text-slate-400 font-bold">vs Baseline:</span>
               <span className="text-xs font-bold text-green-500">+{Math.round((parseFloat(m.value)/parseFloat(m.benchmark) - 1)*100)}%</span>
             </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Confusion Matrix (Optimal Threshold: 0.38)</h3>
          <div className="grid grid-cols-3 gap-4">
             <div className="col-start-2 text-center text-xs font-bold text-slate-500 pb-2 border-b border-slate-100">PREDICTED: NO</div>
             <div className="col-start-3 text-center text-xs font-bold text-slate-500 pb-2 border-b border-slate-100">PREDICTED: YES</div>
             
             <div className="flex items-center font-bold text-slate-500 text-xs border-r border-slate-100 pr-2 uppercase">Actual: No</div>
             <div className="bg-slate-50 p-6 rounded-xl text-center">
                <div className="text-2xl font-bold text-slate-400">932</div>
                <div className="text-[10px] text-slate-400 uppercase mt-1">True Negative</div>
             </div>
             <div className="bg-rose-50 p-6 rounded-xl text-center border border-rose-100">
                <div className="text-2xl font-bold text-rose-500">142</div>
                <div className="text-[10px] text-rose-500 uppercase mt-1">False Positive</div>
             </div>

             <div className="flex items-center font-bold text-slate-500 text-xs border-r border-slate-100 pr-2 uppercase">Actual: Yes</div>
             <div className="bg-amber-50 p-6 rounded-xl text-center border border-amber-100">
                <div className="text-2xl font-bold text-amber-500">64</div>
                <div className="text-[10px] text-amber-500 uppercase mt-1">False Negative</div>
             </div>
             <div className="bg-green-50 p-6 rounded-xl text-center border border-green-100">
                <div className="text-2xl font-bold text-green-500">321</div>
                <div className="text-[10px] text-green-500 uppercase mt-1">True Positive</div>
             </div>
          </div>
          <div className="mt-8 p-4 bg-indigo-50 border border-indigo-100 rounded-xl">
             <p className="text-xs text-indigo-700 leading-relaxed">
               <strong>Insight:</strong> By lowering the threshold to 0.38, we successfully identified 84% of churners (True Positives), allowing proactive intervention at the cost of a slightly higher False Positive rate.
             </p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm flex flex-col">
           <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
             <MessageSquare size={20} className="text-indigo-500" />
             Feedback Analysis
           </h3>
           <div className="flex-1 space-y-6">
             <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
               <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Feedback Entries Collected</p>
               <h4 className="text-3xl font-black text-slate-800 mt-1">{feedbackCount}</h4>
               <p className="text-[10px] text-slate-400 mt-1 italic">Real-world accuracy verification log</p>
             </div>
             
             <div className="space-y-4">
               <h5 className="text-xs font-bold text-slate-700 uppercase tracking-widest">Log Maintenance</h5>
               <div className="space-y-2">
                 <button 
                  onClick={downloadFeedbackCSV}
                  disabled={feedbackCount === 0}
                  className="w-full flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50"
                 >
                   <span className="flex items-center gap-2">
                     <FileText size={16} className="text-indigo-500" />
                     outputs/feedback.csv
                   </span>
                   <Download size={16} />
                 </button>
               </div>
             </div>
           </div>
           <div className="mt-8 p-4 bg-amber-50 border border-amber-100 rounded-xl">
             <p className="text-[10px] text-amber-700 leading-relaxed font-medium">
               This feedback loop is vital for model retraining (Step 3). Regularly export these logs to evaluate edge cases where prediction confidence differs from human assessment.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelMetrics;
