import { mockBase64Image } from "@/__tests__/utils/testHelpers";
import { act, renderHook } from "@testing-library/react-native";
import { Camera } from "expo-camera";
import * as Clipboard from "expo-clipboard";
import * as ImagePicker from "expo-image-picker";
import { useImageUpload } from "../useImageUpload";

// Get mocked functions
const mockedImagePicker = ImagePicker as jest.Mocked<typeof ImagePicker>;
const mockedCamera = Camera as jest.Mocked<typeof Camera>;
const mockedClipboard = Clipboard as jest.Mocked<typeof Clipboard>;
const GRANTED_PERMISSION_STATUS = ImagePicker.PermissionStatus.GRANTED;
const DENIED_PERMISSION_STATUS = ImagePicker.PermissionStatus.DENIED;

describe("useImageUpload", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should initialize with correct default state", () => {
    const { result } = renderHook(() => useImageUpload());

    expect(result.current.selectedImage).toBeNull();
    expect(result.current.imageBase64).toBeNull();
  });

  describe("handleChooseFile", () => {
    it("should handle successful image selection from library", async () => {
      mockedImagePicker.launchImageLibraryAsync.mockResolvedValueOnce({
        canceled: false,
        assets: [
          {
            uri: "file:///test-image.jpg",
            base64: mockBase64Image,
            width: 1080,
            height: 1920,
          },
        ],
      });

      const { result } = renderHook(() => useImageUpload());

      await act(async () => {
        await result.current.handleChooseFile();
      });

      expect(result.current.selectedImage).toBe("file:///test-image.jpg");
      expect(result.current.imageBase64).toBe(mockBase64Image);
    });

    it("should not update state when user cancels image selection", async () => {
      mockedImagePicker.launchImageLibraryAsync.mockResolvedValueOnce({
        canceled: true,
        assets: null,
      });

      const { result } = renderHook(() => useImageUpload());

      await act(async () => {
        await result.current.handleChooseFile();
      });

      expect(result.current.selectedImage).toBeNull();
      expect(result.current.imageBase64).toBeNull();
    });

    it("should not update state when image selection fails", async () => {
      mockedImagePicker.launchImageLibraryAsync.mockRejectedValueOnce(
        new Error("Permission denied")
      );

      const { result } = renderHook(() => useImageUpload());

      await act(async () => {
        await result.current.handleChooseFile();
      });

      // State should remain null when error occurs
      expect(result.current.selectedImage).toBeNull();
      expect(result.current.imageBase64).toBeNull();
    });

    it("should not update state when base64 is missing", async () => {
      mockedImagePicker.launchImageLibraryAsync.mockResolvedValueOnce({
        canceled: false,
        assets: [
          {
            uri: "file:///test-image.jpg",
            base64: undefined,
            width: 1080,
            height: 1920,
          },
        ],
      });

      const { result } = renderHook(() => useImageUpload());

      await act(async () => {
        await result.current.handleChooseFile();
      });

      // State should remain null when base64 is missing
      expect(result.current.selectedImage).toBeNull();
      expect(result.current.imageBase64).toBeNull();
    });

    it("should call launchImageLibraryAsync with correct options", async () => {
      mockedImagePicker.launchImageLibraryAsync.mockResolvedValueOnce({
        canceled: true,
        assets: null,
      });

      const { result } = renderHook(() => useImageUpload());

      await act(async () => {
        await result.current.handleChooseFile();
      });

      expect(mockedImagePicker.launchImageLibraryAsync).toHaveBeenCalledWith({
        mediaTypes: ["images"],
        allowsEditing: true,
        quality: 0.8,
        base64: true,
      });
    });
  });

  describe("handleUseCamera", () => {
    it("should handle successful camera capture with granted permission", async () => {
      mockedCamera.requestCameraPermissionsAsync.mockResolvedValueOnce({
        status: ImagePicker.PermissionStatus.GRANTED,
        granted: true,
        canAskAgain: true,
        expires: "never",
      });

      mockedImagePicker.launchCameraAsync.mockResolvedValueOnce({
        canceled: false,
        assets: [
          {
            uri: "file:///camera-photo.jpg",
            base64: mockBase64Image,
            width: 1080,
            height: 1920,
          },
        ],
      });

      const { result } = renderHook(() => useImageUpload());

      await act(async () => {
        await result.current.handleUseCamera();
      });

      expect(result.current.selectedImage).toBe("file:///camera-photo.jpg");
      expect(result.current.imageBase64).toBe(mockBase64Image);
    });

    it("should not update state when camera permission is denied", async () => {
      mockedCamera.requestCameraPermissionsAsync.mockResolvedValueOnce({
        status: DENIED_PERMISSION_STATUS,
        granted: false,
        canAskAgain: true,
        expires: "never",
      });

      const { result } = renderHook(() => useImageUpload());

      await act(async () => {
        await result.current.handleUseCamera();
      });

      // State should remain null when permission denied
      expect(result.current.selectedImage).toBeNull();
      expect(result.current.imageBase64).toBeNull();
      expect(mockedImagePicker.launchCameraAsync).not.toHaveBeenCalled();
    });

    it("should not update state when user cancels camera", async () => {
      mockedCamera.requestCameraPermissionsAsync.mockResolvedValueOnce({
        status: GRANTED_PERMISSION_STATUS,
        granted: true,
        canAskAgain: true,
        expires: "never",
      });

      mockedImagePicker.launchCameraAsync.mockResolvedValueOnce({
        canceled: true,
        assets: null,
      });

      const { result } = renderHook(() => useImageUpload());

      await act(async () => {
        await result.current.handleUseCamera();
      });

      expect(result.current.selectedImage).toBeNull();
      expect(result.current.imageBase64).toBeNull();
    });

    it("should not update state when camera capture fails", async () => {
      mockedCamera.requestCameraPermissionsAsync.mockResolvedValueOnce({
        status: GRANTED_PERMISSION_STATUS,
        granted: true,
        canAskAgain: true,
        expires: "never",
      });

      mockedImagePicker.launchCameraAsync.mockRejectedValueOnce(
        new Error("Camera error")
      );

      const { result } = renderHook(() => useImageUpload());

      await act(async () => {
        await result.current.handleUseCamera();
      });

      // State should remain null when capture fails
      expect(result.current.selectedImage).toBeNull();
      expect(result.current.imageBase64).toBeNull();
    });

    it("should call launchCameraAsync with correct options", async () => {
      mockedCamera.requestCameraPermissionsAsync.mockResolvedValueOnce({
        status: GRANTED_PERMISSION_STATUS,
        granted: true,
        canAskAgain: true,
        expires: "never",
      });

      mockedImagePicker.launchCameraAsync.mockResolvedValueOnce({
        canceled: true,
        assets: null,
      });

      const { result } = renderHook(() => useImageUpload());

      await act(async () => {
        await result.current.handleUseCamera();
      });

      expect(mockedImagePicker.launchCameraAsync).toHaveBeenCalledWith({
        allowsEditing: true,
        quality: 0.8,
        base64: true,
      });
    });
  });

  describe("handlePasteClipboard", () => {
    it("should handle successful clipboard paste", async () => {
      mockedClipboard.hasImageAsync.mockResolvedValueOnce(true);
      mockedClipboard.getImageAsync.mockResolvedValueOnce({
        data: mockBase64Image,
        size: { width: 1080, height: 1920 },
      });

      const { result } = renderHook(() => useImageUpload());

      await act(async () => {
        await result.current.handlePasteClipboard();
      });

      expect(result.current.selectedImage).toBe(mockBase64Image);
      expect(result.current.imageBase64).toBe(mockBase64Image);
    });

    it("should format base64 with data URI prefix", async () => {
      const base64WithPrefix = `data:image/jpeg;base64,${mockBase64Image}`;

      mockedClipboard.hasImageAsync.mockResolvedValueOnce(true);
      mockedClipboard.getImageAsync.mockResolvedValueOnce({
        data: base64WithPrefix,
        size: { width: 1080, height: 1920 },
      });

      const { result } = renderHook(() => useImageUpload());

      await act(async () => {
        await result.current.handlePasteClipboard();
      });

      // Should strip the data URI prefix and store only the base64 part
      expect(result.current.imageBase64).toBe(mockBase64Image);
      expect(result.current.selectedImage).toBe(base64WithPrefix);
    });

    it("should not update state when clipboard has no image", async () => {
      mockedClipboard.hasImageAsync.mockResolvedValueOnce(false);

      const { result } = renderHook(() => useImageUpload());

      await act(async () => {
        await result.current.handlePasteClipboard();
      });

      // State should remain null when clipboard has no image
      expect(result.current.selectedImage).toBeNull();
      expect(result.current.imageBase64).toBeNull();
      expect(mockedClipboard.getImageAsync).not.toHaveBeenCalled();
    });

    it("should not update state when clipboard paste fails", async () => {
      mockedClipboard.hasImageAsync.mockRejectedValueOnce(
        new Error("Clipboard error")
      );

      const { result } = renderHook(() => useImageUpload());

      await act(async () => {
        await result.current.handlePasteClipboard();
      });

      // State should remain null when paste fails
      expect(result.current.selectedImage).toBeNull();
      expect(result.current.imageBase64).toBeNull();
    });

    it("should call getImageAsync with correct format", async () => {
      mockedClipboard.hasImageAsync.mockResolvedValueOnce(true);
      mockedClipboard.getImageAsync.mockResolvedValueOnce({
        data: mockBase64Image,
        size: { width: 1080, height: 1920 },
      });

      const { result } = renderHook(() => useImageUpload());

      await act(async () => {
        await result.current.handlePasteClipboard();
      });

      expect(mockedClipboard.getImageAsync).toHaveBeenCalledWith({
        format: "jpeg",
      });
    });
  });

  describe("clearImage", () => {
    it("should clear both selectedImage and imageBase64", async () => {
      // First set some image data
      mockedImagePicker.launchImageLibraryAsync.mockResolvedValueOnce({
        canceled: false,
        assets: [
          {
            uri: "file:///test-image.jpg",
            base64: mockBase64Image,
            width: 1080,
            height: 1920,
          },
        ],
      });

      const { result } = renderHook(() => useImageUpload());

      await act(async () => {
        await result.current.handleChooseFile();
      });

      expect(result.current.selectedImage).toBeTruthy();
      expect(result.current.imageBase64).toBeTruthy();

      // Now clear
      act(() => {
        result.current.clearImage();
      });

      expect(result.current.selectedImage).toBeNull();
      expect(result.current.imageBase64).toBeNull();
    });
  });
});
