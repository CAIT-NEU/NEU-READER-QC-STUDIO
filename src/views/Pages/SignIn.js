import React from 'react';
// Chakra imports
import {
  Box,
  Flex,
  Button,
  FormControl,
  FormLabel,
  Input,
  Icon,
  Text,
  useColorModeValue,
  Center,
  useToast,
} from '@chakra-ui/react';
// Assets
import signInImage from 'assets/img/signInImage.png';
import { FaApple, FaFacebook, FaGoogle } from 'react-icons/fa';
import { AtlassianLogo } from 'components/Icons/Icons';
import { Field, Form, Formik } from 'formik';
import { getUserBySSO } from 'data/data_source/user_data_source';
import { setCurrentUser } from 'data/data_source/user_data_source';
import { useNavigate } from 'react-router-dom';

function SignIn() {
  const textColor = useColorModeValue('gray.700', 'white');
  const bgForm = useColorModeValue('white', 'navy.800');

  const toast = useToast();
  const navigate = useNavigate();

  return (
    <Flex position="relative" mb="40px">
      <Flex
        minH={{ md: '1000px' }}
        h={{ sm: 'initial', md: '75vh', lg: '85vh' }}
        w="100%"
        maxW="1044px"
        mx="auto"
        justifyContent="space-between"
        mb="30px"
        pt={{ md: '0px' }}
      >
        <Flex
          w="100%"
          h="100%"
          alignItems="center"
          justifyContent="center"
          mb="60px"
        >
          <Flex
            zIndex="2"
            direction="column"
            w="445px"
            background="transparent"
            borderRadius="15px"
            p="40px"
            mx={{ base: '100px' }}
            m={{ base: '20px', md: 'auto' }}
            bg={bgForm}
            boxShadow={useColorModeValue(
              '0px 5px 14px rgba(0, 0, 0, 0.05)',
              'unset'
            )}
          >
            <Center>
              <Icon as={AtlassianLogo} boxSize={16} />
            </Center>
            <Text
              fontSize="2xl"
              color={textColor}
              fontWeight="bold"
              textAlign="center"
              mb="22px"
              mt="16px"
            >
              NEU READER QC STUDIO
            </Text>

            <Formik
              initialValues={{
                name: '',
                password: '',
              }}
              onSubmit={(values, actions) => {
                getUserBySSO(values.name, values.password).then((u) => {
                  if (u == null) {
                    toast({
                      title: 'Đăng nhập thất bại',
                      description: 'Tài khoản không tồn tại trên hệ thống',
                      status: 'error',
                      duration: 5000,
                      position: 'top-right',
                    });
                  } else {
                    setCurrentUser(u);
                    navigate('/admin/testcase');
                  }
                });
              }}
            >
              <Form>
                <Field name="name">
                  {({ field, form }) => (
                    <FormControl>
                      <FormLabel>Tên tài khoản</FormLabel>
                      <Input
                        {...field}
                        variant="auth"
                        fontSize="sm"
                        ms="4px"
                        type="text"
                        mb="24px"
                        size="lg"
                      />
                    </FormControl>
                  )}
                </Field>
                <Field name="password">
                  {({ field, form }) => (
                    <FormControl>
                      <FormLabel>Mật khẩu</FormLabel>
                      <Input
                        {...field}
                        variant="auth"
                        fontSize="sm"
                        ms="4px"
                        type="password"
                        mb="24px"
                        size="lg"
                      />
                    </FormControl>
                  )}
                </Field>
                <Button
                  fontSize="14px"
                  variant="dark"
                  fontWeight="bold"
                  w="100%"
                  h="45"
                  mb="24px"
                  type="submit"
                >
                  ĐĂNG NHẬP
                </Button>
              </Form>
            </Formik>
          </Flex>
        </Flex>
        <Box
          overflowX="hidden"
          h="100%"
          w="100%"
          left="0px"
          position="absolute"
        >
          <Box
            w="100%"
            h="100%"
            bgSize="cover"
            bg="blue.500"
            opacity="0.8"
          ></Box>
        </Box>
      </Flex>
    </Flex>
  );
}

export default SignIn;
