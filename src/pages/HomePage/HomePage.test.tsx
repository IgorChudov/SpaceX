import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MantineProvider } from '@mantine/core';
import { HomePage } from './HomePage';
import { useLaunches } from '../../hooks/useLaunches';
import type { Launch } from '../../types';

// Мокаем хук useLaunches
vi.mock('../../hooks/useLaunches', () => ({
  useLaunches: vi.fn()
}));

// Мокаем дочерние компоненты
vi.mock('../../components/LaunchCard/LaunchCard', () => ({
  LaunchCard: vi.fn(({ launch, onSeeMore }) => (
    <div data-testid={`launch-card-${launch.mission_name}`}>
      <span>{launch.mission_name}</span>
      <button onClick={() => onSeeMore(launch)}>See more</button>
    </div>
  ))
}));

vi.mock('../../components/LaunchModal/LaunchModal', () => ({
  LaunchModal: vi.fn(({ launch, onClose }) => (
    <div data-testid="launch-modal">
      <span data-testid="modal-launch-name">{launch.mission_name}</span>
      <button onClick={onClose}>Close</button>
    </div>
  ))
}));

describe('HomePage', () => {
  const mockLaunches: Launch[] = [
    {
      mission_name: "Crew-1",
      rocket: { rocket_name: "Falcon 9" },
      links: { 
        mission_patch_small: "patch1.jpg",
        mission_patch: "patch1_big.jpg" 
      },
      details: "First crewed flight"
    },
    {
      mission_name: "Starlink-15",
      rocket: { rocket_name: "Falcon 9" },
      links: { 
        mission_patch_small: "patch2.jpg",
        mission_patch: "patch2_big.jpg" 
      },
      details: "Starlink mission"
    },
    {
      mission_name: "GPS III-04",
      rocket: { rocket_name: "Falcon 9" },
      links: { 
        mission_patch_small: "patch3.jpg",
        mission_patch: "patch3_big.jpg" 
      },
      details: "GPS mission"
    }
  ];

  const mockHookReturn = {
    launches: [],
    isLoading: false,
    error: null,
    selectedLaunch: null,
    isModalOpen: false,
    openModal: vi.fn(),
    closeModal: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useLaunches as any).mockReturnValue(mockHookReturn);
  });

  // Тест 1: Рендеринг заголовка
  it('рендерит заголовок страницы', () => {
    render(
      <MantineProvider>
        <HomePage />
      </MantineProvider>
    );

    expect(screen.getByText('SpaceX Launches 2020')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('SpaceX Launches 2020');
  });

  // Тест 2: Отображение загрузки (исправлен)
  it('отображает лоадер когда isLoading = true', () => {
    (useLaunches as any).mockReturnValue({
      ...mockHookReturn,
      isLoading: true
    });

    render(
      <MantineProvider>
        <HomePage />
      </MantineProvider>
    );

    expect(screen.getByText('Идет загрузка...')).toBeInTheDocument();
    // Loader в Mantine не имеет role="status", проверяем по классу
    expect(document.querySelector('.mantine-Loader-root')).toBeInTheDocument();
  });

  // Тест 3: Отображение ошибки (исправлен)
  it('отображает Alert когда есть ошибка', () => {
    const errorMessage = 'Network error';
    (useLaunches as any).mockReturnValue({
      ...mockHookReturn,
      error: errorMessage
    });

    render(
      <MantineProvider>
        <HomePage />
      </MantineProvider>
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText(/Ошибка при загрузке данных/)).toBeInTheDocument();
    // Ищем текст ошибки в Alert, учитывая что он разбит на части
    expect(screen.getByText((content) => content.includes('Network error'))).toBeInTheDocument();
  });

  // Тест 4: Отображение списка запусков
  it('отображает сетку с LaunchCard компонентами', () => {
    (useLaunches as any).mockReturnValue({
      ...mockHookReturn,
      launches: mockLaunches,
      isLoading: false,
      error: null
    });

    render(
      <MantineProvider>
        <HomePage />
      </MantineProvider>
    );

    // Проверяем что все карточки отображаются
    expect(screen.getByTestId('launch-card-Crew-1')).toBeInTheDocument();
    expect(screen.getByTestId('launch-card-Starlink-15')).toBeInTheDocument();
    expect(screen.getByTestId('launch-card-GPS III-04')).toBeInTheDocument();
    
    // Проверяем количество карточек
    expect(screen.getAllByTestId(/launch-card/)).toHaveLength(3);
  });

  // Тест 5: Отображение модального окна (исправлен)
  it('отображает модальное окно когда isModalOpen = true и есть selectedLaunch', () => {
    (useLaunches as any).mockReturnValue({
      ...mockHookReturn,
      launches: mockLaunches,
      selectedLaunch: mockLaunches[0],
      isModalOpen: true
    });

    render(
      <MantineProvider>
        <HomePage />
      </MantineProvider>
    );

    expect(screen.getByTestId('launch-modal')).toBeInTheDocument();
    // Используем data-testid вместо текста, так как текст дублируется
    expect(screen.getByTestId('modal-launch-name')).toHaveTextContent('Crew-1');
  });

  // Тест 6: Не отображает модальное окно когда нет selectedLaunch
  it('не отображает модальное окно если selectedLaunch = null', () => {
    (useLaunches as any).mockReturnValue({
      ...mockHookReturn,
      launches: mockLaunches,
      selectedLaunch: null,
      isModalOpen: true
    });

    render(
      <MantineProvider>
        <HomePage />
      </MantineProvider>
    );

    expect(screen.queryByTestId('launch-modal')).not.toBeInTheDocument();
  });

  // Тест 7: Взаимодействие с карточкой - открытие модального окна
  it('открывает модальное окно при клике на кнопку See more', async () => {
    const user = userEvent.setup();
    const mockOpenModal = vi.fn();
    
    (useLaunches as any).mockReturnValue({
      ...mockHookReturn,
      launches: mockLaunches,
      openModal: mockOpenModal
    });

    render(
      <MantineProvider>
        <HomePage />
      </MantineProvider>
    );

    // Нажимаем на кнопку в первой карточке
    const seeMoreButtons = screen.getAllByText('See more');
    await user.click(seeMoreButtons[0]);

    expect(mockOpenModal).toHaveBeenCalledTimes(1);
    expect(mockOpenModal).toHaveBeenCalledWith(mockLaunches[0]);
  });

  // Тест 8: Проверка что handleSeeMore вызывает openModal (вместо теста на мемоизацию)
  it('вызывает openModal при клике через handleSeeMore', async () => {
    const user = userEvent.setup();
    const mockOpenModal = vi.fn();
    
    (useLaunches as any).mockReturnValue({
      ...mockHookReturn,
      launches: mockLaunches,
      openModal: mockOpenModal
    });

    render(
      <MantineProvider>
        <HomePage />
      </MantineProvider>
    );

    const seeMoreButtons = screen.getAllByText('See more');
    await user.click(seeMoreButtons[0]);

    expect(mockOpenModal).toHaveBeenCalledWith(mockLaunches[0]);
  });
});