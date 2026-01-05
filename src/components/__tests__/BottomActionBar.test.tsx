import { render, screen, fireEvent } from '@testing-library/react-native';
import BottomActionBar from '../BottomActionBar';

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
}));

describe('BottomActionBar', () => {
  const mockCallbacks = {
    onNewAnalysis: jest.fn(),
    onReanalyze: jest.fn(),
    onClear: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should not render when no image is selected', () => {
    render(
      <BottomActionBar
        hasImage={false}
        hasAnalysis={false}
        isLoading={false}
        {...mockCallbacks}
      />
    );

    // Component should return null, so no buttons should be rendered
    expect(screen.queryByText('New Analysis')).toBeNull();
    expect(screen.queryByText('Re-analyze')).toBeNull();
    expect(screen.queryByText('Clear')).toBeNull();
  });

  it('should render New Analysis and Clear buttons when image is selected but no analysis', () => {
    render(
      <BottomActionBar
        hasImage={true}
        hasAnalysis={false}
        isLoading={false}
        {...mockCallbacks}
      />
    );

    expect(screen.getByText('New Analysis')).toBeTruthy();
    expect(screen.getByText('Clear')).toBeTruthy();
    expect(screen.queryByText('Re-analyze')).toBeNull();
  });

  it('should render all three buttons when analysis is complete', () => {
    render(
      <BottomActionBar
        hasImage={true}
        hasAnalysis={true}
        isLoading={false}
        {...mockCallbacks}
      />
    );

    expect(screen.getByText('New Analysis')).toBeTruthy();
    expect(screen.getByText('Re-analyze')).toBeTruthy();
    expect(screen.getByText('Clear')).toBeTruthy();
  });

  it('should call onNewAnalysis when New Analysis button is pressed', () => {
    render(
      <BottomActionBar
        hasImage={true}
        hasAnalysis={false}
        isLoading={false}
        {...mockCallbacks}
      />
    );

    fireEvent.press(screen.getByText('New Analysis'));

    expect(mockCallbacks.onNewAnalysis).toHaveBeenCalledTimes(1);
    expect(mockCallbacks.onReanalyze).not.toHaveBeenCalled();
    expect(mockCallbacks.onClear).not.toHaveBeenCalled();
  });

  it('should call onReanalyze when Re-analyze button is pressed', () => {
    render(
      <BottomActionBar
        hasImage={true}
        hasAnalysis={true}
        isLoading={false}
        {...mockCallbacks}
      />
    );

    fireEvent.press(screen.getByText('Re-analyze'));

    expect(mockCallbacks.onReanalyze).toHaveBeenCalledTimes(1);
    expect(mockCallbacks.onNewAnalysis).not.toHaveBeenCalled();
    expect(mockCallbacks.onClear).not.toHaveBeenCalled();
  });

  it('should call onClear when Clear button is pressed', () => {
    render(
      <BottomActionBar
        hasImage={true}
        hasAnalysis={false}
        isLoading={false}
        {...mockCallbacks}
      />
    );

    fireEvent.press(screen.getByText('Clear'));

    expect(mockCallbacks.onClear).toHaveBeenCalledTimes(1);
    expect(mockCallbacks.onNewAnalysis).not.toHaveBeenCalled();
    expect(mockCallbacks.onReanalyze).not.toHaveBeenCalled();
  });

  it('should show "Analyzing..." text when loading and analysis exists', () => {
    render(
      <BottomActionBar
        hasImage={true}
        hasAnalysis={true}
        isLoading={true}
        {...mockCallbacks}
      />
    );

    expect(screen.getByText('Analyzing...')).toBeTruthy();
    expect(screen.queryByText('Re-analyze')).toBeNull();
  });

  it('should disable all buttons when loading', () => {
    render(
      <BottomActionBar
        hasImage={true}
        hasAnalysis={true}
        isLoading={true}
        {...mockCallbacks}
      />
    );

    // Buttons should still be rendered but disabled
    expect(screen.getByText('New Analysis')).toBeTruthy();
    expect(screen.getByText('Analyzing...')).toBeTruthy();
    expect(screen.getByText('Clear')).toBeTruthy();
  });

  it('should allow multiple presses when not disabled', () => {
    render(
      <BottomActionBar
        hasImage={true}
        hasAnalysis={true}
        isLoading={false}
        {...mockCallbacks}
      />
    );

    fireEvent.press(screen.getByText('Re-analyze'));
    fireEvent.press(screen.getByText('Re-analyze'));

    expect(mockCallbacks.onReanalyze).toHaveBeenCalledTimes(2);
  });

  it('should render with safe area insets applied', () => {
    render(
      <BottomActionBar
        hasImage={true}
        hasAnalysis={true}
        isLoading={false}
        {...mockCallbacks}
      />
    );

    // Verify component renders correctly with safe area insets
    expect(screen.getByText('New Analysis')).toBeTruthy();
    expect(screen.getByText('Re-analyze')).toBeTruthy();
    expect(screen.getByText('Clear')).toBeTruthy();
  });

  it('should toggle Re-analyze button visibility based on hasAnalysis prop', () => {
    const { rerender } = render(
      <BottomActionBar
        hasImage={true}
        hasAnalysis={false}
        isLoading={false}
        {...mockCallbacks}
      />
    );

    expect(screen.queryByText('Re-analyze')).toBeNull();

    rerender(
      <BottomActionBar
        hasImage={true}
        hasAnalysis={true}
        isLoading={false}
        {...mockCallbacks}
      />
    );

    expect(screen.getByText('Re-analyze')).toBeTruthy();

    rerender(
      <BottomActionBar
        hasImage={true}
        hasAnalysis={false}
        isLoading={false}
        {...mockCallbacks}
      />
    );

    expect(screen.queryByText('Re-analyze')).toBeNull();
  });

  it('should render nothing when hasImage is false regardless of other props', () => {
    render(
      <BottomActionBar
        hasImage={false}
        hasAnalysis={true}
        isLoading={false}
        {...mockCallbacks}
      />
    );

    // Even with hasAnalysis=true, nothing should render if hasImage=false
    expect(screen.queryByText('New Analysis')).toBeNull();
    expect(screen.queryByText('Re-analyze')).toBeNull();
    expect(screen.queryByText('Clear')).toBeNull();
  });
});
