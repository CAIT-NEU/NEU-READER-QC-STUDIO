import {
  Avatar,
  Badge,
  Button,
  Flex,
  Td,
  Text,
  Tr,
  useColorModeValue,
} from '@chakra-ui/react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

function TestCaseRow(props) {
  const navigate = useNavigate();

  const { id, name, type, es, severity, layer, creator, isLast } = props;
  const textColor = useColorModeValue('gray.500', 'white');
  const titleColor = useColorModeValue('gray.700', 'white');
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
        {buildTypeTag(type)}
      </Td>
      <Td borderColor={borderColor} borderBottom={isLast ? 'none' : null}>
        <Text fontSize="md" color={textColor} fontWeight="bold">
          {es}
        </Text>
      </Td>
      <Td borderColor={borderColor} borderBottom={isLast ? 'none' : null}>
        <Text fontSize="md" color={textColor} pb=".5rem">
          {severity}
        </Text>
      </Td>
      <Td borderColor={borderColor} borderBottom={isLast ? 'none' : null}>
        <Text fontSize="md" color={textColor}>
          {layer}
        </Text>
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
            navigate('/admin/case/' + id);
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

export default TestCaseRow;

function buildTypeTag(type) {
  var color = 'gray.400';
  var display = 'HLTC';

  if (type == 'MANUAL_LL') {
    color = 'orange.500';
    display = 'LLTC';
  } else if (type == 'AUTOMATION') {
    color = 'blue.500';
    display = 'Auto';
  }

  return (
    <Badge
      bg={color}
      color={'white'}
      fontSize="16px"
      p="3px 10px"
      borderRadius="8px"
    >
      {display}
    </Badge>
  );
}
