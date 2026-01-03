import { render, screen } from '@testing-library/react-native';
import ValidationWarning from '../ValidationWarning';
import { colors } from '@/constants/colors';

describe('ValidationWarning', () => {
  it('should render warning message', () => {
    const message = 'This does not appear to be a valid X/Twitter profile screenshot';
    render(<ValidationWarning message={message} />);

    expect(screen.getByText(message)).toBeTruthy();
  });

  it('should render different warning messages', () => {
    const message1 = 'Invalid profile detected';
    const { rerender } = render(<ValidationWarning message={message1} />);
    expect(screen.getByText(message1)).toBeTruthy();

    const message2 = 'This appears to be a screenshot of a website, not a profile';
    rerender(<ValidationWarning message={message2} />);
    expect(screen.getByText(message2)).toBeTruthy();
  });

  it('should apply warning color styling', () => {
    const { getByText } = render(<ValidationWarning message="Test warning" />);
    const text = getByText('Test warning');

    const styles = text.props.style;
    const flatStyle = Array.isArray(styles) ? Object.assign({}, ...styles) : styles;

    expect(flatStyle.color).toBe(colors.warning);
  });

  it('should render with warning icon', () => {
    render(<ValidationWarning message="Test message" />);
    // The component should render without errors and include the icon
    // Since Ionicons is mocked as Text, we can't directly test the icon
    // but we can verify the component renders
    expect(screen.getByText('Test message')).toBeTruthy();
  });

  it('should handle long warning messages', () => {
    const longMessage =
      'This is a very long warning message that should still be displayed correctly even though it contains many characters and might wrap to multiple lines in the UI.';
    render(<ValidationWarning message={longMessage} />);

    expect(screen.getByText(longMessage)).toBeTruthy();
  });
});
