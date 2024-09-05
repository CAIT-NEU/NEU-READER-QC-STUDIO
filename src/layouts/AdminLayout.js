// Chakra imports
import {
  Stack,
  Box,
  useColorMode,
  Avatar,
  Flex,
  Text,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuItemOption,
  MenuList,
} from '@chakra-ui/react';
import Sidebar from 'components/Sidebar/Sidebar.js';
import React, { useEffect } from 'react';
import routes from 'routes';
// Custom components
import MainPanel from '../components/Layout/MainPanel';
import PanelContainer from '../components/Layout/PanelContainer';
import PanelContent from '../components/Layout/PanelContent';
import bgAdmin from 'assets/img/admin-background.png';

import TestCase from 'views/TestCase/TestCase.js';
import { Outlet, useNavigate } from 'react-router-dom';
import { AtlassianLogo } from 'components/Icons/Icons';
import { CURRENT_USER } from 'data/data_source/user_data_source';
import { setCurrentUser } from 'data/data_source/user_data_source';

export default function AdminLayout(props) {
  const { ...rest } = props;
  const { colorMode } = useColorMode();

  let navigate = useNavigate();

  useEffect(() => {
    console.log('CURRENT_USER_CHANGED');
    console.log(CURRENT_USER);
    if (CURRENT_USER == null) {
      return navigate('/auth');
    }
  }, [CURRENT_USER]);

  document.documentElement.dir = 'ltr';
  return (
    <Box>
      <Box
        minH="40vh"
        w="100%"
        position="absolute"
        bgImage={colorMode === 'light' ? bgAdmin : 'none'}
        bg={colorMode === 'light' ? bgAdmin : 'navy.900'}
        bgSize="cover"
        top="0"
      />
      <Sidebar
        routes={routes}
        logo={
          <Stack direction="row" spacing="8px" align="center" justify="center">
            <Icon as={AtlassianLogo} boxSize={8} />
            <Text color={'blue.600'} fontSize={'2xl'} fontWeight={'bold'}>
              QC Studio
            </Text>
          </Stack>
        }
        display="none"
        {...rest}
      />
      <MainPanel
        w={{
          base: '100%',
          xl: 'calc(100% - 275px)',
        }}
      >
        <PanelContent>
          <PanelContainer>
            <Flex direction={'row'} justifyContent={'end'} pb={'16px'}>
              <Flex direction={'row'} alignItems={'center'}>
                <Avatar />
                <Menu>
                  <MenuButton>
                    <Flex
                      paddingLeft={'16px'}
                      direction={'column'}
                      alignItems={'start'}
                    >
                      <Text fontSize={'xl'} fontWeight={'bold'} color={'white'}>
                        {CURRENT_USER.name}
                      </Text>
                      <Text color={'white'}>{CURRENT_USER.role}</Text>
                    </Flex>
                  </MenuButton>
                  <MenuList>
                    <MenuItem
                      onClick={() => {
                        setCurrentUser(null);
                        navigate('/auth');
                      }}
                    >
                      Đăng xuất tài khoản
                    </MenuItem>
                  </MenuList>
                </Menu>
              </Flex>
            </Flex>
            <Outlet />
          </PanelContainer>
        </PanelContent>
      </MainPanel>
    </Box>
  );
}

function parseView() {
  let path = window.location.pathname;

  console.log('path: ' + path);

  if (path == '/admin/dashboard') return <TestCase />;
  if (path == '/admin/testcase') return <TestCase />;
}
