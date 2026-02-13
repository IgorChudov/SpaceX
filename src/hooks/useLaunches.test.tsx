import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useLaunches } from './useLaunches';
import { fetchLaunchesApi } from '../services/fetchLaunchesApi';
import type { Launch } from '../types';

// Мокаем API сервис
vi.mock('../services/fetchLaunchesApi', () => ({
  fetchLaunchesApi: vi.fn()
}));

describe('useLaunches', () => {
  // Моковые данные для тестов
  const mockLaunches: Launch[] = [
    {
      mission_name: "FalconSat",
      rocket: { rocket_name: "Falcon 1" },
      links: { mission_patch_small: "patch1.jpg", mission_patch: "patch1_big.jpg" },
      details: "First test flight"
    },
    {
      mission_name: "DemoSat",
      rocket: { rocket_name: "Falcon 9" },
      links: { mission_patch_small: "patch2.jpg", mission_patch: "patch2_big.jpg" },
      details: "Second test flight"
    }
  ];

  // Очищаем моки перед каждым тестом
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Тест 1: Начальное состояние
  it('имеет правильное начальное состояние', () => {
    const { result } = renderHook(() => useLaunches());

    expect(result.current.launches).toEqual([]);
    expect(result.current.isLoading).toBe(true);
    expect(result.current.error).toBeNull();
    expect(result.current.selectedLaunch).toBeNull();
    expect(result.current.isModalOpen).toBe(false);
  });

  // Тест 2: Успешная загрузка данных
  it('загружает данные и обновляет состояние при успешном запросе', async () => {
    (fetchLaunchesApi as any).mockResolvedValue(mockLaunches);

    const { result } = renderHook(() => useLaunches());

    // Начальное состояние загрузки
    expect(result.current.isLoading).toBe(true);

    // Ждем завершения загрузки
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Проверяем что данные загружены
    expect(result.current.launches).toEqual(mockLaunches);
    expect(result.current.error).toBeNull();
    expect(fetchLaunchesApi).toHaveBeenCalledTimes(1);
  });

  // Тест 3: Обработка ошибки при загрузке
  it('обрабатывает ошибку при неудачном запросе', async () => {
    const errorMessage = 'Network error';
    (fetchLaunchesApi as any).mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useLaunches());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.launches).toEqual([]);
    expect(result.current.error).toBe(errorMessage);
    expect(fetchLaunchesApi).toHaveBeenCalledTimes(1);
  });

  // Тест 4: Открытие модального окна
  it('открывает модальное окно с выбранным запуском', () => {
    const { result } = renderHook(() => useLaunches());

    const launch = mockLaunches[0];
    act(() => {
      result.current.openModal(launch);
    });

    expect(result.current.selectedLaunch).toEqual(launch);
    expect(result.current.isModalOpen).toBe(true);
  });

  // Тест 5: Закрытие модального окна
  it('закрывает модальное окно', () => {
    const { result } = renderHook(() => useLaunches());

    // Сначала открываем
    act(() => {
      result.current.openModal(mockLaunches[0]);
    });

    expect(result.current.isModalOpen).toBe(true);

    // Потом закрываем
    act(() => {
      result.current.closeModal();
    });

    expect(result.current.selectedLaunch).toBeNull();
    expect(result.current.isModalOpen).toBe(false);
  });

  // Тест 6: Открытие разных модальных окон
  it('открывает модальное окно с разными запусками', () => {
    const { result } = renderHook(() => useLaunches());

    // Открываем первый запуск
    act(() => {
      result.current.openModal(mockLaunches[0]);
    });
    expect(result.current.selectedLaunch).toEqual(mockLaunches[0]);

    // Открываем второй запуск (должен заменить первый)
    act(() => {
      result.current.openModal(mockLaunches[1]);
    });
    expect(result.current.selectedLaunch).toEqual(mockLaunches[1]);
    expect(result.current.isModalOpen).toBe(true);
  });

  // Тест 7: Состояние не меняется при открытии/закрытии модального окна во время загрузки
  it('сохраняет данные запусков при открытии/закрытии модального окна', async () => {
    (fetchLaunchesApi as any).mockResolvedValue(mockLaunches);

    const { result } = renderHook(() => useLaunches());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Открываем модальное окно
    act(() => {
      result.current.openModal(mockLaunches[0]);
    });

    // Проверяем что данные запусков не изменились
    expect(result.current.launches).toEqual(mockLaunches);
    expect(result.current.selectedLaunch).toEqual(mockLaunches[0]);

    // Закрываем модальное окно
    act(() => {
      result.current.closeModal();
    });

    // Данные запусков все еще те же
    expect(result.current.launches).toEqual(mockLaunches);
  });

  // Тест 8: Обработка ошибки с не-Error объектом
  it('обрабатывает ошибку когда error не является экземпляром Error', async () => {
    (fetchLaunchesApi as any).mockRejectedValue('string error');

    const { result } = renderHook(() => useLaunches());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBe('error');
  });
});