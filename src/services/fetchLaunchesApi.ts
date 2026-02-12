export const fetchLaunchesApi = async () => {
  const response = await fetch('https://api.spacexdata.com/v3/launches?launch_year=2020');

  if (!response.ok) {
    throw new Error(`Ошибка при запросе на сервер ${response.status}`);
  }

  return await response.json();
}