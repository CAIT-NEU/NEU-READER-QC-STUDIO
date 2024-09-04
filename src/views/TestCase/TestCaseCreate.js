import { Flex, Input, Select, Text } from '@chakra-ui/react';
import { MdArrowDropDown } from 'react-icons/md';

export default function TestCaseCreate(props) {
  const { formStore } = props;
  return (
    <Flex direction={'column'}>
      <Input
        placeholder="Tên test case"
        onChange={(e) => {
          formStore['name'] = e.target.value;
        }}
      />
      <Flex mt={'16px'}>
        <Select
          icon={<MdArrowDropDown />}
          placeholder="Loại test case"
          onChange={(e) => {
            formStore['type'] = e.target.value.toUpperCase();
          }}
        >
          <option value="manual_hl">{'Thủ công (HLTC)'}</option>
          <option value="manual_ll">{'Thủ công (LLTC)'}</option>
          <option value="automation">{'Tự động'}</option>
        </Select>
        <div style={{ width: '20px' }} />
        <Select
          icon={<MdArrowDropDown />}
          placeholder="ES"
          onChange={(e) => {
            formStore['es'] = e.target.value.toUpperCase();
          }}
        >
          <option value="backoffice">{'Backoffice'}</option>
          <option value="student_app">{'Student App'}</option>
          <option value="platform">{'Platform'}</option>
        </Select>
      </Flex>
      <Flex mt={'16px'}>
        <Select
          icon={<MdArrowDropDown />}
          placeholder="Mức nghiêm trọng"
          onChange={(e) => {
            formStore['severity'] = e.target.value.toUpperCase();
          }}
        >
          <option value="critical">{'Rất nghiêm trọng'}</option>
          <option value="major">{'Nghiêm trọng'}</option>
          <option value="normal">{'Bình thường'}</option>
        </Select>
        <div style={{ width: '20px' }} />
        <Select
          icon={<MdArrowDropDown />}
          placeholder="Tầng"
          onChange={(e) => {
            formStore['layer'] = e.target.value.toUpperCase();
          }}
        >
          <option value="e2e">{'E2E'}</option>
          <option value="api">{'API'}</option>
          <option value="unit">{'Unit'}</option>
        </Select>
      </Flex>
      <Input
        placeholder="Tiền điều kiện"
        mt={'16px'}
        onChange={(e) => {
          formStore['preconditions'] = e.target.value;
        }}
      />
      <Input
        placeholder="Hậu điều kiện"
        mt={'16px'}
        onChange={(e) => {
          formStore['postconditions'] = e.target.value;
        }}
      />
      <Text>{''}</Text>
    </Flex>
  );
}
