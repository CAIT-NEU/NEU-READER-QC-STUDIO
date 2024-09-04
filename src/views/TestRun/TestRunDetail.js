import {
  Card,
  CardHeader,
  CardBody,
  Flex,
  Text,
  Box,
  Table,
  Tr,
  Td,
  Th,
  Tbody,
  Thead,
  Tag,
  Button,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  useDisclosure,
  useToast,
  Badge,
  Skeleton,
} from '@chakra-ui/react';
import {
  IoClose,
  IoCloseCircle,
  IoCopyOutline,
  IoPlay,
  IoTrash,
} from 'react-icons/io5';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeftIcon } from '@chakra-ui/icons';
import React, { useEffect, useRef, useState } from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import TestRunLowLevelAPI from './TestRunLowLevelAPI';
import { getTestRunByID } from 'data/data_source/test_run_data_source';
import { getTestCaseRunResults } from 'data/data_source/test_run_data_source';
import { MdHorizontalRule } from 'react-icons/md';
import TestRunLowLevel from './TestRunLowLevel';

function TestRunDetail(props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [run, setRun] = useState();
  const [runStatus, setRunStatus] = useState('PENDING');
  const [runResult, setRunResult] = useState();
  const [formStore, setFormStore] = useState({});

  const { id } = useParams();

  useEffect(() => {
    if (loading) {
      getTestRunByID(id).then((r) => {
        var form = {};
        for (var i = 0; i < r.cases.length; i++) {
          form[i] = {};
          var c = r.cases[i];
          for (var j = 0; j < JSON.parse(c.data).length; j++) {
            form[i][j] = 'PENDING';
          }
        }
        setFormStore(form);

        setRun(r);
        getTestCaseRunResults(r.id).then((rr) => {
          setRunResult(rr);

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
          setRunStatus(state);

          setLoading(false);
        });
      });
    }
  });

  if (loading) return <Skeleton isLoaded={false}></Skeleton>;

  return (
    <>
      <Flex direction="column">
        <Card
          overflowX={{ sm: 'scroll', xl: 'hidden' }}
          pb="0px"
          p={'16px 16px 6px 16px'}
        >
          <CardHeader p="6px 0px 22px 0px">
            <Flex justifyContent={'space-between'}>
              <Flex>
                <Button
                  w={'32px'}
                  leftIcon={<ChevronLeftIcon w={'32px'} h={'32px'} />}
                  backgroundColor={'transparent'}
                  onClick={() => {
                    navigate('/admin/testrun');
                  }}
                />
                <Box w={'16px'} />
                <Flex direction={'column'}>
                  <Flex alignItems={'center'}>
                    <Text fontSize="3xl" color="gray.700" fontWeight="bold">
                      {run.name}
                    </Text>
                    <Tag
                      variant={'subtle'}
                      backgroundColor={
                        runStatus == 'PENDING'
                          ? 'gray'
                          : runStatus == 'PASSED'
                            ? 'green.400'
                            : 'red.500'
                      }
                      textColor={'white'}
                      fontWeight={'bold'}
                      fontSize={'medium'}
                      ml={'16px'}
                      h={'20px'}
                    >
                      {runStatus}
                    </Tag>
                  </Flex>
                  <Flex direction={'row'} alignItems={'center'}>
                    <Text fontSize={'xl'} color="gray.400">
                      {id}
                    </Text>
                    <Box width={'8px'} />
                    <IoCopyOutline color={'blue'} />
                  </Flex>
                </Flex>
              </Flex>
              <Flex alignItems={'center'}>
                <Button
                  leftIcon={<IoTrash />}
                  backgroundColor={'transparent'}
                  textColor={'red'}
                  fontWeight={'normal'}
                >
                  Xoá test run
                </Button>
                <Box w={'8px'} />
                <Button
                  leftIcon={<IoPlay />}
                  backgroundColor={'green.400'}
                  textColor={'white'}
                  onClick={() => {
                    if (run.cases[0].type == 'AUTOMATION') {
                      toast({
                        title: 'Không thể thực hiện hành động này',
                        description:
                          'Các Test Run với loại là Automation cần phải chạy code Auto bằng Java. Xem chi tiết hướng dẫn trên Confluence.',
                        isClosable: true,
                        position: 'top-right',
                        duration: 5000,
                        status: 'error',
                      });
                    } else {
                      setFormStore({});
                      setLoading(true);
                      onOpen();
                    }
                  }}
                >
                  Chạy
                </Button>
              </Flex>
            </Flex>
          </CardHeader>
          <CardBody>
            <Text fontSize={'xl'} fontWeight={'bold'}>
              Thông tin chung
            </Text>
            {getGeneralInfo(run)}
            <Box height={'20px'} />
            <Text fontSize={'xl'} fontWeight={'bold'}>
              Dữ liệu Test Run
            </Text>
            {getTestRunData(run.cases, runResult)}
          </CardBody>
        </Card>
      </Flex>
      {run.cases[0].type != 'MANUAL_LL' ? null : run.cases[0].layer == 'API' ? (
        <TestRunLowLevelAPI
          runID={run.id}
          name={run.name}
          cases={run.cases}
          isOpen={isOpen}
          onClose={onClose}
          formStore={formStore}
        />
      ) : (
        <TestRunLowLevel
          runID={run.id}
          name={run.name}
          cases={run.cases}
          isOpen={isOpen}
          onClose={onClose}
          formStore={formStore}
        />
      )}
    </>
  );
}

export default TestRunDetail;

function getTestRunData(cases, runResult) {
  var foundFailed = false;
  return (
    <Accordion mt={'16px'} allowMultiple>
      {cases
        .filter(
          (cz) => JSON.parse(cz.data) != null && JSON.parse(cz.data).length != 0
        )
        .map((c) => {
          var caseRunResult = runResult[c.id];
          var isFailed = caseRunResult.includes('FAILED');
          var isPassed = !(caseRunResult.includes('PENDING') || isFailed);

          if (isFailed && !foundFailed) {
            foundFailed = true;
          } else if (foundFailed) {
            isFailed = false;
            isPassed = false;
          }

          var color = isPassed ? 'green' : isFailed ? 'red.500' : 'gray.400';

          return (
            <AccordionItem>
              <h2>
                <AccordionButton>
                  <Box as="span" flex="1" textAlign="left">
                    <Text fontSize={'l'} fontWeight={'bold'} color={color}>
                      {c.name}
                    </Text>
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                {JSON.parse(c.data).map((step, index) => {
                  var caseFailed = caseRunResult[index] == 'FAILED';
                  return (
                    <Flex
                      alignItems={'center'}
                      borderBottomColor={'gray.200'}
                      borderBottomWidth={'1px'}
                      p={'8px 16px 8px 16px'}
                      ml={'48px'}
                      backgroundColor={caseFailed ? 'red.500' : 'white'}
                    >
                      {caseRunResult[index] == 'PASSED' ? (
                        <FaCheckCircle color="green" />
                      ) : caseFailed ? (
                        <IoCloseCircle color="white" size={'20px'} />
                      ) : (
                        <MdHorizontalRule color="gray" />
                      )}
                      <Flex
                        justifyContent={'space-between'}
                        alignItems={'center'}
                        flex={'1'}
                      >
                        <Flex direction={'column'}>
                          <Text ml={'20px'} color={caseFailed ? 'white' : null}>
                            {step.action}
                          </Text>
                          <Text
                            ml={'20px'}
                            color={caseFailed ? 'white' : 'gray.500'}
                          >
                            {step.data}
                          </Text>
                        </Flex>
                        <Text
                          ml={'20px'}
                          color={
                            caseRunResult[index] == 'PASSED'
                              ? 'green'
                              : caseFailed
                                ? 'white'
                                : 'gray'
                          }
                        >
                          {step.expect}
                        </Text>
                      </Flex>
                    </Flex>
                  );
                })}
              </AccordionPanel>
            </AccordionItem>
          );
        })}
    </Accordion>
  );
}

function requestDelete(cancelRef, isOpen, onClose) {
  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Xoá Test Case
          </AlertDialogHeader>

          <AlertDialogBody>
            Bạn chắc chắn muốn xoá Test Case này?
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              Huỷ
            </Button>
            <Button colorScheme="red" onClick={onClose} ml={3}>
              Xác nhận
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}

function buildTypeTag(type) {
  var color = 'gray';
  var display = 'Thủ công (HLTC)';

  if (type == 'AUTOMATION') {
    color = 'blue';
    display = 'Tự động';
  } else if (type == 'MANUAL_LL') {
    color = 'yellow';
    display = 'Thủ công (LLTC)';
  }

  return (
    <Tag variant={'outline'} colorScheme={color}>
      {display}
    </Tag>
  );
}

function buildTag(environment, es) {
  var color = 'blue';
  var display = 'BACKOFFICE';

  if (es == 'STUDENT_APP') {
    color = 'orange';
    display = 'STUDENT APP';
  } else if (es == 'PLATFORM') {
    color = 'purple';
    display = 'PLATFORM';
  }

  return (
    <Flex>
      {buildEnvironmentTag(environment)}
      <Box w={'8px'} />
      <Badge colorScheme={color} variant={'subtle'}>
        {display}
      </Badge>
    </Flex>
  );
}

function buildEnvironmentTag(environment) {
  var color = 'gray';
  var display = 'QC';

  if (environment == 'PRODUCTION') {
    color = 'red';
    display = 'PRODUCTION';
  }
  return (
    <Badge colorScheme={color} variant={'subtle'}>
      {display}
    </Badge>
  );
}

function getGeneralInfo(data) {
  return (
    <Table>
      <Thead>
        <Tr>
          <Th></Th>
          <Th></Th>
        </Tr>
      </Thead>
      <Tbody>
        <Tr>
          <Td>
            <Flex alignItems={'center'}>
              <Text fontWeight={'bold'}>Loại: </Text>
              <Box width={'8px'} />
              {buildTypeTag(data.cases[0].type)}
            </Flex>
          </Td>
          <Td>
            <Flex alignItems={'center'}>
              <Text fontWeight={'bold'}>Tag: </Text>
              <Box width={'8px'} />
              {buildTag(data.environment, data.es)}
            </Flex>
          </Td>
        </Tr>
      </Tbody>
    </Table>
  );
}
