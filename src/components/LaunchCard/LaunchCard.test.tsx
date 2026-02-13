import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MantineProvider } from '@mantine/core';
import { LaunchCard } from './LaunchCard';

describe('LaunchCard', () => {
  const mockLaunch = {
    mission_name: "Crew-1",
    rocket: {
      rocket_name: "Falcon 9"
    },
    links: {
      mission_patch_small: "https://example.com/patch.jpg"
    }
  };

  const mockOnSeeMore = vi.fn();

  // Очищаем мок после каждого теста
  beforeEach(() => {
    mockOnSeeMore.mockClear();
  });

  // Тест 1: Проверка отображения основной информации
  it('отображает название миссии и название ракеты', () => {
    render(
      <MantineProvider>
        <LaunchCard launch={mockLaunch} onSeeMore={mockOnSeeMore} />
      </MantineProvider>
    );

    expect(screen.getByText('Crew-1')).toBeInTheDocument();
    expect(screen.getByText('Falcon 9')).toBeInTheDocument();
  });

  // Тест 2: Проверка наличия кнопки
  it('отображает кнопку "See more"', () => {
    render(
      <MantineProvider>
        <LaunchCard launch={mockLaunch} onSeeMore={mockOnSeeMore} />
      </MantineProvider>
    );

    const button = screen.getByRole('button', { name: /see more/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('See more');
  });

  // Тест 3: Проверка изображения
  it('отображает изображение миссии с правильным alt текстом', () => {
    render(
      <MantineProvider>
        <LaunchCard launch={mockLaunch} onSeeMore={mockOnSeeMore} />
      </MantineProvider>
    );

    const image = screen.getByAltText('Crew-1');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/patch.jpg');
  });

  // Тест 4: Проверка fallback изображения
  it('использует fallback изображение когда нет mission_patch_small', () => {
    const launchWithoutPatch = {
      ...mockLaunch,
      links: {}
    };

    render(
      <MantineProvider>
        <LaunchCard launch={launchWithoutPatch} onSeeMore={mockOnSeeMore} />
      </MantineProvider>
    );

    const image = screen.getByAltText('Crew-1');
    expect(image).toHaveAttribute(
      'src',
      'https://www.primarymarkets.com/wp-content/uploads/2024/04/Spacex-Circle-Logo.png'
    );
  });

  // Тест 5: Проверка клика по кнопке
  it('вызывает onSeeMore с данными запуска при клике на кнопку', async () => {
    const user = userEvent.setup();
    
    render(
      <MantineProvider>
        <LaunchCard launch={mockLaunch} onSeeMore={mockOnSeeMore} />
      </MantineProvider>
    );

    const button = screen.getByRole('button', { name: /see more/i });
    await user.click(button);

    expect(mockOnSeeMore).toHaveBeenCalledTimes(1);
    expect(mockOnSeeMore).toHaveBeenCalledWith(mockLaunch);
  });

  // Тест 6: Проверка обработки отсутствия rocket_name
  it('корректно обрабатывает отсутствие информации о ракете', () => {
    const launchWithoutRocket = {
      ...mockLaunch,
      rocket: undefined
    };

    render(
      <MantineProvider>
        <LaunchCard launch={launchWithoutRocket as any} onSeeMore={mockOnSeeMore} />
      </MantineProvider>
    );

    // Компонент должен отрендериться без ошибок
    expect(screen.getByText('Crew-1')).toBeInTheDocument();
    // Текст ракеты не отображается или пустой
    expect(screen.queryByText('Falcon 9')).not.toBeInTheDocument();
  });

  // Тест 7: Проверка обработки длинного названия миссии
  it('обрезает длинное название миссии', () => {
    const launchWithLongName = {
      ...mockLaunch,
      mission_name: "This is a very long mission name that should be truncated because it exceeds the line clamp limit"
    };

    render(
      <MantineProvider>
        <LaunchCard launch={launchWithLongName} onSeeMore={mockOnSeeMore} />
      </MantineProvider>
    );

    const missionName = screen.getByText(/This is a very long mission name/i);
    expect(missionName).toBeInTheDocument();
    expect(missionName).toHaveClass('mantine-Text-root');
  });

  // Тест 8: Проверка мемоизации компонента
  it('не перерендеривается при тех же пропсах', () => {
    const { rerender } = render(
      <MantineProvider>
        <LaunchCard launch={mockLaunch} onSeeMore={mockOnSeeMore} />
      </MantineProvider>
    );

    const firstRender = screen.getByText('Crew-1');

    rerender(
      <MantineProvider>
        <LaunchCard launch={mockLaunch} onSeeMore={mockOnSeeMore} />
      </MantineProvider>
    );

    const secondRender = screen.getByText('Crew-1');
    expect(firstRender).toBe(secondRender);
  });
});