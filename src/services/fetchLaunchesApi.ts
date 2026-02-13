import type { Launch } from '../types';

export const fetchLaunchesApi = async (): Promise<Launch[]>  => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch('https://api.spacexdata.com/v3/launches?launch_year=2020',
  {
      signal: controller.signal
    });

    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`Ошибка при запросе на сервер ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Превышено время ожидания ответа от сервера')
    }
    throw error;
  }
};
