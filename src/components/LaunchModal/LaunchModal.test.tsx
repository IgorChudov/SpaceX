import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MantineProvider } from '@mantine/core';
import { LaunchModal } from './LaunchModal';

// Мокаем createPortal чтобы рендерить внутри теста
vi.mock('react-dom', () => ({
  createPortal: (node: React.ReactNode) => node,
}));

// Мокаем Overlay компонент
vi.mock('../Overlay/Overlay', () => ({
  Overlay: ({ onClose }: { onClose: () => void }) => (
    <div data-testid="overlay" onClick={onClose}>Overlay</div>
  ),
}));

describe('LaunchModal', () => {
  const mockLaunch = {
    mission_name: "Crew-1",
    rocket: {
      rocket_name: "Falcon 9"
    },
    links: {
      mission_patch: "https://example.com/patch.jpg"
    },
    details: "This is a test mission details"
  };

  const mockOnClose = vi.fn();

  // Очищаем мок после каждого теста
  beforeEach(() => {
    mockOnClose.mockClear();
  });

  // Тест 1: Проверка что модальное окно не рендерится когда launch = null
  it('не рендерится когда launch = null', () => {
    render(
      <MantineProvider>
        <LaunchModal launch={null} onClose={mockOnClose} />
      </MantineProvider>
    );

    expect(screen.queryByText('Crew-1')).not.toBeInTheDocument();
    expect(screen.queryByTestId('overlay')).not.toBeInTheDocument();
  });

  // Тест 2: Проверка отображения основной информации
  it('отображает информацию о запуске', () => {
    render(
      <MantineProvider>
        <LaunchModal launch={mockLaunch} onClose={mockOnClose} />
      </MantineProvider>
    );

    // Заголовок
    expect(screen.getByRole('heading', { name: 'Crew-1', level: 2 })).toBeInTheDocument();
    // Название ракеты
    expect(screen.getByText('Falcon 9')).toBeInTheDocument();
    // Детали
    expect(screen.getByText('This is a test mission details')).toBeInTheDocument();
  });

  // Тест 3: Проверка отображения изображения
  it('отображает изображение миссии', () => {
    render(
      <MantineProvider>
        <LaunchModal launch={mockLaunch} onClose={mockOnClose} />
      </MantineProvider>
    );

    const image = screen.getByAltText('Crew-1 patch');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/patch.jpg');
  });

  // Тест 4: Проверка fallback изображения
  it('использует fallback изображение когда нет mission_patch', () => {
    const launchWithoutPatch = {
      ...mockLaunch,
      links: {}
    };

    render(
      <MantineProvider>
        <LaunchModal launch={launchWithoutPatch} onClose={mockOnClose} />
      </MantineProvider>
    );

    const image = screen.getByAltText('Crew-1 patch');
    expect(image).toHaveAttribute(
      'src',
      'https://www.primarymarkets.com/wp-content/uploads/2024/04/Spacex-Circle-Logo.png'
    );
  });

  // Тест 5: Проверка закрытия по клику на кнопку закрытия
  it('закрывается при клике на кнопку закрытия', async () => {
    const user = userEvent.setup();
    
    render(
      <MantineProvider>
        <LaunchModal launch={mockLaunch} onClose={mockOnClose} />
      </MantineProvider>
    );

    const closeButton = screen.getByText('✕');
    await user.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  // Тест 6: Проверка закрытия по клику на Overlay
  it('закрывается при клике на Overlay', async () => {
    const user = userEvent.setup();
    
    render(
      <MantineProvider>
        <LaunchModal launch={mockLaunch} onClose={mockOnClose} />
      </MantineProvider>
    );

    const overlay = screen.getByTestId('overlay');
    await user.click(overlay);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  // Тест 7: Проверка закрытия по нажатию Escape
  it('закрывается при нажатии клавиши Escape', async () => {
    render(
      <MantineProvider>
        <LaunchModal launch={mockLaunch} onClose={mockOnClose} />
      </MantineProvider>
    );

    // Эмулируем нажатие Escape
    document.dispatchEvent(new KeyboardEvent('keydown', { code: 'Escape' }));

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  // Тест 8: Проверка обработки отсутствующих данных
  it('отображает "Unknown" когда данные отсутствуют', () => {
    const launchWithMissingData = {
      mission_name: "Crew-1",
      rocket: {},
      links: {},
      details: null
    };

    render(
      <MantineProvider>
        <LaunchModal launch={launchWithMissingData as any} onClose={mockOnClose} />
      </MantineProvider>
    );

    // Проверяем заголовок (он есть всегда)
    expect(screen.getByRole('heading', { name: 'Crew-1', level: 2 })).toBeInTheDocument();
    
    // Проверяем что "Unknown" отображается для rocket_name и details
    const unknownElements = screen.getAllByText('Unknown');
    expect(unknownElements).toHaveLength(2);
    
    // Проверяем что название ракеты не отображается (только Unknown)
    expect(screen.queryByText('Falcon 9')).not.toBeInTheDocument();
  });

  // Тест 9: Проверка эффекта с отпиской от событий
  it('отписывается от событий при размонтировании', () => {
    const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');
    const { unmount } = render(
      <MantineProvider>
        <LaunchModal launch={mockLaunch} onClose={mockOnClose} />
      </MantineProvider>
    );

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
  });

  // Тест 10: Проверка блокировки скролла
  it('блокирует скролл body при открытии', () => {
    render(
      <MantineProvider>
        <LaunchModal launch={mockLaunch} onClose={mockOnClose} />
      </MantineProvider>
    );

    expect(document.body.style.overflow).toBe('hidden');
  });

  // Тест 11: Проверка разблокировки скролла при закрытии
  it('разблокирует скролл body при закрытии', () => {
    const { unmount } = render(
      <MantineProvider>
        <LaunchModal launch={mockLaunch} onClose={mockOnClose} />
      </MantineProvider>
    );

    expect(document.body.style.overflow).toBe('hidden');

    unmount();

    expect(document.body.style.overflow).toBe('unset');
  });
});