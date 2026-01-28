
import React, { useState } from 'react';
import { CustomerData, ChurnPrediction } from '../types';
import { predictChurn } from '../services/gemini';
import { ShieldAlert, CheckCircle2, Info, Loader2, RefreshCcw, Target, Star, Send, Download, UserCircle, Briefcase, CreditCard, BarChart as BarChartIcon } from 'lucide-react';

const INITIAL_DATA: CustomerData = {
  gender: 'Female',
  SeniorCitizen: 0,
  Partner: 'Yes',
  Dependents: 'No',
  tenure: 12,
  PhoneService: 'Yes',
  MultipleLines: 'No',
  InternetService: 'Fiber optic',
  OnlineSecurity: 'No',
  OnlineBackup: 'No',
  DeviceProtection: 'No',
  TechSupport: 'No',
  StreamingTV: 'No',
  StreamingMovies: 'No',
  Contract: 'Month-to-month',
  PaperlessBilling: 'Yes',
  PaymentMethod: 'Electronic check',
  MonthlyCharges: 70.35,
  TotalCharges: 844.20
};

const Predictor: React.FC = () => {
  const [formData, setFormData] = useState<CustomerData>(INITIAL_DATA);
  const [prediction, setPrediction] = useState<ChurnPrediction | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Feedback state
  const [rating, setRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const handlePredict = async () => {
    setLoading(true);
    setFeedbackSubmitted(false);
    setRating(0);
    setFeedbackText('');
    try {
      const result = await predictChurn(formData);
      setPrediction(result);
    } catch (err) {
      alert("Error generating prediction. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleFeedbackSubmit = () => {
    if (!prediction) return;

    const csvHeader = "Timestamp,Rating,Feedback,Tenure,Contract,InternetService,MonthlyCharges,TotalCharges,RiskCategory,Probability\n";
    const existingCSV = localStorage.getItem('outputs/feedback.csv') || csvHeader;

    const sanitizedFeedback = feedbackText.replace(/"/g, '""');
    
    const newRow = [
      new Date().toISOString(),
      rating,
      `"${sanitizedFeedback}"`,
      formData.tenure,
      formData.Contract,
      formData.InternetService,
      formData.MonthlyCharges,
      formData.TotalCharges,
      prediction.riskCategory,
      prediction.probability
    ].join(',') + "\n";

    const updatedCSV = existingCSV + newRow;
    localStorage.setItem('outputs/feedback.csv', updatedCSV);
    setFeedbackSubmitted(true);
  };

  const downloadFeedback = () => {
    const csvContent = localStorage.getItem('outputs/feedback.csv');
    if (!csvContent) return alert("No feedback data available to download.");
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "churn_feedback_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: (name === 'tenure' || name === 'MonthlyCharges' || name === 'TotalCharges' || name === 'SeniorCitizen') 
        ? parseFloat(value) 
        : value
    }));
  };

  const FormSection: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
    <div className="mb-8 last:mb-0">
      <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
        <span className="text-indigo-600">{icon}</span>
        <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider">{title}</h4>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {children}
      </div>
    </div>
  );

  const FormField: React.FC<{ label: string; name: string; children: React.ReactNode }> = ({ label, name, children }) => (
    <div>
      <label htmlFor={name} className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-tighter">{label}</label>
      {children}
    </div>
  );

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start pb-12">
      {/* Input Section */}
      <div className="xl:col-span-2 space-y-6">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
               Predictive Risk Input Form
            </h3>
            <div className="flex items-center gap-3">
              <button 
                onClick={downloadFeedback}
                className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 rounded-lg text-[10px] font-bold uppercase transition-all shadow-sm"
                title="Download all collected feedback logs in CSV format"
              >
                <Download size={14} /> Export Feedback CSV
              </button>
              <span className="text-[10px] bg-indigo-100 text-indigo-700 px-2 py-1.5 rounded font-bold uppercase tracking-wider">Manual Overrides</span>
            </div>
          </div>

          <FormSection title="Customer Demographics" icon={<UserCircle size={18} />}>
            <FormField label="Gender" name="gender">
              <select name="gender" value={formData.gender} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500">
                <option>Female</option>
                <option>Male</option>
              </select>
            </FormField>
            <FormField label="Senior Citizen" name="SeniorCitizen">
              <select name="SeniorCitizen" value={formData.SeniorCitizen} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="0">No</option>
                <option value="1">Yes</option>
              </select>
            </FormField>
            <FormField label="Partner" name="Partner">
              <select name="Partner" value={formData.Partner} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500">
                <option>No</option>
                <option>Yes</option>
              </select>
            </FormField>
            <FormField label="Dependents" name="Dependents">
              <select name="Dependents" value={formData.Dependents} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500">
                <option>No</option>
                <option>Yes</option>
              </select>
            </FormField>
          </FormSection>

          <FormSection title="Account & Services" icon={<Briefcase size={18} />}>
            <FormField label="Contract Type" name="Contract">
              <select name="Contract" value={formData.Contract} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500">
                <option>Month-to-month</option>
                <option>One year</option>
                <option>Two year</option>
              </select>
            </FormField>
            <FormField label="Tenure (Months)" name="tenure">
              <input type="number" name="tenure" value={formData.tenure} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500" />
            </FormField>
            <FormField label="Phone Service" name="PhoneService">
              <select name="PhoneService" value={formData.PhoneService} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500">
                <option>No</option>
                <option>Yes</option>
              </select>
            </FormField>
            <FormField label="Multiple Lines" name="MultipleLines">
              <select name="MultipleLines" value={formData.MultipleLines} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500">
                <option>No</option>
                <option>Yes</option>
                <option>No phone service</option>
              </select>
            </FormField>
            <FormField label="Internet Service" name="InternetService">
              <select name="InternetService" value={formData.InternetService} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500">
                <option>DSL</option>
                <option>Fiber optic</option>
                <option>No</option>
              </select>
            </FormField>
            <FormField label="Online Security" name="OnlineSecurity">
              <select name="OnlineSecurity" value={formData.OnlineSecurity} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500">
                <option>No</option>
                <option>Yes</option>
                <option>No internet service</option>
              </select>
            </FormField>
            <FormField label="Online Backup" name="OnlineBackup">
              <select name="OnlineBackup" value={formData.OnlineBackup} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500">
                <option>No</option>
                <option>Yes</option>
                <option>No internet service</option>
              </select>
            </FormField>
            <FormField label="Device Protection" name="DeviceProtection">
              <select name="DeviceProtection" value={formData.DeviceProtection} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500">
                <option>No</option>
                <option>Yes</option>
                <option>No internet service</option>
              </select>
            </FormField>
            <FormField label="Tech Support" name="TechSupport">
              <select name="TechSupport" value={formData.TechSupport} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500">
                <option>No</option>
                <option>Yes</option>
                <option>No internet service</option>
              </select>
            </FormField>
            <FormField label="Streaming TV" name="StreamingTV">
              <select name="StreamingTV" value={formData.StreamingTV} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500">
                <option>No</option>
                <option>Yes</option>
                <option>No internet service</option>
              </select>
            </FormField>
            <FormField label="Streaming Movies" name="StreamingMovies">
              <select name="StreamingMovies" value={formData.StreamingMovies} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500">
                <option>No</option>
                <option>Yes</option>
                <option>No internet service</option>
              </select>
            </FormField>
          </FormSection>

          <FormSection title="Billing & Payment" icon={<CreditCard size={18} />}>
            <FormField label="Paperless Billing" name="PaperlessBilling">
              <select name="PaperlessBilling" value={formData.PaperlessBilling} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500">
                <option>No</option>
                <option>Yes</option>
              </select>
            </FormField>
            <FormField label="Payment Method" name="PaymentMethod">
              <select name="PaymentMethod" value={formData.PaymentMethod} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500">
                <option>Electronic check</option>
                <option>Mailed check</option>
                <option>Bank transfer (automatic)</option>
                <option>Credit card (automatic)</option>
              </select>
            </FormField>
            <FormField label="Monthly Charges ($)" name="MonthlyCharges">
              <input type="number" name="MonthlyCharges" value={formData.MonthlyCharges} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500" />
            </FormField>
            <FormField label="Total Charges ($)" name="TotalCharges">
              <input type="number" name="TotalCharges" value={formData.TotalCharges} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500" />
            </FormField>
          </FormSection>

          <div className="mt-8 flex justify-end">
            <button 
              onClick={handlePredict}
              disabled={loading}
              className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors flex items-center gap-2 disabled:opacity-50 shadow-lg shadow-indigo-100"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <RefreshCcw size={20} />}
              Analyze Churn Risk
            </button>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="space-y-6">
        {prediction ? (
          <>
            <div className={`p-8 rounded-2xl shadow-lg border-2 ${
              prediction.riskCategory === 'High' ? 'bg-rose-50 border-rose-200' : 
              prediction.riskCategory === 'Medium' ? 'bg-amber-50 border-amber-200' : 'bg-emerald-50 border-emerald-200'
            }`}>
              <div className="flex justify-between items-start mb-6">
                 <div>
                    <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Risk Level</h4>
                    <p className={`text-3xl font-black ${
                      prediction.riskCategory === 'High' ? 'text-rose-600' : 
                      prediction.riskCategory === 'Medium' ? 'text-amber-600' : 'text-emerald-600'
                    }`}>{prediction.riskCategory}</p>
                 </div>
                 {prediction.riskCategory === 'High' ? <ShieldAlert className="text-rose-500" size={40} /> : <CheckCircle2 className="text-emerald-500" size={40} />}
              </div>
              
              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-slate-600">Probability</span>
                  <span className="text-sm font-bold text-slate-800">{(prediction.probability * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full transition-all duration-1000 ${
                      prediction.riskCategory === 'High' ? 'bg-rose-500' : 
                      prediction.riskCategory === 'Medium' ? 'bg-amber-500' : 'bg-emerald-500'
                    }`} 
                    style={{width: `${prediction.probability * 100}%`}}
                  ></div>
                </div>
              </div>

              {/* SHAP Explanation Visual Chart */}
              <div className="space-y-4 pt-4 border-t border-slate-200/50">
                <h5 className="text-xs font-bold text-slate-700 flex items-center gap-2 uppercase tracking-widest">
                  <BarChartIcon size={14} className="text-indigo-500" /> SHAP Contribution Plot
                </h5>
                <div className="space-y-3">
                  {prediction.drivers.map((driver, idx) => {
                    const impactVal = Math.round(driver.impact * 100);
                    const isPositive = impactVal > 0;
                    return (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between items-center text-[10px] font-bold">
                          <span className="text-slate-800">{driver.feature}</span>
                          <span className={isPositive ? 'text-rose-600' : 'text-emerald-600'}>
                            {isPositive ? '+' : ''}{impactVal} SHAP
                          </span>
                        </div>
                        <div className="relative h-4 bg-slate-100 rounded-sm overflow-hidden flex items-center">
                          {/* Zero line */}
                          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-slate-300 z-10"></div>
                          {/* Impact Bar */}
                          <div 
                            className={`h-full absolute transition-all duration-700 ${isPositive ? 'bg-rose-400' : 'bg-emerald-400'}`}
                            style={{
                              left: isPositive ? '50%' : `calc(50% - ${Math.abs(impactVal)}%)`,
                              width: `${Math.abs(impactVal)}%`
                            }}
                          ></div>
                        </div>
                        <p className="text-[10px] text-slate-500 leading-tight italic px-1">{driver.description}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
               <h4 className="text-sm font-bold text-slate-800 mb-3 uppercase tracking-wider">Recommended Action</h4>
               <p className="text-sm text-slate-600 leading-relaxed italic mb-4">
                 "{prediction.explanation}"
               </p>
               <button className="w-full py-2.5 bg-slate-800 text-white text-xs font-bold rounded-lg hover:bg-slate-900 transition-colors uppercase tracking-widest">
                 Log Retention Outreach
               </button>
            </div>

            <div className="bg-indigo-50 p-6 rounded-2xl shadow-sm border border-indigo-100">
               <h4 className="text-xs font-bold text-indigo-700 mb-4 uppercase tracking-widest flex items-center gap-2">
                 <Send size={14} /> Was this accurate?
               </h4>
               {feedbackSubmitted ? (
                 <div className="text-center py-4">
                    <CheckCircle2 className="mx-auto text-emerald-500 mb-2" size={32} />
                    <p className="text-sm font-bold text-slate-800">Feedback Saved</p>
                    <p className="text-xs text-slate-500 mt-1">Logged to internal database</p>
                    <button 
                      onClick={downloadFeedback}
                      className="mt-3 flex items-center gap-2 mx-auto text-xs font-bold text-indigo-600 hover:text-indigo-800"
                    >
                      <Download size={14} /> Export CSV
                    </button>
                 </div>
               ) : (
                 <div className="space-y-4">
                   <div className="flex items-center justify-center gap-2">
                     {[1, 2, 3, 4, 5].map((star) => (
                       <button 
                         key={star} 
                         onClick={() => setRating(star)}
                         className={`transition-colors ${rating >= star ? 'text-amber-400' : 'text-slate-300'}`}
                       >
                         <Star size={24} fill={rating >= star ? 'currentColor' : 'none'} />
                       </button>
                     ))}
                   </div>
                   <textarea 
                     value={feedbackText}
                     onChange={(e) => setFeedbackText(e.target.value)}
                     placeholder="Notes on actual customer status..."
                     className="w-full bg-white border border-indigo-100 rounded-lg p-3 text-xs outline-none focus:ring-2 focus:ring-indigo-400 resize-none h-20"
                   />
                   <button 
                     disabled={!rating}
                     onClick={handleFeedbackSubmit}
                     className="w-full py-2 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-md shadow-indigo-100"
                   >
                     Submit Feedback
                   </button>
                 </div>
               )}
            </div>
          </>
        ) : (
          <div className="h-[500px] flex flex-col items-center justify-center bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 p-8 text-center">
            <Target size={48} className="mb-4 opacity-20" />
            <p className="font-medium">Ready for Prediction</p>
            <p className="text-xs mt-2">Adjust the customer profile on the left and click 'Analyze' to generate AI insights.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Predictor;
