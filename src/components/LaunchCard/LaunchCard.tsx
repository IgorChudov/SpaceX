import { Card, Image, Text, Button, Flex } from '@mantine/core';
import type { LaunchCardProps } from '../../types';
import { memo } from "react";

export const LaunchCard = memo(({ launch, onSeeMore }: LaunchCardProps) => {
  return (
    <Card shadow="sm" padding="md" radius="md" withBorder>
      <Flex
      mih={300}
      gap="lg"
      justify="end"
      align="center"
      direction="column"
    >
      <Card.Section>
        <Image
          src={launch.links?.mission_patch_small}
          h={100}
          w='auto'
          alt={launch.mission_name}
          fallbackSrc="https://www.primarymarkets.com/wp-content/uploads/2024/04/Spacex-Circle-Logo.png"
        />
      </Card.Section>

      <Text fw={500} lineClamp={1}>{launch.mission_name}</Text>

      <Text size="sm" c="dimmed">
        {launch.rocket?.rocket_name}
      </Text>

      <Button color="blue" fullWidth mt="md" radius="md" onClick={() => onSeeMore(launch)}>
        See more
      </Button>
      </Flex>
    </Card>
  );
});