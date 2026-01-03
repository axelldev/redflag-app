import { render, screen } from '@testing-library/react-native';
import RiskScore from '../RiskScore';
import { colors } from '@/constants/colors';

describe('RiskScore', () => {
  it('should render score text correctly', () => {
    render(<RiskScore score={42} />);
    expect(screen.getByText('42/100')).toBeTruthy();
  });

  it('should render label', () => {
    render(<RiskScore score={50} />);
    expect(screen.getByText('Risk Score')).toBeTruthy();
  });

  describe('color logic', () => {
    it('should apply danger color for scores above 60', () => {
      const { getByText } = render(<RiskScore score={75} />);
      const scoreText = getByText('75/100');

      // Find the style that contains the color property
      const styles = scoreText.props.style;
      const flatStyle = Array.isArray(styles) ? Object.assign({}, ...styles) : styles;

      expect(flatStyle.color).toBe(colors.danger);
    });

    it('should apply danger color at exactly 61', () => {
      const { getByText } = render(<RiskScore score={61} />);
      const scoreText = getByText('61/100');

      const styles = scoreText.props.style;
      const flatStyle = Array.isArray(styles) ? Object.assign({}, ...styles) : styles;

      expect(flatStyle.color).toBe(colors.danger);
    });

    it('should apply warning color for medium scores (31-60)', () => {
      const { getByText } = render(<RiskScore score={45} />);
      const scoreText = getByText('45/100');

      const styles = scoreText.props.style;
      const flatStyle = Array.isArray(styles) ? Object.assign({}, ...styles) : styles;

      expect(flatStyle.color).toBe(colors.warning);
    });

    it('should apply warning color at exactly 31', () => {
      const { getByText } = render(<RiskScore score={31} />);
      const scoreText = getByText('31/100');

      const styles = scoreText.props.style;
      const flatStyle = Array.isArray(styles) ? Object.assign({}, ...styles) : styles;

      expect(flatStyle.color).toBe(colors.warning);
    });

    it('should apply warning color at exactly 60', () => {
      const { getByText } = render(<RiskScore score={60} />);
      const scoreText = getByText('60/100');

      const styles = scoreText.props.style;
      const flatStyle = Array.isArray(styles) ? Object.assign({}, ...styles) : styles;

      expect(flatStyle.color).toBe(colors.warning);
    });

    it('should apply success color for low scores (<=30)', () => {
      const { getByText } = render(<RiskScore score={15} />);
      const scoreText = getByText('15/100');

      const styles = scoreText.props.style;
      const flatStyle = Array.isArray(styles) ? Object.assign({}, ...styles) : styles;

      expect(flatStyle.color).toBe(colors.success);
    });

    it('should apply success color for score of 0', () => {
      const { getByText } = render(<RiskScore score={0} />);
      const scoreText = getByText('0/100');

      const styles = scoreText.props.style;
      const flatStyle = Array.isArray(styles) ? Object.assign({}, ...styles) : styles;

      expect(flatStyle.color).toBe(colors.success);
    });

    it('should apply success color at exactly 30', () => {
      const { getByText } = render(<RiskScore score={30} />);
      const scoreText = getByText('30/100');

      const styles = scoreText.props.style;
      const flatStyle = Array.isArray(styles) ? Object.assign({}, ...styles) : styles;

      expect(flatStyle.color).toBe(colors.success);
    });
  });

  it('should handle score of 100', () => {
    const { getByText } = render(<RiskScore score={100} />);
    expect(getByText('100/100')).toBeTruthy();

    const scoreText = getByText('100/100');
    const styles = scoreText.props.style;
    const flatStyle = Array.isArray(styles) ? Object.assign({}, ...styles) : styles;

    expect(flatStyle.color).toBe(colors.danger);
  });

  it('should render with correct container styling', () => {
    const { getByText } = render(<RiskScore score={50} />);
    const label = getByText('Risk Score');

    // The parent container should exist
    expect(label.parent).toBeTruthy();
  });
});
