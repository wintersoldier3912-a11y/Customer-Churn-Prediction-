
import React, { useState } from 'react';
import { LayoutDashboard, Target, BarChart3, Code2, Menu, X, Phone, User, Activity } from 'lucide-react';
import { TabType } from './types';
import Dashboard from './components/Dashboard';
import Predictor from './components/Predictor';
import ModelMetrics from './components/ModelMetrics';
import CodeViewer from './components/CodeViewer';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>(TabType.DASHBOARD);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const NavItem: React.FC<{ tab: TabType; icon: React.ReactNode; label: string }> = ({ tab, icon, label }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`flex items-center space-x-3 w-full px-4 py-3 rounded-xl transition-all duration-200 ${
        activeTab === tab 
          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
          : 'text-slate-500 hover:bg-slate-100'
      }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 lg:translate-x-0 lg:static ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6">
          <div className="flex items-center space-x-2 mb-8">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Activity className="text-white w-6 h-6" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-800">ChurnGuard</span>
          </div>
          
          <nav className="space-y-2">
            <NavItem tab={TabType.DASHBOARD} icon={<LayoutDashboard size={20} />} label="EDA Dashboard" />
            <NavItem tab={TabType.PREDICTOR} icon={<Target size={20} />} label="Risk Predictor" />
            <NavItem tab={TabType.METRICS} icon={<BarChart3 size={20} />} label="Model Evaluation" />
            <NavItem tab={TabType.PYTHON_CODE} icon={<Code2 size={20} />} label="Python Source" />
          </nav>
        </div>

        <div className="absolute bottom-0 w-full p-6 border-t border-slate-100">
          <div className="flex items-center space-x-3 text-slate-400 mb-4">
            <Phone size={16} />
            <span className="text-xs">Telco Dataset v1.4</span>
          </div>
          <div className="flex items-center space-x-3 text-slate-400">
            <User size={16} />
            <span className="text-xs">Data Scientist Admin</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-40">
          <div className="flex items-center lg:hidden">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 -ml-2 text-slate-500">
              {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
          <h1 className="text-lg font-semibold text-slate-800">
            {activeTab === TabType.DASHBOARD && "Exploratory Data Analysis"}
            {activeTab === TabType.PREDICTOR && "Individual Churn Prediction"}
            {activeTab === TabType.METRICS && "Model Performance Metrics"}
            {activeTab === TabType.PYTHON_CODE && "Source Code Repository"}
          </h1>
          <div className="flex items-center space-x-4">
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">Model: Active</span>
            <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden">
               <img src="https://picsum.photos/seed/admin/40/40" alt="avatar" />
            </div>
          </div>
        </header>

        <div className="p-8 overflow-y-auto">
          {activeTab === TabType.DASHBOARD && <Dashboard />}
          {activeTab === TabType.PREDICTOR && <Predictor />}
          {activeTab === TabType.METRICS && <ModelMetrics />}
          {activeTab === TabType.PYTHON_CODE && <CodeViewer />}
        </div>
      </main>
    </div>
  );
};

export default App;
