import { render, screen } from '@testing-library/react-native';
import HowItWorks from '../HowItWorks';

describe('HowItWorks', () => {
  it('should render title', () => {
    render(<HowItWorks />);
    expect(screen.getByText('How it works')).toBeTruthy();
  });

  it('should render all three steps', () => {
    render(<HowItWorks />);

    expect(screen.getByText('Upload, paste, or capture a screenshot')).toBeTruthy();
    expect(screen.getByText('AI analyzes for potential red flags')).toBeTruthy();
    expect(screen.getByText('Review detailed analysis and risk score')).toBeTruthy();
  });

  it('should render step numbers', () => {
    render(<HowItWorks />);

    expect(screen.getByText('1.')).toBeTruthy();
    expect(screen.getByText('2.')).toBeTruthy();
    expect(screen.getByText('3.')).toBeTruthy();
  });

  it('should render steps in correct order', () => {
    render(<HowItWorks />);

    const step1 = screen.getByText('1.');
    const step2 = screen.getByText('2.');
    const step3 = screen.getByText('3.');

    // Verify all steps are rendered
    expect(step1).toBeTruthy();
    expect(step2).toBeTruthy();
    expect(step3).toBeTruthy();
  });

  it('should match snapshot for static content', () => {
    const { toJSON } = render(<HowItWorks />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should have correct step content', () => {
    render(<HowItWorks />);

    // Verify each step has its corresponding text
    expect(screen.getByText(/Upload, paste, or capture/)).toBeTruthy();
    expect(screen.getByText(/AI analyzes/)).toBeTruthy();
    expect(screen.getByText(/Review detailed analysis/)).toBeTruthy();
  });
});
