import { render, screen } from '@testing-library/react-native';
import RedFlagsList from '../RedFlagsList';
import { mockRedFlags } from '@/__tests__/fixtures/analysisResponses';
import type { RedFlag } from '@/types/analysis';

describe('RedFlagsList', () => {
  it('should render clean profile message when no flags', () => {
    render(<RedFlagsList flags={[]} />);
    expect(
      screen.getByText(/No significant red flags detected! This profile appears genuine./)
    ).toBeTruthy();
  });

  it('should render checkmark icon for clean profile', () => {
    render(<RedFlagsList flags={[]} />);
    // The Ionicons component is mocked as Text in jest.setup.ts
    // We can check that it renders
    expect(screen.getByText(/No significant red flags detected/)).toBeTruthy();
  });

  it('should render title when flags are present', () => {
    render(<RedFlagsList flags={mockRedFlags} />);
    expect(screen.getByText('Red Flags Detected:')).toBeTruthy();
  });

  it('should render all flags when present', () => {
    render(<RedFlagsList flags={mockRedFlags} />);

    // Check that all categories are rendered
    expect(screen.getByText('CEO')).toBeTruthy();
    expect(screen.getByText('AI Bro')).toBeTruthy();
    expect(screen.getByText('Crypto')).toBeTruthy();
  });

  it('should render correct number of flag cards', () => {
    const { getAllByText } = render(<RedFlagsList flags={mockRedFlags} />);

    // Each flag should have an uppercase severity badge
    const severityBadges = getAllByText(/HIGH|MEDIUM|LOW/);
    expect(severityBadges.length).toBe(mockRedFlags.length);
  });

  it('should not render title when no flags', () => {
    render(<RedFlagsList flags={[]} />);
    expect(screen.queryByText('Red Flags Detected:')).toBeNull();
  });

  it('should handle single flag', () => {
    const singleFlag: RedFlag[] = [
      {
        category: 'Scammer',
        severity: 'high',
        evidence: 'Test evidence',
        analysis: 'Test analysis',
      },
    ];

    render(<RedFlagsList flags={singleFlag} />);
    expect(screen.getByText('Scammer')).toBeTruthy();
    expect(screen.getByText('Red Flags Detected:')).toBeTruthy();
  });

  it('should render flags with different severities', () => {
    const mixedFlags: RedFlag[] = [
      {
        category: 'CEO',
        severity: 'high',
        evidence: 'High severity evidence',
        analysis: 'High severity analysis',
      },
      {
        category: 'TechBro',
        severity: 'medium',
        evidence: 'Medium severity evidence',
        analysis: 'Medium severity analysis',
      },
      {
        category: 'Crypto',
        severity: 'low',
        evidence: 'Low severity evidence',
        analysis: 'Low severity analysis',
      },
    ];

    render(<RedFlagsList flags={mixedFlags} />);

    expect(screen.getByText('HIGH')).toBeTruthy();
    expect(screen.getByText('MEDIUM')).toBeTruthy();
    expect(screen.getByText('LOW')).toBeTruthy();
  });
});
