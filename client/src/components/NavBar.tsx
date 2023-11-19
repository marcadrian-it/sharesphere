import React from "react";
import {
  Box,
  Flex,
  Heading,
  Link,
  Img,
  Button,
  IconButton,
  Stack,
  Collapse,
  Icon,
  Text,
  useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";
import { isServer } from "../utils/isServer";
import { useEffect, useState } from "react";
import { useApolloClient } from "@apollo/client";
import { MeQuery } from "../generated/graphql";
import { ChevronDownIcon, CloseIcon, HamburgerIcon } from "@chakra-ui/icons";

export const NavBar = () => {
  const { isOpen, onToggle } = useDisclosure();
  const [logout, { loading: logoutFetching }] = useLogoutMutation();
  const apolloClient = useApolloClient();
  const { data } = useMeQuery({
    skip: isServer(),
  });
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    setShowContent(true);
  }, []);

  let body = null;
  if (!showContent) {
    body = <Box>Loading...</Box>;
  } else if (!data?.me) {
    body = (
      <Flex ml={2} flexDirection={"column"} align="center">
        <Box>
          <Link as={NextLink} href="/login" mr={2}>
            login
          </Link>
          <Link as={NextLink} href="/register">
            register
          </Link>
        </Box>
      </Flex>
    );
  } else {
    body = (
      <Flex ml={2} flexDirection={"column"} align="center">
        <Box mr={2}>{data.me.username}</Box>
        <Button
          onClick={async () => {
            await logout({});
            await apolloClient.resetStore();
          }}
          isLoading={logoutFetching}
          variant="link"
        >
          logout
        </Button>
      </Flex>
    );
  }

  return (
    <Box position="sticky" top={0} zIndex={2}>
      <Flex
        zIndex={1}
        position="sticky"
        top={0}
        p={3}
        borderBottom="1px solid silver"
        sx={{
          "::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgGradient: "linear(to-r, red.200, tan)",
            zIndex: -1,
          },
        }}
      >
        <Flex
          flex={{ base: 1, md: "auto" }}
          align="center"
          maxW={800}
          ml={{ base: -2 }}
          display={{ base: "flex", md: "none" }}
        >
          <IconButton
            onClick={onToggle}
            icon={
              isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />
            }
            variant="ghost"
            aria-label="Toggle Navigation"
          />
        </Flex>
        <Flex flex={{ base: 1 }} justify={{ base: "center", md: "start" }}>
          <Link as={NextLink} href="/">
            <Flex
              flexDirection="row"
              align="center"
              textAlign={useBreakpointValue({ base: "center", md: "left" })}
            >
              <Box boxSize="24">
                <Img
                  src="https://res.cloudinary.com/dmzmqvehw/image/upload/v1682981008/cover1_p49abt.png"
                  width="100"
                  height="100"
                  alt="logo"
                />
              </Box>
              <Heading display={{ base: "none", md: "flex" }}>
                Sharesphere
              </Heading>
            </Flex>
          </Link>
          <Flex display={{ base: "none", md: "flex" }} ml={10}>
            <DesktopNav data={data} />
          </Flex>
        </Flex>
        <Stack
          flex={{ base: 1, md: 0 }}
          justify="flex-end"
          align="center"
          direction="row"
          spacing={6}
        >
          <Box>{body}</Box>
        </Stack>
      </Flex>
      <Collapse in={isOpen} animateOpacity>
        <MobileNav data={data} />
      </Collapse>
      <svg
        className="diagonal"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 10"
        preserveAspectRatio="none"
        width="100%"
        height="25"
      >
        <defs>
          <linearGradient id="linear" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#c02d28"></stop>
            <stop offset="100%" stopColor="#e66225"></stop>
          </linearGradient>
        </defs>
        <polygon points="0,2 0,0 100,0 100,10" fill="url(#linear)"></polygon>
      </svg>
    </Box>
  );
};

interface DesktopNavProps {
  data: MeQuery | undefined;
}

const DesktopNav = ({ data }: DesktopNavProps) => {
  return (
    <Stack direction="row" spacing={4}>
      {NAV_ITEMS.map((navItem) => (
        <Box key={navItem.label}>
          <Link
            p={2}
            href={navItem.href ?? "#"}
            fontSize="sm"
            fontWeight={500}
            color="gray.600"
            _hover={{ textDecoration: "none", color: "gray.800" }}
          >
            <Flex flexDirection="row" align="center">
              {data?.me && (
                <Button border="1px solid silver" colorScheme="gray">
                  {navItem.label}
                </Button>
              )}
            </Flex>
          </Link>
        </Box>
      ))}
    </Stack>
  );
};

interface MobileNavProps {
  data: MeQuery | undefined;
}

const MobileNav = ({ data }: MobileNavProps) => {
  return (
    <Stack
      borderBottom="1px solid silver"
      bg="white"
      p={4}
      display={{ md: "none" }}
    >
      {NAV_ITEMS.map((navItem) => (
        <Box key={navItem.label}>
          {data?.me && (
            <Button>
              <MobileNavItem {...navItem} />
            </Button>
          )}
        </Box>
      ))}
    </Stack>
  );
};

const MobileNavItem = ({ label, children, href }: NavItem) => {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Stack spacing={4} onClick={children && onToggle}>
      <Flex
        py={2}
        as={Link}
        href={href ?? "#"}
        justify={"space-between"}
        align={"center"}
        _hover={{
          textDecoration: "none",
        }}
      >
        <Text fontWeight={600} color="gray.600">
          {label}
        </Text>
        {children && (
          <Icon
            as={ChevronDownIcon}
            transition={"all .25s ease-in-out"}
            transform={isOpen ? "rotate(180deg)" : ""}
            w={6}
            h={6}
          />
        )}
      </Flex>

      <Collapse in={isOpen} animateOpacity style={{ marginTop: "0" }}>
        <Stack
          mt={2}
          pl={4}
          borderLeft={1}
          borderStyle={"solid"}
          borderColor="gray.200"
          align={"start"}
        >
          {children &&
            children.map((child) => (
              <Link key={child.label} py={2} href={child.href}>
                <Button>{child.label}</Button>
              </Link>
            ))}
        </Stack>
      </Collapse>
    </Stack>
  );
};

interface NavItem {
  label: string;
  subLabel?: string;
  children?: Array<NavItem>;
  href?: string;
}

const NAV_ITEMS = [
  {
    label: "create post",
    href: "/create-post",
  },
];
