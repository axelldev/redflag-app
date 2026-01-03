import { render, screen } from '@testing-library/react-native';
import LoadingIndicator from '../LoadingIndicator';

describe('LoadingIndicator', () => {
  it('should render without message', () => {
    render(<LoadingIndicator />);
    // Component should render successfully - no message text should be visible
    const allText = screen.queryAllByText(/.+/);
    expect(allText.length).toBe(0);
  });

  it('should display message when provided', () => {
    render(<LoadingIndicator message="Analyzing your profile..." />);
    expect(screen.getByText('Analyzing your profile...')).toBeTruthy();
  });

  it('should not display message when not provided', () => {
    render(<LoadingIndicator />);
    // No text should be rendered when message is not provided
    const allText = screen.queryAllByText(/.+/);
    expect(allText.length).toBe(0);
  });

  it('should handle empty message', () => {
    render(<LoadingIndicator message="" />);
    // Empty message should not be rendered
    const allText = screen.queryAllByText(/.+/);
    expect(allText.length).toBe(0);
  });

  it('should display different messages', () => {
    const { rerender } = render(<LoadingIndicator message="Loading..." />);
    expect(screen.getByText('Loading...')).toBeTruthy();

    rerender(<LoadingIndicator message="Please wait..." />);
    expect(screen.getByText('Please wait...')).toBeTruthy();
  });
});
