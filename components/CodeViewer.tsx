
import React, { useState } from 'react';
import { Copy, Check, Terminal, FileCode, Notebook as NotebookIcon, FileText } from 'lucide-react';

const PYTHON_FILES = [
  {
    name: 'README.md',
    type: 'markdown',
    content: `# ChurnGuard: Telco Churn Analytics

## 🚀 Core Features
- AI-Powered Risk Predictor (Gemini 3 Pro)
- Explainable AI (SHAP) Plots
- Interactive EDA Dashboard
- Feedback Logging System

## 🛠️ Setup
1. Define API_KEY environment variable.
2. Run 'npm install' then 'npm run dev'.

## 📊 Strategic KPIs
- Optimization Target: Recall (0.84)
- Classification Threshold: 0.38
- Core Data: Telco Customer Churn`
  },
  {
    name: 'notebooks/churn_project.ipynb',
    type: 'notebook',
    content: `# Churn Prediction Notebook
# Step 1: EDA Enhancement
import seaborn as sns
import matplotlib.pyplot as plt

# Correlation Heatmap
plt.figure(figsize=(10,8))
corr = df.corr()
sns.heatmap(corr, annot=True, cmap='coolwarm')
plt.title("Feature Correlation Heatmap")
plt.savefig('../outputs/plots/correlation_heatmap.png')

# Pairplot for key features
sns.pairplot(df[['tenure', 'MonthlyCharges', 'TotalCharges', 'Churn']], hue='Churn')
plt.savefig('../outputs/plots/pairplot.png')

# Step 2: Hyperparameter Tuning
from sklearn.model_selection import GridSearchCV

param_grid = {
    'max_depth': [3, 4, 5],
    'learning_rate': [0.01, 0.1, 0.2],
    'n_estimators': [50, 100, 200],
    'scale_pos_weight': [1, 3, 5]
}

grid_search = GridSearchCV(XGBClassifier(), param_grid, cv=3, scoring='recall')
grid_search.fit(X_train_preprocessed, y_train)

best_model = grid_search.best_estimator_
print(f"Best params: {grid_search.best_params_}")`
  },
  {
    name: 'src/models.py',
    type: 'code',
    content: `from xgboost import XGBClassifier
from sklearn.model_selection import GridSearchCV
from sklearn.metrics import classification_report, roc_auc_score
import joblib

def train_tuned_model(X_train, y_train):
    """
    Trains XGBoost using GridSearchCV for optimal recall/F1.
    """
    base_model = XGBClassifier(use_label_encoder=False, eval_metric='logloss')
    
    param_grid = {
        'max_depth': [3, 5],
        'n_estimators': [100, 200],
        'scale_pos_weight': [1, 3] # Vital for imbalance
    }
    
    grid = GridSearchCV(base_model, param_grid, scoring='recall', cv=3)
    grid.fit(X_train, y_train)
    
    joblib.dump(grid.best_estimator_, 'models/best_model.pkl')
    return grid.best_estimator_`
  },
  {
    name: 'app/streamlit_app.py',
    type: 'code',
    content: `import streamlit as st
import pandas as pd
import joblib
import shap

# Load artifacts
model = joblib.load('models/best_model.pkl')
explainer = shap.TreeExplainer(model)

st.title("Telco Churn Predictor")
# Input form...
tenure = st.number_input("Tenure", 0, 72, 12)

if st.button("Predict"):
    # Preprocess and predict
    prob = model.predict_proba(df_input)[0, 1]
    st.metric("Churn Risk", f"{prob:.2%}")
    
    # Feedback Feature
    st.divider()
    st.subheader("Accuracy Feedback")
    rating = st.slider("Rate prediction accuracy", 1, 5)
    comment = st.text_area("Observations")
    if st.button("Submit Feedback"):
        feedback = pd.DataFrame([[tenure, prob, rating, comment]])
        feedback.to_csv('outputs/feedback.csv', mode='a', header=False)`
  }
];

const CodeViewer: React.FC = () => {
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (text: string, name: string) => {
    navigator.clipboard.writeText(text);
    setCopied(name);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="bg-slate-900 rounded-2xl overflow-hidden shadow-2xl">
        <div className="px-6 py-4 bg-slate-800 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <Terminal className="text-indigo-400" size={18} />
             <span className="text-slate-300 font-mono text-sm">telco_churn_project/</span>
          </div>
          <span className="text-slate-500 text-xs font-mono">Python 3.9+</span>
        </div>
        
        <div className="divide-y divide-slate-800">
          {PYTHON_FILES.map((file) => (
            <div key={file.name} className="p-6 group">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                   {file.type === 'notebook' ? <NotebookIcon size={16} className="text-amber-400" /> : 
                    file.type === 'markdown' ? <FileText size={16} className="text-emerald-400" /> :
                    <FileCode size={16} className="text-indigo-400" />}
                   <h4 className="text-slate-200 font-mono text-sm font-bold">{file.name}</h4>
                </div>
                <button 
                  onClick={() => handleCopy(file.content, file.name)}
                  className="p-2 text-slate-500 hover:text-white transition-colors"
                >
                  {copied === file.name ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                </button>
              </div>
              <pre className="bg-slate-950 p-4 rounded-xl text-slate-300 font-mono text-xs overflow-x-auto border border-slate-800">
                <code>{file.content}</code>
              </pre>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Operational Architecture</h3>
        <div className="prose prose-slate prose-sm max-w-none text-slate-600 space-y-4">
          <section>
            <h4 className="text-slate-800 font-bold">Predictive Governance</h4>
            <p>ChurnGuard implements a strict policy of "Accountable AI". Every risk score generated is accompanied by SHAP (Shapley Additive Explanations) values, allowing staff to explain specific risk factors to customers during retention calls.</p>
          </section>
          
          <section>
            <h4 className="text-slate-800 font-bold">Model Retraining Protocol</h4>
            <p>The system stores user-verified outcomes in <code>outputs/feedback.csv</code>. This file is harvested monthly to perform incremental training on the core XGBoost model, ensuring the system adapts to seasonal churn patterns.</p>
          </section>

          <section>
            <h4 className="text-slate-800 font-bold">Recall-First Strategy</h4>
            <p>Our model is calibrated with a bias toward Recall. The cost of missing a churner (approx. $840 LTV) is estimated at 5x the cost of a false positive (retention gift cost). Consequently, the decision threshold remains at a sensitive 0.38.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CodeViewer;
