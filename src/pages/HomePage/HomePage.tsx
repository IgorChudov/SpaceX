import { Container, Text, SimpleGrid, Flex, Loader, Alert } from '@mantine/core';

import { useLaunches } from "../../hooks/useLaunches"
import { LaunchCard } from '../../components/LaunchCard/LaunchCard';
import { LaunchModal } from '../../components/LaunchModal/LaunchModal';


export const HomePage = () => {
  const { launches, isLoading, error, selectedLaunch, isModalOpen, openModal, closeModal } = useLaunches();

  return (
    <Container size={1200} py='xl'>
      <Text component='h1' size='xl' fw={700} mb='lg' ta='center'>
        SpaceX Launches 2020
      </Text>

      {isLoading && (
        <Flex justify='center' align='center' mt='xl'>
          <Loader size='lg' />
          <Text ml='sm'>Идет загрузка...</Text>
        </Flex>
      )}

      {error && (
        <Alert title='ERROR!' color='red'>Ошибка при загрузке данных: {error}</Alert>
      )}

      {!isLoading && !error && (
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 3 }}>
          {launches.map((launch) => (
            <LaunchCard key={launch.mission_name} launch={launch} onSeeMore={openModal} />
          ))}
        </SimpleGrid>
      )}

      {isModalOpen && selectedLaunch &&
        <LaunchModal onClose={closeModal} launch={selectedLaunch}>
        </LaunchModal>}

      
    </Container>
  )
}