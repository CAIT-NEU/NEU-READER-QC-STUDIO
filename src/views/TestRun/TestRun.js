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
  Skeleton,
  useToast,
} from '@chakra-ui/react';
import Card from 'components/Card/Card.js';
import CardBody from 'components/Card/CardBody.js';
import CardHeader from 'components/Card/CardHeader.js';
import React, { useEffect, useState } from 'react';
import TestRunRow from './TestRunRow';
import TestRunCreate from './TestRunCreate';
import { getAllTestRuns } from 'data/data_source/test_run_data_source';
import { getTestCaseRunResults } from 'data/data_source/test_run_data_source';
import { createTestRun } from 'data/data_source/test_run_data_source';
import { v4 as uuid } from 'uuid';
import { useNavigate } from 'react-router-dom';
import { getAllUsers } from 'data/data_source/user_data_source';
import { getCurrentUser } from 'data/data_source/user_data_source';

function TestRun() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loading, setLoading] = useState(true);
  const [runs, setRuns] = useState([]);
  const [runResults, setRunResults] = useState([]);
  const toast = useToast();
  const navigate = useNavigate();
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    if (loading) {
      getAllUsers().then((users) => {
        setAllUsers(users);
        getAllTestRuns().then(async (runs) => {
          setRuns(runs);

          var rrs = [];
          for (var i = 0; i < runs.length; i++) {
            await getTestCaseRunResults(runs[i].id).then((rr) => {
              var state = 'PASSED';
              var done = false;
              Object.values(rr).forEach((value) => {
                if (done) return;
                if (value.includes('FAILED')) {
                  state = 'FAILED';
                  done = true;
                } else if (value.includes('PENDING')) {
                  state = 'PENDING';
                }
              });
              rrs.push(state);
            });
          }

          setRunResults(rrs);
          setLoading(false);
        });
      });
    }
  }, []);

  const textColor = useColorModeValue('gray.700', 'white');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  if (loading) return <Skeleton isLoaded={false}></Skeleton>;

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
                TEST RUNS
              </Text>
              <Button
                leftIcon={<AddIcon />}
                backgroundColor={'blue.500'}
                textColor={'white'}
                onClick={onOpen}
              >
                Tạo test run
              </Button>
            </Flex>
          </CardHeader>
          <CardBody>
            <Table variant="simple" color={textColor}>
              <Thead>
                <Tr my=".8rem" pl="0px" color="gray.400">
                  <Th pl="0px" borderColor={borderColor} color="gray.400">
                    Tên
                  </Th>
                  <Th borderColor={borderColor} color="gray.400">
                    Môi trường
                  </Th>
                  <Th borderColor={borderColor} color="gray.400">
                    ES
                  </Th>
                  <Th borderColor={borderColor} color="gray.400">
                    Tình trạng
                  </Th>
                  <Th borderColor={borderColor} color="gray.400">
                    Người tạo
                  </Th>
                  <Th borderColor={borderColor}></Th>
                </Tr>
              </Thead>
              <Tbody>
                {runs.map((row, index, arr) => {
                  return (
                    <TestRunRow
                      id={row.id}
                      cases={row.cases}
                      name={row.name}
                      environment={row.environment}
                      es={row.es}
                      status={runResults[index]}
                      creator={
                        allUsers.filter((u) => u.id == row.createdBy)[0].name
                      }
                      isLast={index == runs.length - 1}
                    />
                  );
                })}
              </Tbody>
            </Table>
            {runs.length == 0 ? (
              <Text mb={'20px'}>Hiện chưa có Test Run nào trên hệ thống.</Text>
            ) : null}
          </CardBody>
        </Card>
      </Flex>
      {createTestRunPopup(toast, navigate, isOpen, onClose)}
    </>
  );
}

export default TestRun;

function createTestRunPopup(toast, navigate, isOpen, onClose) {
  var formStore = { id: uuid(), createdBy: getCurrentUser().id };
  return (
    <Modal size={'4xl'} width={'1000px'} isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Tạo Test Run</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <TestRunCreate formStore={formStore} />
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" color={'red.400'} onClick={onClose}>
            Huỷ
          </Button>
          <Button
            colorScheme="blue"
            ml={3}
            onClick={() => {
              console.log(formStore);
              createTestRun(formStore).then((_) => {
                onClose();
                toast({
                  title: 'Tạo thành công',
                  description: 'Đã tạo thành công Test Case mới',
                  status: 'success',
                  duration: 3000,
                  position: 'top-right',
                  isClosable: true,
                });
                navigate('/admin/run/' + formStore.id);
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
