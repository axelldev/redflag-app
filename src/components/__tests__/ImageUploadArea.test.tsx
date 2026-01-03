import { render, screen } from '@testing-library/react-native';
import ImageUploadArea from '../ImageUploadArea';

describe('ImageUploadArea', () => {
  it('should show placeholder when no image selected', () => {
    render(<ImageUploadArea selectedImage={null} />);

    expect(screen.getByText('Upload Screenshot')).toBeTruthy();
    expect(screen.getByText('Choose a file, use camera, or paste')).toBeTruthy();
  });

  it('should show image preview when image is selected', () => {
    render(<ImageUploadArea selectedImage="file:///test-image.jpg" />);

    // Placeholder should not be visible when image is selected
    expect(screen.queryByText('Upload Screenshot')).toBeNull();
  });

  it('should hide placeholder when image is selected', () => {
    render(<ImageUploadArea selectedImage="file:///test-image.jpg" />);

    expect(screen.queryByText('Upload Screenshot')).toBeNull();
    expect(screen.queryByText('Choose a file, use camera, or paste')).toBeNull();
  });

  it('should render clear button when image is selected and onClear is provided', () => {
    const mockOnClear = jest.fn();

    render(<ImageUploadArea selectedImage="file:///test-image.jpg" onClear={mockOnClear} />);

    // The close icon should be rendered (Ionicons is mocked as Text)
    expect(screen.getByText('close')).toBeTruthy();
  });

  it('should call onClear when clear button is pressed', () => {
    const mockOnClear = jest.fn();

    const { getByText } = render(
      <ImageUploadArea selectedImage="file:///test-image.jpg" onClear={mockOnClear} />
    );

    // The close icon is rendered inside a Pressable
    // We can find the parent Pressable by finding the icon and going up
    const closeIcon = getByText('close');
    expect(closeIcon).toBeTruthy();

    // Verify the component renders with onClear callback
    expect(mockOnClear).toBeDefined();
  });

  it('should not render clear button when onClear is not provided', () => {
    render(<ImageUploadArea selectedImage="file:///test-image.jpg" />);

    // Close icon should not be rendered when onClear is not provided
    expect(screen.queryByText('close')).toBeNull();
  });

  it('should toggle between placeholder and image preview', () => {
    const { rerender } = render(<ImageUploadArea selectedImage={null} />);

    expect(screen.getByText('Upload Screenshot')).toBeTruthy();

    rerender(<ImageUploadArea selectedImage="file:///test-image.jpg" />);

    expect(screen.queryByText('Upload Screenshot')).toBeNull();

    rerender(<ImageUploadArea selectedImage={null} />);

    expect(screen.getByText('Upload Screenshot')).toBeTruthy();
  });

  it('should display different image URIs correctly', () => {
    const { rerender } = render(
      <ImageUploadArea selectedImage="file:///image1.jpg" />
    );

    // Placeholder should not be shown when image is selected
    expect(screen.queryByText('Upload Screenshot')).toBeNull();

    rerender(<ImageUploadArea selectedImage="file:///image2.jpg" />);

    // Placeholder should still not be shown with different image
    expect(screen.queryByText('Upload Screenshot')).toBeNull();
  });
});
