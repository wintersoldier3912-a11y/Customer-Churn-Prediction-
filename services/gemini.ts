
import { GoogleGenAI, Type } from "@google/genai";
import { CustomerData, ChurnPrediction } from "../types";

/**
 * Predicts customer churn risk using Gemini AI.
 * Adheres to @google/genai guidelines for SDK initialization and content generation.
 */
export const predictChurn = async (data: CustomerData): Promise<ChurnPrediction> => {
  // Always initialize with process.env.API_KEY directly as required by guidelines
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `Analyze this customer data for churn risk based on the Telco Churn dataset logic:
  ${JSON.stringify(data, null, 2)}
  
  Provide a prediction in JSON format following this schema:
  {
    "probability": number (0-1),
    "riskCategory": "Low" | "Medium" | "High",
    "drivers": [
      { 
        "feature": "string", 
        "impact": number, 
        "description": "string" 
      }
    ],
    "explanation": "string summary"
  }
  
  Guidelines for 'drivers' (SHAP explanations):
  - Return exactly the top 3 most influential features.
  - 'impact' should be a value between -0.5 and 0.5 representing the feature's contribution to the prediction deviation from the baseline.
  - Positive impact means the feature increases churn risk (e.g., Fiber optic service, Month-to-month contract).
  - Negative impact means the feature decreases churn risk (e.g., Long tenure, Online security, Tech support).
  - Optimize for the 'recall' metric (identifying potential churners).`;

  try {
    const response = await ai.models.generateContent({
      // Using gemini-3-pro-preview for complex data reasoning and explanation generation
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            probability: { type: Type.NUMBER },
            riskCategory: { type: Type.STRING },
            drivers: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  feature: { type: Type.STRING },
                  impact: { type: Type.NUMBER },
                  description: { type: Type.STRING }
                },
                required: ["feature", "impact", "description"]
              }
            },
            explanation: { type: Type.STRING }
          },
          required: ["probability", "riskCategory", "drivers", "explanation"]
        }
      }
    });

    // Accessing .text as a property as specified in the guidelines
    const resultText = response.text || "{}";
    return JSON.parse(resultText);
  } catch (error) {
    console.error("Gemini prediction failed:", error);
    throw error;
  }
};
