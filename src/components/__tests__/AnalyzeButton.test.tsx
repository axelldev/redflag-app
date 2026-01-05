import { render, screen, fireEvent } from '@testing-library/react-native';
import AnalyzeButton from '../AnalyzeButton';

describe('AnalyzeButton', () => {
  it('should call onPress when button is pressed', () => {
    const mockOnPress = jest.fn();

    render(<AnalyzeButton onPress={mockOnPress} isLoading={false} disabled={false} />);

    fireEvent.press(screen.getByText('Analyze'));

    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('should display "Analyze" when not loading', () => {
    render(<AnalyzeButton onPress={jest.fn()} isLoading={false} disabled={false} />);

    expect(screen.getByText('Analyze')).toBeTruthy();
    expect(screen.queryByText('Analyzing...')).toBeNull();
  });

  it('should display "Analyzing..." when loading', () => {
    render(<AnalyzeButton onPress={jest.fn()} isLoading={true} disabled={false} />);

    expect(screen.getByText('Analyzing...')).toBeTruthy();
    expect(screen.queryByText('Analyze')).toBeNull();
  });

  it('should render when disabled', () => {
    render(<AnalyzeButton onPress={jest.fn()} isLoading={false} disabled={true} />);

    // Verify button text is rendered even when disabled
    expect(screen.getByText('Analyze')).toBeTruthy();
  });

  it('should render when enabled', () => {
    render(<AnalyzeButton onPress={jest.fn()} isLoading={false} disabled={false} />);

    // Verify button text is rendered
    expect(screen.getByText('Analyze')).toBeTruthy();
  });

  it('should toggle between loading and not loading states', () => {
    const { rerender } = render(
      <AnalyzeButton onPress={jest.fn()} isLoading={false} disabled={false} />
    );

    expect(screen.getByText('Analyze')).toBeTruthy();

    rerender(<AnalyzeButton onPress={jest.fn()} isLoading={true} disabled={false} />);

    expect(screen.getByText('Analyzing...')).toBeTruthy();

    rerender(<AnalyzeButton onPress={jest.fn()} isLoading={false} disabled={false} />);

    expect(screen.getByText('Analyze')).toBeTruthy();
  });

  it('should show loading text even when disabled', () => {
    render(<AnalyzeButton onPress={jest.fn()} isLoading={true} disabled={true} />);

    expect(screen.getByText('Analyzing...')).toBeTruthy();
  });

  it('should allow multiple presses when not disabled', () => {
    const mockOnPress = jest.fn();

    render(<AnalyzeButton onPress={mockOnPress} isLoading={false} disabled={false} />);

    fireEvent.press(screen.getByText('Analyze'));
    fireEvent.press(screen.getByText('Analyze'));

    expect(mockOnPress).toHaveBeenCalledTimes(2);
  });
});
