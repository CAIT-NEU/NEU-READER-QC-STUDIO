import { AddIcon } from '@chakra-ui/icons';
import {
  Button,
  Center,
  Flex,
  Input,
  Table,
  Tag,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { useState } from 'react';

export default function TestCaseLowLevel(props) {
  const { formStore, stepData } = props;

  const [noStep, setNoStep] = useState(stepData.length);
  const [steps, setSteps] = useState([]);
  if (noStep > stepData.length) {
    formStore.push({});
    steps.push(createEmptyRow(formStore, noStep));
  } else {
    for (var i = 0; i < stepData.length; i++) {
      var testStep = stepData[i];
      formStore.push({
        action: testStep.action,
        data: testStep.data,
        expect: testStep.expect,
      });
      steps.push(createFilledRow(formStore, i + 1));
    }
  }

  return (
    <Flex direction={'column'} mt={'16px'}>
      <Table>
        <Thead>
          <Tr>
            <Th w={'20px'}>Bước</Th>
            <Th>Hành động</Th>
            <Th>Dữ liệu đầu vào</Th>
            <Th>Kết quả mong muốn</Th>
          </Tr>
        </Thead>
        <Tbody>{steps}</Tbody>
      </Table>
      <Center mt={'16px'}>
        <Button
          leftIcon={<AddIcon />}
          backgroundColor={'blue.400'}
          textColor={'white'}
          onClick={() => {
            setNoStep(noStep + 1);
          }}
        >
          Thêm bước
        </Button>
      </Center>
    </Flex>
  );
}

function createEmptyRow(formStore, noStep) {
  return (
    <Tr key={'step_' + noStep}>
      <Td>
        <Text align={'center'}>{noStep}</Text>
      </Td>
      <Td>
        <Input
          placeholder="Hành động"
          key={'action_' + noStep}
          onChange={(e) => {
            formStore[noStep - 1].action = e.target.value;
          }}
        />
      </Td>
      <Td>
        <Input
          placeholder="Dữ liệu cần thiết"
          key={'data_' + noStep}
          onChange={(e) => {
            formStore[noStep - 1].data = e.target.value;
          }}
        />
      </Td>
      <Td>
        <Input
          placeholder="Kết quả mong muốn"
          key={'expect_' + noStep}
          onChange={(e) => {
            formStore[noStep - 1].expect = e.target.value;
          }}
        />
      </Td>
    </Tr>
  );
}

function createFilledRow(formStore, noStep, data) {
  return (
    <Tr key={'step_' + noStep}>
      <Td>
        <Text align={'center'}>{noStep}</Text>
      </Td>
      <Td>
        <Input
          placeholder="Hành động"
          key={'action_' + noStep}
          onChange={(e) => {
            formStore[noStep - 1].action = e.target.value;
          }}
          defaultValue={formStore[noStep - 1].action}
        />
      </Td>
      <Td>
        <Input
          placeholder="Dữ liệu cần thiết"
          key={'data_' + noStep}
          onChange={(e) => {
            formStore[noStep - 1].data = e.target.value;
          }}
          defaultValue={formStore[noStep - 1].data}
        />
      </Td>
      <Td>
        <Input
          placeholder="Kết quả mong muốn"
          key={'expect_' + noStep}
          onChange={(e) => {
            formStore[noStep - 1].expect = e.target.value;
          }}
          defaultValue={formStore[noStep - 1].expect}
        />
      </Td>
    </Tr>
  );
}
