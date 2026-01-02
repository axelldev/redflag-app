import { useState } from "react";
import type { AnalysisResponse } from "@/types/analysis";

export const useProfileAnalysis = () => {
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeProfile = async (imageBase64: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: imageBase64,
          mediaType: "image/jpeg",
        }),
      });

      if (!response.ok) {
        throw new Error("Analysis failed");
      }

      const data: AnalysisResponse = await response.json();
      setAnalysis(data);
    } catch {
      setError("Failed to analyze profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const clearAnalysis = () => {
    setAnalysis(null);
    setError(null);
  };

  return {
    analysis,
    isLoading,
    error,
    analyzeProfile,
    clearAnalysis,
  };
};
