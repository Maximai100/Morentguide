import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ThemeToggle from './ThemeToggle';
import * as themeUtils from '../utils/theme';

// Mock the theme utility functions
vi.mock('../utils/theme', () => ({
  getCurrentTheme: vi.fn(),
  toggleTheme: vi.fn(),
  initializeTheme: vi.fn(), // Mock initializeTheme as well
}));

describe('ThemeToggle', () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.resetAllMocks();
  });

  it('should render with the initial light theme icon', () => {
    // Arrange
    vi.mocked(themeUtils.getCurrentTheme).mockReturnValue('light');

    // Act
    render(<ThemeToggle />);

    // Assert
    expect(screen.getByText('☀️')).toBeInTheDocument();
    expect(screen.getByLabelText('Светлая тема')).toBeInTheDocument();
  });

  it('should render with the initial dark theme icon', () => {
    // Arrange
    vi.mocked(themeUtils.getCurrentTheme).mockReturnValue('dark');

    // Act
    render(<ThemeToggle />);

    // Assert
    expect(screen.getByText('🌙')).toBeInTheDocument();
    expect(screen.getByLabelText('Темная тема')).toBeInTheDocument();
  });

  it('should toggle theme from light to dark when clicked', () => {
    // Arrange
    vi.mocked(themeUtils.getCurrentTheme).mockReturnValue('light');
    vi.mocked(themeUtils.toggleTheme).mockReturnValue('dark');
    render(<ThemeToggle />);
    const toggleButton = screen.getByRole('button');

    // Act
    fireEvent.click(toggleButton);

    // Assert
    expect(themeUtils.toggleTheme).toHaveBeenCalledTimes(1);
    expect(screen.getByText('🌙')).toBeInTheDocument();
    expect(screen.getByLabelText('Темная тема')).toBeInTheDocument();
  });

  it('should cycle through themes on multiple clicks', () => {
    // Arrange
    vi.mocked(themeUtils.getCurrentTheme).mockReturnValue('light');
    render(<ThemeToggle />);
    const toggleButton = screen.getByRole('button');

    // Act & Assert for first click
    vi.mocked(themeUtils.toggleTheme).mockReturnValue('dark');
    fireEvent.click(toggleButton);
    expect(screen.getByText('🌙')).toBeInTheDocument();

    // Act & Assert for second click
    vi.mocked(themeUtils.toggleTheme).mockReturnValue('auto');
    fireEvent.click(toggleButton);
    expect(screen.getByText('🔄')).toBeInTheDocument();

    // Act & Assert for third click
    vi.mocked(themeUtils.toggleTheme).mockReturnValue('light');
    fireEvent.click(toggleButton);
    expect(screen.getByText('☀️')).toBeInTheDocument();
  });
});
