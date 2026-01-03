import { colors } from '../colors';

describe('colors', () => {
  it('should export all required color values', () => {
    expect(colors.background).toBeDefined();
    expect(colors.surface).toBeDefined();
    expect(colors.surfaceElevated).toBeDefined();
    expect(colors.text).toBeDefined();
    expect(colors.textSecondary).toBeDefined();
    expect(colors.primary).toBeDefined();
    expect(colors.primaryDark).toBeDefined();
    expect(colors.border).toBeDefined();
    expect(colors.success).toBeDefined();
    expect(colors.warning).toBeDefined();
    expect(colors.danger).toBeDefined();
  });

  it('should have valid hex color format for all colors', () => {
    const hexColorRegex = /^#[0-9a-f]{6}$/i;

    Object.entries(colors).forEach(([key, value]) => {
      expect(value).toMatch(hexColorRegex);
    });
  });

  it('should have specific color values', () => {
    expect(colors.background).toBe('#0a0a0a');
    expect(colors.surface).toBe('#1a1a1a');
    expect(colors.surfaceElevated).toBe('#2a2a2a');
    expect(colors.text).toBe('#ffffff');
    expect(colors.textSecondary).toBe('#a0a0a0');
    expect(colors.primary).toBe('#6366f1');
    expect(colors.primaryDark).toBe('#4f46e5');
    expect(colors.border).toBe('#333333');
    expect(colors.success).toBe('#10b981');
    expect(colors.warning).toBe('#f59e0b');
    expect(colors.danger).toBe('#ef4444');
  });

  it('should match snapshot', () => {
    expect(colors).toMatchSnapshot();
  });

  it('should not have unexpected color mutations', () => {
    const originalBackground = colors.background;

    // Verify the color value hasn't changed
    expect(colors.background).toBe(originalBackground);
    expect(colors.background).toBe('#0a0a0a');
  });

  it('should have exactly 11 color properties', () => {
    const colorKeys = Object.keys(colors);
    expect(colorKeys.length).toBe(11);
  });

  it('should have correct color key names', () => {
    const expectedKeys = [
      'background',
      'surface',
      'surfaceElevated',
      'text',
      'textSecondary',
      'primary',
      'primaryDark',
      'border',
      'success',
      'warning',
      'danger',
    ];

    const actualKeys = Object.keys(colors);

    expectedKeys.forEach((key) => {
      expect(actualKeys).toContain(key);
    });
  });

  it('should use lowercase hex values', () => {
    Object.values(colors).forEach((color) => {
      expect(color).toBe(color.toLowerCase());
    });
  });
});
