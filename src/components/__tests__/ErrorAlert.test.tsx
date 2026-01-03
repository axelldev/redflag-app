import { render, screen } from '@testing-library/react-native';
import ErrorAlert from '../ErrorAlert';
import { colors } from '@/constants/colors';

describe('ErrorAlert', () => {
  it('should render error message', () => {
    render(<ErrorAlert message="Test error message" />);
    expect(screen.getByText(/Test error message/)).toBeTruthy();
  });

  it('should display error message with error emoji', () => {
    render(<ErrorAlert message="Failed to load" />);
    expect(screen.getByText(/❌ Failed to load/)).toBeTruthy();
  });

  it('should apply danger text color', () => {
    const { getByText } = render(<ErrorAlert message="Error occurred" />);
    const errorText = getByText(/❌ Error occurred/);

    const styles = errorText.props.style;
    const flatStyle = Array.isArray(styles) ? Object.assign({}, ...styles) : styles;

    expect(flatStyle.color).toBe(colors.danger);
  });

  it('should render different error messages', () => {
    const { rerender } = render(<ErrorAlert message="First error" />);
    expect(screen.getByText(/First error/)).toBeTruthy();

    rerender(<ErrorAlert message="Second error" />);
    expect(screen.getByText(/Second error/)).toBeTruthy();
  });

  it('should handle long error messages', () => {
    const longMessage =
      'This is a very long error message that might wrap to multiple lines in the UI';
    render(<ErrorAlert message={longMessage} />);

    expect(screen.getByText(new RegExp(longMessage))).toBeTruthy();
  });
});
