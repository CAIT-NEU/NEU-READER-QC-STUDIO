// Chakra imports
import { AddIcon } from '@chakra-ui/icons';
import {
  Button,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Table,
  Tbody,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  useDisclosure,
  Box,
  CircularProgress,
  Center,
  useToast,
} from '@chakra-ui/react';
import Card from 'components/Card/Card.js';
import CardBody from 'components/Card/CardBody.js';
import CardHeader from 'components/Card/CardHeader.js';
import TestCaseRow from './TestCaseRow';
import React, { useEffect, useState } from 'react';
import { testCasesMockData } from 'variables/testcases';
import TestCaseCreate from './TestCaseCreate';
import { getAllTestCases } from 'data/data_source/test_case_data_source';
import { createTestCase } from 'data/data_source/test_case_data_source';
import { v4 as uuid } from 'uuid';
import { useNavigate } from 'react-router-dom';
import { CURRENT_USER } from 'data/data_source/user_data_source';
import { getAllUsers } from 'data/data_source/user_data_source';

function TestCase() {
  const [loading, setLoading] = useState(true);
  const [cases, setCases] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [allUsers, setAllUsers] = useState([]);

  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    if (loading == true) {
      getAllUsers().then((users) => {
        setAllUsers(users);
        getAllTestCases().then((cases) => {
          setCases(cases);
          setLoading(false);
        });
      });
    }
  });

  const textColor = useColorModeValue('gray.700', 'white');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  if (loading)
    return (
      <Card
        overflowX={{ sm: 'scroll', xl: 'hidden' }}
        pb="0px"
        backgroundColor="white"
      >
        <CardBody>
          <CircularProgress isIndeterminate />
        </CardBody>
      </Card>
    );

  console.log(allUsers);

  return (
    <>
      <Flex direction="column">
        <Card
          overflowX={{ sm: 'scroll', xl: 'hidden' }}
          pb="0px"
          backgroundColor="white"
        >
          <CardHeader p="6px 0px 22px 0px">
            <Flex justifyContent={'space-between'}>
              <Text fontSize="larger" color={textColor} fontWeight="bold">
                TEST CASES
              </Text>
              <Button
                leftIcon={<AddIcon />}
                backgroundColor={'blue.500'}
                textColor={'white'}
                onClick={onOpen}
              >
                Tạo test case
              </Button>
            </Flex>
          </CardHeader>
          <CardBody>
            <Table variant="simple" color={textColor} mb={'20px'}>
              <Thead>
                <Tr my=".8rem" pl="0px" color="gray.400">
                  <Th
                    w={'500px'}
                    pl="0px"
                    borderColor={borderColor}
                    color="gray.400"
                  >
                    Tên
                  </Th>
                  <Th borderColor={borderColor} color="gray.400">
                    Loại
                  </Th>
                  <Th borderColor={borderColor} color="gray.400">
                    ES
                  </Th>
                  <Th borderColor={borderColor} color="gray.400">
                    Mức nghiêm trọng
                  </Th>
                  <Th borderColor={borderColor} color="gray.400">
                    Tầng
                  </Th>
                  <Th borderColor={borderColor} color="gray.400">
                    Người tạo
                  </Th>
                  <Th borderColor={borderColor}></Th>
                </Tr>
              </Thead>
              <Tbody>
                {cases.map((row, index, arr) => {
                  return (
                    <TestCaseRow
                      id={row.id}
                      name={row.name}
                      type={row.type}
                      es={row.es}
                      severity={row.severity}
                      layer={row.layer}
                      creator={
                        allUsers.filter((u) => u.id == row.createdBy)[0].name
                      }
                      isLast={index == testCasesMockData.length - 1}
                    />
                  );
                })}
              </Tbody>
            </Table>
            {cases.length == 0 ? (
              <Text mb={'20px'}>Hiện chưa có Test Case nào trên hệ thống.</Text>
            ) : null}
          </CardBody>
        </Card>
      </Flex>
      {createTestCasePopup(toast, navigate, isOpen, onClose)}
    </>
  );
}

export default TestCase;

function createTestCasePopup(toast, navigate, isOpen, onClose) {
  var formStore = { id: uuid(), data: null, createdBy: CURRENT_USER.id };
  return (
    <Modal size={'4xl'} width={'1000px'} isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Tạo Test Case</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <TestCaseCreate formStore={formStore} />
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" color={'red.400'} onClick={onClose}>
            Huỷ
          </Button>
          <Button
            colorScheme="blue"
            ml={3}
            onClick={() => {
              createTestCase(formStore).then((_) => {
                onClose();
                toast({
                  title: 'Tạo thành công',
                  description: 'Đã tạo thành công Test Case mới',
                  status: 'success',
                  duration: 3000,
                  position: 'top-right',
                  isClosable: true,
                });
                navigate('/admin/case/' + formStore.id);
              });
            }}
          >
            Tạo
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
