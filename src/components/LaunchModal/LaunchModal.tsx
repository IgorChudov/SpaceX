import { createPortal } from 'react-dom';
import { Overlay } from "../Overlay/Overlay";
import { Image, Text, Flex, } from "@mantine/core";
import { useEffect } from 'react';
import type { LaunchModalProps } from '../../types';
import styles from './LaunchModal.module.css'

const modalElement = document.getElementById('modal') || document.body

export const LaunchModal = ({ launch, onClose }: LaunchModalProps) => {

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => e.code === 'Escape' && onClose();
    document.addEventListener('keydown', onEsc);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onEsc);
      document.body.style.overflow = 'unset';
    };
  }, [onClose])

  if (!launch) return null;

  return createPortal(
    <>
      <div className={styles.modal}>
      
        <Flex direction="row" gap="xs" justify='space-between'>
          <Text component='h2' size='xl' fw={700} ta='center'>
              {launch.mission_name}
          </Text>
          <button className={styles.btn} onClick={() => {onClose()}}>✕</button>
        </Flex>

        <Flex direction='column' gap='md'>
          <Flex justify='center' p='md'>
            <Image
              src={launch.links?.mission_patch}
              h={150}
              w='auto'
              fit='contain'
              alt={`${launch.mission_name} patch`}
              fallbackSrc="https://www.primarymarkets.com/wp-content/uploads/2024/04/Spacex-Circle-Logo.png"
            />
          </Flex>

          <Flex direction="column" gap="xs">

            <Text size="sm">
                <Text component="h3" fw={700}>Mission name: </Text>
                <Text c='dimmed' component='p'>{launch.mission_name || 'Unknown'}</Text>
            </Text>

            <Text size="sm">
                <Text component="h3" fw={700}>Rocket name: </Text>
                <Text c='dimmed' component='p'>{launch.rocket?.rocket_name || 'Unknown'}</Text>
            </Text>

            <Text size="sm">
                <Text component="h3" fw={700}>Details: </Text>
                <Text c='dimmed' component='p'>{launch.details || 'Unknown'}</Text>
            </Text>

          </Flex>
        </Flex>
      </div>
      <Overlay onClose={onClose}/>
    </>, 
    modalElement
  );
};