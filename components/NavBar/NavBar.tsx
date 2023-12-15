import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { createStyles, Navbar, Group, Code, getStylesRef, rem, Modal } from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { ColorSchemeToggle } from '../ColorSchemeToggle/ColorSchemeToggle';
import Link from 'next/link';

import {
  IconFingerprint,
  IconSettings,
  IconDatabaseImport,
  IconSwitchHorizontal,
  IconLogout,
  IconHome2,
  IconStethoscope,
  IconMovie,
  IconHierarchy,
  IconParking
} from '@tabler/icons-react';
import { Aperture } from '@phosphor-icons/react';

const useStyles = createStyles((theme) => ({
  header: {
    paddingBottom: theme.spacing.md,
    marginBottom: `calc(${theme.spacing.md} * 1.5)`,
    borderBottom: `${rem(1)} solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]
    }`,
  },

  footer: {
    paddingTop: theme.spacing.md,
    marginTop: theme.spacing.md,
    borderTop: `${rem(1)} solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]
    }`,
  },

  link: {
    ...theme.fn.focusStyles(),
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
    fontSize: theme.fontSizes.sm,
    color: theme.colorScheme === 'dark' ? theme.colors.dark[1] : theme.colors.gray[7],
    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
    borderRadius: theme.radius.sm,
    fontWeight: 500,

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
      color: theme.colorScheme === 'dark' ? theme.white : theme.black,

      [`& .${getStylesRef('icon')}`]: {
        color: theme.colorScheme === 'dark' ? theme.white : theme.black,
      },
    },
  },

  linkIcon: {
    ref: getStylesRef('icon'),
    color: theme.colorScheme === 'dark' ? theme.colors.dark[2] : theme.colors.gray[6],
    marginRight: theme.spacing.sm,
  },

  linkActive: {
    '&, &:hover': {
      backgroundColor: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).background,
      color: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).color,
      [`& .${getStylesRef('icon')}`]: {
        color: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).color,
      },
    },
  },
}));

const data = [
  { link: '/', label: 'Movie Recommendation', icon: IconMovie },
  { link: '/graph', label: 'Graph', icon: IconHierarchy },
];

export default function NavBar() {
  const [active, setActive] = useState('Home');
  const [opened, { open, close }] = useDisclosure(false);
  const isMobile = useMediaQuery('(max-width: 50em)');
  const router = useRouter();
  const { classes, cx } = useStyles();

  useEffect(() => {
    const currentPathname = router.pathname;
    const matchingItem = data.find((item) => item.link === currentPathname);
    if (matchingItem) {
      setActive(matchingItem.label);
    }
  }, [router.pathname]);

  const links = data.map((item) => (
    <Link
      className={cx(classes.link, { [classes.linkActive]: item.label === active })}
      href={item.link}
      key={item.label}
      onClick={(event) => {
        if (item.link == '') {
          open();
        } else {
          setActive(item.label);
        }
      }}
    >
      <item.icon className={classes.linkIcon} stroke={1.5} />
      <span>{item.label}</span>
    </Link>
  ));

  if (isMobile) {
    return;
  }

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        title="👾 Made by Paulo Capelo 👾"
        fullScreen={isMobile}
        centered
        style={{
          position: 'absolute',
          zIndex: 1000,
        }}
        transitionProps={{ transition: 'scale', duration: 200 }}
      >
        Thank you for your time!
      </Modal>
      <Navbar height={'100vh'} width={{ sm: 300 }} p="md">
        <Navbar.Section grow>
          <Group className={classes.header} position="apart">
            <Aperture size={28} />
            <Group>
              <Code sx={{ fontWeight: 700 }}>v1.0.0</Code>
              <ColorSchemeToggle size={'sm'} />
            </Group>
          </Group>
          {links}
        </Navbar.Section>
        <Navbar.Section className={classes.footer}>
          <a href="#" className={classes.link} onClick={(event) => open()}>
            <IconParking className={classes.linkIcon} stroke={1.5} />
            <span>Made by Capelo</span>
          </a>
        </Navbar.Section>
      </Navbar>
    </>
  );
}
