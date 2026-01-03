import { render, screen } from '@testing-library/react-native';
import AnalysisResults from '../AnalysisResults';
import {
  validAnalysisResponse,
  invalidAnalysisResponse,
  cleanProfileResponse,
  highRiskProfileResponse,
} from '@/__tests__/fixtures/analysisResponses';

describe('AnalysisResults', () => {
  it('should render title', () => {
    render(<AnalysisResults analysis={validAnalysisResponse} />);
    expect(screen.getByText('Analysis Results')).toBeTruthy();
  });

  it('should render RiskScore with correct score', () => {
    render(<AnalysisResults analysis={validAnalysisResponse} />);
    expect(screen.getByText('45/100')).toBeTruthy();
    expect(screen.getByText('Risk Score')).toBeTruthy();
  });

  it('should render validation warning when invalid', () => {
    render(<AnalysisResults analysis={invalidAnalysisResponse} />);

    expect(
      screen.getByText('This does not appear to be a valid X/Twitter profile screenshot')
    ).toBeTruthy();
  });

  it('should not render summary when invalid', () => {
    render(<AnalysisResults analysis={invalidAnalysisResponse} />);

    // Summary should be empty and not rendered
    expect(screen.queryByText(validAnalysisResponse.summary)).toBeNull();
  });

  it('should not render RedFlagsList when invalid', () => {
    render(<AnalysisResults analysis={invalidAnalysisResponse} />);

    // Should not show the red flags title
    expect(screen.queryByText('Red Flags Detected:')).toBeNull();
  });

  it('should render summary when valid', () => {
    render(<AnalysisResults analysis={validAnalysisResponse} />);

    expect(screen.getByText(validAnalysisResponse.summary)).toBeTruthy();
  });

  it('should render RedFlagsList when valid', () => {
    render(<AnalysisResults analysis={validAnalysisResponse} />);

    expect(screen.getByText('Red Flags Detected:')).toBeTruthy();
    expect(screen.getByText('CEO')).toBeTruthy();
  });

  it('should render clean profile message when valid with no flags', () => {
    render(<AnalysisResults analysis={cleanProfileResponse} />);

    expect(
      screen.getByText(/No significant red flags detected! This profile appears genuine./)
    ).toBeTruthy();
  });

  it('should render all components for valid analysis', () => {
    render(<AnalysisResults analysis={validAnalysisResponse} />);

    // Should have title
    expect(screen.getByText('Analysis Results')).toBeTruthy();

    // Should have risk score
    expect(screen.getByText('45/100')).toBeTruthy();

    // Should have summary
    expect(screen.getByText(validAnalysisResponse.summary)).toBeTruthy();

    // Should have flags list title
    expect(screen.getByText('Red Flags Detected:')).toBeTruthy();
  });

  it('should render high risk profile correctly', () => {
    render(<AnalysisResults analysis={highRiskProfileResponse} />);

    expect(screen.getByText('85/100')).toBeTruthy();
    expect(screen.getByText('Scammer')).toBeTruthy();
    expect(screen.getByText('Crypto')).toBeTruthy();
    expect(screen.getByText('NFT')).toBeTruthy();
  });

  it('should not show ValidationWarning when profile is valid', () => {
    render(<AnalysisResults analysis={validAnalysisResponse} />);

    expect(
      screen.queryByText('This does not appear to be a valid X/Twitter profile screenshot')
    ).toBeNull();
  });

  it('should render validation message but hide other content when invalid', () => {
    render(<AnalysisResults analysis={invalidAnalysisResponse} />);

    // Should show validation warning
    expect(screen.getByText(invalidAnalysisResponse.validationMessage)).toBeTruthy();

    // Should show risk score (always visible)
    expect(screen.getByText('0/100')).toBeTruthy();

    // Should not show summary or flags (empty arrays/strings for invalid)
    expect(screen.queryByText('Red Flags Detected:')).toBeNull();
  });
});
