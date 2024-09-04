import {
  Avatar,
  Badge,
  Box,
  Button,
  Center,
  Flex,
  Stack,
  Tag,
  Td,
  Text,
  Tooltip,
  Tr,
  useColorModeValue,
} from '@chakra-ui/react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

function TestRunRow(props) {
  const navigate = useNavigate();

  const { id, cases, name, environment, es, status, creator, isLast } = props;
  const textColor = useColorModeValue('gray.500', 'white');
  const titleColor = useColorModeValue('gray.700', 'white');
  const bgStatus = useColorModeValue('gray.400', 'navy.900');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  return (
    <Tr>
      <Td
        minWidth={{ sm: '250px' }}
        pl="0px"
        borderColor={borderColor}
        borderBottom={isLast ? 'none' : null}
      >
        <Flex align="center" py=".8rem" minWidth="100%" flexWrap="nowrap">
          <Flex direction="column">
            <Text
              fontSize="md"
              color={titleColor}
              fontWeight="bold"
              minWidth="100%"
            >
              {name}
            </Text>
          </Flex>
        </Flex>
      </Td>
      <Td borderColor={borderColor} borderBottom={isLast ? 'none' : null}>
        <Badge
          bg={environment === 'Production' ? 'red.500' : bgStatus}
          color={'white'}
          fontSize="16px"
          p="3px 10px"
          borderRadius="8px"
        >
          {environment.toUpperCase()}
        </Badge>
      </Td>
      <Td borderColor={borderColor} borderBottom={isLast ? 'none' : null}>
        <Text fontSize="md" color={textColor} fontWeight="bold">
          {es}
        </Text>
      </Td>
      <Td borderColor={borderColor} borderBottom={isLast ? 'none' : null}>
        <Tag
          variant={'subtle'}
          backgroundColor={
            status == 'PENDING'
              ? 'gray'
              : status == 'PASSED'
                ? 'green.400'
                : 'red.500'
          }
          textColor={'white'}
          fontWeight={'bold'}
          fontSize={'medium'}
          h={'20px'}
        >
          {status}
        </Tag>
      </Td>
      <Td borderColor={borderColor} borderBottom={isLast ? 'none' : null}>
        <Text fontSize="md" color={textColor} fontWeight="bold">
          {creator}
        </Text>
      </Td>
      <Td borderColor={borderColor} borderBottom={isLast ? 'none' : null}>
        <Button
          p="0px"
          bg="transparent"
          variant="no-effects"
          onClick={() => {
            navigate('/admin/run/' + id);
          }}
        >
          <Text
            fontSize="md"
            color="gray.400"
            fontWeight="bold"
            cursor="pointer"
          >
            Chi tiết
          </Text>
        </Button>
      </Td>
    </Tr>
  );
}

function buildStatusProgressBar(cases) {
  let totalCases = cases.length;
  let passedCases = cases.filter((c) => c.status == 'PASSED').length;
  let failedCases = cases.filter((c) => c.status == 'FAILED').length;

  let passedPercent = Math.round((passedCases / totalCases) * 100);
  let failedPercent = Math.round((failedCases / totalCases) * 100);

  return (
    <div style={{ display: '' }}>
      <Flex>
        <Tooltip label={'Passed: ' + passedCases}>
          <Box
            w={passedPercent + '%'}
            h={'30px'}
            backgroundColor={'green.500'}
          />
        </Tooltip>
        <Tooltip label={'Pending: ' + (totalCases - passedCases - failedCases)}>
          <Box
            w={100 - passedPercent - failedPercent + '%'}
            h={'30px'}
            backgroundColor={'gray'}
          />
        </Tooltip>
        <Tooltip label={'Failed: ' + failedCases}>
          <Box w={failedPercent + '%'} h={'30px'} backgroundColor={'red.500'} />
        </Tooltip>
      </Flex>
    </div>
  );
}

export default TestRunRow;
