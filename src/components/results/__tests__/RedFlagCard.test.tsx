import type { RedFlag } from "@/types/analysis";
import { render, screen } from "@testing-library/react-native";
import RedFlagCard from "../RedFlagCard";

describe("RedFlagCard", () => {
  const mockFlag: RedFlag = {
    category: "CEO",
    severity: "medium",
    evidence: 'Profile mentions being "Founder & CEO" of 5 different startups',
    analysis: "Excessive title dropping may indicate CEO posturing",
  };

  it("should render all flag information", () => {
    render(<RedFlagCard flag={mockFlag} />);

    expect(screen.getByText("CEO")).toBeTruthy();
    expect(
      screen.getByText(/Profile mentions being "Founder & CEO"/)
    ).toBeTruthy();
    expect(screen.getByText(/Excessive title dropping/)).toBeTruthy();
  });

  it('should render evidence with "Evidence:" prefix', () => {
    render(<RedFlagCard flag={mockFlag} />);

    expect(
      screen.getByText(/Evidence: Profile mentions being "Founder & CEO"/)
    ).toBeTruthy();
  });

  it("should render severity badge with uppercase text", () => {
    render(<RedFlagCard flag={mockFlag} />);
    expect(screen.getByText("MEDIUM")).toBeTruthy();
  });

  describe("severity badge rendering", () => {
    it("should render high severity badge", () => {
      const highSeverityFlag: RedFlag = {
        ...mockFlag,
        severity: "high",
      };

      render(<RedFlagCard flag={highSeverityFlag} />);
      expect(screen.getByText("HIGH")).toBeTruthy();
    });

    it("should render medium severity badge", () => {
      const mediumSeverityFlag: RedFlag = {
        ...mockFlag,
        severity: "medium",
      };

      render(<RedFlagCard flag={mediumSeverityFlag} />);
      expect(screen.getByText("MEDIUM")).toBeTruthy();
    });

    it("should render low severity badge", () => {
      const lowSeverityFlag: RedFlag = {
        ...mockFlag,
        severity: "low",
      };

      render(<RedFlagCard flag={lowSeverityFlag} />);
      expect(screen.getByText("LOW")).toBeTruthy();
    });
  });

  describe("different severity levels", () => {
    it("should render card with high severity", () => {
      const highSeverityFlag: RedFlag = {
        ...mockFlag,
        severity: "high",
      };

      render(<RedFlagCard flag={highSeverityFlag} />);
      expect(screen.getByText("CEO")).toBeTruthy();
      expect(screen.getByText("HIGH")).toBeTruthy();
    });

    it("should render card with medium severity", () => {
      render(<RedFlagCard flag={mockFlag} />);
      expect(screen.getByText("CEO")).toBeTruthy();
      expect(screen.getByText("MEDIUM")).toBeTruthy();
    });

    it("should render card with low severity", () => {
      const lowSeverityFlag: RedFlag = {
        ...mockFlag,
        severity: "low",
      };

      render(<RedFlagCard flag={lowSeverityFlag} />);
      expect(screen.getByText("CEO")).toBeTruthy();
      expect(screen.getByText("LOW")).toBeTruthy();
    });
  });

  it("should render different category types correctly", () => {
    const categories: RedFlag["category"][] = [
      "CEO",
      "TechBro",
      "AI Bro",
      "Crypto",
      "NFT",
    ];

    categories.forEach((category) => {
      const flag: RedFlag = {
        ...mockFlag,
        category,
      };

      const { getByText } = render(<RedFlagCard flag={flag} />);
      expect(getByText(category)).toBeTruthy();
    });
  });
});
