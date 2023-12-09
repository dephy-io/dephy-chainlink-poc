'use client'

import { useState } from 'react';
import { Container, Group, Burger } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import classes from './HeaderMenu.module.css';
import { IconBatteryEco } from '@tabler/icons-react';

const links = [
  { link: 'https://dephy.io', label: 'DePHY' },
  { link: 'https://github.com/dephy-io', label: 'Github' },
];

export default function HeaderMenu() {
  const [opened, { toggle }] = useDisclosure(false);
  const [active, setActive] = useState(links[0].link);

  const items = links.map((link) => (
    <a
      key={link.label}
      href={link.link}
      className={classes.link}
    >
      {link.label}
    </a>
  ));

  return (
    <header className={classes.header}>
      <Container size="md" className={classes.inner}>
        <a>
          <IconBatteryEco />
          <span className={classes.headerSpan}>Save energy with DePHY!</span>
        </a>

        <Group gap={5} visibleFrom='sm'>
          {items}
        </Group>

        {/* <Burger opened={opened} onClick={toggle} hiddenFrom="xs" size="sm" /> */}
      </Container>
    </header>
  );
}