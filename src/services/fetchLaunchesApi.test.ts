import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fetchLaunchesApi } from './fetchLaunchesApi';
import type { Launch } from '../types';

describe('fetchLaunchesApi', () => {
  const mockLaunches: Launch[] = [
    {
      mission_name: "Crew-1",
      rocket: { rocket_name: "Falcon 9" },
      links: { 
        mission_patch_small: "patch_small.jpg",
        mission_patch: "patch.jpg" 
      },
      details: "First crewed flight"
    }
  ];

  const originalFetch = global.fetch;
  
  beforeEach(() => {
    global.fetch = vi.fn();
    vi.useFakeTimers();
  });

  afterEach(() => {
    global.fetch = originalFetch;
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  // Тест 1: Успешный запрос
  it('успешно получает данные с API', async () => {
    const mockResponse = {
      ok: true,
      json: vi.fn().mockResolvedValue(mockLaunches)
    };
    (global.fetch as any).mockResolvedValue(mockResponse);

    const result = await fetchLaunchesApi();

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.spacexdata.com/v3/launches?launch_year=2020',
      expect.objectContaining({
        signal: expect.any(AbortSignal)
      })
    );

    expect(result).toEqual(mockLaunches);
  });

  // Тест 2: Обработка ошибки HTTP
  it('выбрасывает ошибку при HTTP ошибке', async () => {
    const mockResponse = {
      ok: false,
      status: 404
    };
    (global.fetch as any).mockResolvedValue(mockResponse);

    await expect(fetchLaunchesApi()).rejects.toThrow('Ошибка при запросе на сервер 404');
  });

  // Тест 3: Обработка сетевой ошибки
  it('выбрасывает ошибку при сетевой проблеме', async () => {
    const networkError = new Error('Network error');
    (global.fetch as any).mockRejectedValue(networkError);

    await expect(fetchLaunchesApi()).rejects.toThrow('Network error');
  });

  // Тест 4: Проверка очистки таймаута при успешном запросе
  it('очищает таймаут при успешном запросе', async () => {
    const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');
    
    const mockResponse = {
      ok: true,
      json: vi.fn().mockResolvedValue(mockLaunches)
    };
    (global.fetch as any).mockResolvedValue(mockResponse);

    await fetchLaunchesApi();

    expect(clearTimeoutSpy).toHaveBeenCalled();
    clearTimeoutSpy.mockRestore();
  });

  // Тест 5: Проверка очистки таймаута при ошибке
  it('очищает таймаут при ошибке запроса', async () => {
    const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');
    
    (global.fetch as any).mockRejectedValue(new Error('Network error'));

    await expect(fetchLaunchesApi()).rejects.toThrow();
    expect(clearTimeoutSpy).toHaveBeenCalled();
    
    clearTimeoutSpy.mockRestore();
  });

  // Тест 6: Проверка что таймаут не срабатывает при быстром ответе
  it('не выбрасывает ошибку таймаута при быстром ответе', async () => {
    const mockResponse = {
      ok: true,
      json: vi.fn().mockResolvedValue(mockLaunches)
    };
    (global.fetch as any).mockResolvedValue(mockResponse);

    const fetchPromise = fetchLaunchesApi();
    
    // Продвигаем время только на 1 секунду
    await vi.advanceTimersByTimeAsync(1000);
    
    const result = await fetchPromise;
    
    expect(result).toEqual(mockLaunches);
  });
});