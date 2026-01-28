# ChurnGuard: Telco Churn Analytics & Retention Platform

## 📊 Project Overview
ChurnGuard is an enterprise-grade analytical solution designed to identify and mitigate customer attrition. It leverages high-performance data visualizations for Exploratory Data Analysis (EDA) and utilizes **Google Gemini 3 Pro** to provide explainable AI (XAI) churn risk assessments for individual customers.

## 🚀 Key Features
- **Proactive Risk Scoring**: Real-time churn probability calculations via the Gemini API.
- **Explainable AI (SHAP)**: Individual feature attribution plots explaining the "why" behind every prediction.
- **Retention Dashboard**: High-level business KPIs including Churn Rate, Revenue at Risk, and Service Distribution.
- **Model Evaluation**: Transparent metrics including a detailed Confusion Matrix optimized for **Recall**.
- **Human-in-the-loop Feedback**: A closed-loop system where account managers can log the accuracy of AI predictions for future model tuning.

## 🛠️ Setup & Installation

### Prerequisites
- **Node.js**: Version 18.0.0 or higher.
- **API Access**: A valid Gemini API Key from [Google AI Studio](https://aistudio.google.com/).

### Environment Configuration
The application expects a `process.env.API_KEY` variable. This is handled automatically by the deployment environment, but ensure your key is active and has permissions for `gemini-3-pro-preview`.

### Quick Start
1. **Clone & Install**:
   ```bash
   git clone <repository-url>
   npm install
   ```
2. **Development Mode**:
   ```bash
   npm run dev
   ```
3. **Build for Production**:
   ```bash
   npm run build
   ```

## 📝 Data Schema & Guidelines
The model operates on standard Telco churn features:
- **Demographics**: Gender, Senior Citizen status, Partner, Dependents.
- **Services**: Phone, Multiple Lines, Internet (DSL/Fiber), Online Security, Tech Support, etc.
- **Account**: Tenure, Contract type (M-to-M, 1yr, 2yr), Paperless Billing, Payment Method.
- **Financials**: Monthly Charges, Total Charges.

### Strategic Guidelines
- **Priority Metric**: **Recall** (0.84). We value identifying a churner more than avoiding a false alarm.
- **Threshold Tuning**: The current optimal classification threshold is set to **0.38**.
- **Retention Strategy**: Focus on migrating "Month-to-month" subscribers to "One year" contracts, as this segment accounts for 80% of churn.

## 📈 Current Insights
- **Tenure Impact**: Customers staying longer than 12 months show a 60% decrease in churn probability.
- **Service Risk**: Fiber Optic users have significantly higher churn rates (42%) compared to DSL users (19%), indicating service stability or pricing friction.

---
*Developed by the Senior Frontend Engineering Team. Version 1.5.1*
