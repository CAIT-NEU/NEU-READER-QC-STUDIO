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
  AlertDialogCloseButton,
  useDisclosure,
  useToast,
  CircularProgress,
  Skeleton,
} from '@chakra-ui/react';
import { IoCopyOutline, IoSave, IoTrash } from 'react-icons/io5';
import { useNavigate, useParams } from 'react-router-dom';
import {
  MdHorizontalRule,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
} from 'react-icons/md';
import TestCaseHighLevel from './TestCaseHighLevel';
import { ChevronLeftIcon } from '@chakra-ui/icons';
import React, { useEffect, useRef, useState } from 'react';
import { getAllTestCases } from 'data/data_source/test_case_data_source';
import TestCaseLowLevel from './TestCaseLowLevel';
import { updateTestCase } from 'data/data_source/test_case_data_source';
import { getTestCaseByID } from 'data/data_source/test_case_data_source';

function TestCaseDetail() {
  const cancelRef = useRef();
  const toast = useToast();
  const navigate = useNavigate();

  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState();

  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    if (loading == true) {
      getTestCaseByID(id).then((c) => {
        setData(c);
        setLoading(false);
        console.log(c);
      });
    }
  }, []);

  if (loading) return <Skeleton isLoaded={false}></Skeleton>;

  const formStore = [];
  return (
    <>
      <Flex direction="column">
        <Card
          overflowX={{ sm: 'scroll', xl: 'hidden' }}
          pb="0px"
          p={'20px 16px 6px 16px'}
        >
          <CardHeader p="6px 0px 22px 0px">
            <Flex justifyContent={'space-between'}>
              <Flex>
                <Button
                  w={'32px'}
                  leftIcon={<ChevronLeftIcon w={'32px'} h={'32px'} />}
                  backgroundColor={'transparent'}
                  onClick={() => {
                    navigate('/admin/testcase');
                  }}
                />
                <Box w={'16px'} />
                <Flex direction={'column'}>
                  <Text fontSize="3xl" color="gray.700" fontWeight="bold">
                    {data.name}
                  </Text>
                  <Flex direction={'row'} alignItems={'center'} mt={'8px'}>
                    <Text fontSize={'xl'} color="gray.400">
                      {id}
                    </Text>
                    <Box width={'8px'} />
                    <IoCopyOutline
                      color={'blue'}
                      cursor={'pointer'}
                      onClick={(e) => {
                        navigator.clipboard.writeText(id);
                        toast({
                          title: 'Thành công',
                          description:
                            'Đã sao chép mã Test Case vào bộ nhớ tạm.',
                          status: 'success',
                          duration: 3000,
                          position: 'top-right',
                          isClosable: true,
                        });
                      }}
                    />
                  </Flex>
                </Flex>
              </Flex>
              <Flex alignItems={'center'}>
                <Button
                  leftIcon={<IoTrash />}
                  backgroundColor={'transparent'}
                  textColor={'red'}
                  fontWeight={'normal'}
                  onClick={onOpen}
                >
                  Xoá test case
                </Button>
                <Box w={'8px'} />
                <Button
                  leftIcon={<IoSave />}
                  backgroundColor={'blue.400'}
                  textColor={'white'}
                  onClick={() => {
                    updateTestCase(id, formStore).then((_) => {
                      requestSave(toast);
                    });
                  }}
                >
                  Lưu thông tin
                </Button>
              </Flex>
            </Flex>
          </CardHeader>
          <CardBody>
            <Text fontSize={'xl'} fontWeight={'bold'}>
              Thông tin chung
            </Text>
            {getGeneralInfo(data)}
            <Box height={'20px'} />
            <Text fontSize={'xl'} fontWeight={'bold'}>
              Dữ liệu Test Case
            </Text>
            {data.type != 'MANUAL_HL' ? (
              <TestCaseLowLevel
                formStore={formStore}
                stepData={data.data == null ? [] : JSON.parse(data.data)}
              />
            ) : (
              <Box w={'100%'} h={'500px'} mt={'20px'}>
                <TestCaseHighLevel formStore={formStore} data={data.data}/>
              </Box>
            )}
          </CardBody>
        </Card>
      </Flex>

      {requestDelete(cancelRef, isOpen, onClose)}
    </>
  );
}

export default TestCaseDetail;

function requestSave(toast) {
  toast({
    title: 'Lưu thành công',
    description: 'Đã lưu thành công dữ liệu Test Case này',
    status: 'success',
    duration: 3000,
    position: 'top-right',
    isClosable: true,
  });
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

function buildESTag(es) {
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
    <Tag variant={'solid'} colorScheme={color}>
      {display}
    </Tag>
  );
}

function buildSeverityTag(severity) {
  var icon = <MdKeyboardDoubleArrowUp color="red" />;
  var display = 'Rất nghiêm trọng';

  if (severity == 'MAJOR') {
    icon = <MdKeyboardArrowUp color="orange" />;
    display = 'Nghiêm trọng';
  } else if (severity == 'NORMAL') {
    icon = <MdHorizontalRule color="green" />;
    display = 'Bình thường';
  }

  return (
    <Flex>
      {icon}
      <Box w={'8px'} />
      <Text>{display}</Text>
    </Flex>
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
              {buildTypeTag(data.type)}
            </Flex>
          </Td>
          <Td>
            <Flex alignItems={'center'}>
              <Text fontWeight={'bold'}>ES: </Text>
              <Box width={'8px'} />
              {buildESTag(data.es)}
            </Flex>
          </Td>
        </Tr>
        <Tr>
          <Td>
            <Flex alignItems={'center'}>
              <Text fontWeight={'bold'}>Mức nghiêm trọng: </Text>
              <Box width={'8px'} />
              {buildSeverityTag(data.severity)}
            </Flex>
          </Td>
          <Td>
            <Flex alignItems={'center'}>
              <Text fontWeight={'bold'}>Tầng: </Text>
              <Box width={'8px'} />
              <Text>{data.layer}</Text>
            </Flex>
          </Td>
        </Tr>
        <Tr>
          <Td>
            <Text fontWeight={'bold'}>Tiền điều kiện: </Text>
            <Text>{data.preconditions ?? '--'}</Text>
          </Td>
          <Td>
            <Text fontWeight={'bold'}>Hậu điều kiện: </Text>
            <Text>{data.postconditions ?? '--'}</Text>
          </Td>
        </Tr>
      </Tbody>
    </Table>
  );
}
