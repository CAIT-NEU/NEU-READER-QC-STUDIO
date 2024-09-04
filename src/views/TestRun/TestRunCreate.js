import {
  Flex,
  Input,
  Select,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
  Box,
  Button,
  HStack,
  Text,
  Tag,
  TagLabel,
  TagRightIcon,
  useToast,
  Badge,
  CircularProgress,
} from '@chakra-ui/react';
import { getAllTestCases } from 'data/data_source/test_case_data_source';
import { useEffect, useState } from 'react';
import { FaCheck } from 'react-icons/fa';
import { MdArrowDropDown, MdClose } from 'react-icons/md';

export default function TestRunCreate(props) {
  const [loading, setLoading] = useState(true);
  const [testCases, setTestCases] = useState([]);
  const [cases, setCases] = useState([]);
  const [keyword, setKeyword] = useState('');
  const toast = useToast();

  useEffect(() => {
    if (loading) {
      getAllTestCases().then((cases) => {
        setTestCases(cases);
        setLoading(false);
      });
    }
  }, []);

  const { formStore } = props;

  function AddTestCaseSection(formStore, allTestCases) {
    const onSearchChange = (data) => {
      setKeyword(data.target.value);
    };

    return (
      <Flex direction={'column'}>
        <Input onChange={onSearchChange} mt={'16px'} />
        {cases.length > 0 ? (
          <HStack spacing={'8px'} wrap={'wrap'} mt={'16px'}>
            {cases.map((c) => (
              <Tag
                size={'xl'}
                key={c.name}
                variant="outline"
                colorScheme="blue"
                padding={'4px'}
              >
                <TagLabel>{c.name}</TagLabel>
                <TagRightIcon
                  cursor={'pointer'}
                  as={MdClose}
                  onClick={() => {
                    setCases(cases.filter((c2) => c.name != c2.name));
                    formStore['cases'] = JSON.stringify(
                      cases.filter((c2) => c.name != c2.name).map((z) => z.id)
                    );
                  }}
                />
              </Tag>
            ))}
          </HStack>
        ) : null}
        <Box w={'100%'} h={'500px'} overflowY={'scroll'} mt={'16px'}>
          {allTestCases
            .filter((c) => c.type != 'HLTC_HL')
            .filter(
              (c) =>
                JSON.parse(c.data) != null &&
                JSON.parse(c.data) != undefined &&
                JSON.parse(c.data).length > 0
            )
            .filter((c) =>
              c.name?.toLowerCase().includes(keyword?.toLowerCase())
            )
            .map((c) => {
              return (
                <Flex
                  justifyContent={'space-between'}
                  alignItems={'center'}
                  mt={'16px'}
                  pb={'16px'}
                  borderBottomColor={'gray.200'}
                  borderBottomWidth={'1px'}
                >
                  <Flex alignItems={'center'} pr={'20px'}>
                    <Text>{c.name}</Text>
                    <Box w={'16px'} />
                    <Badge>{c.type}</Badge>
                    <Box w={'8px'} />
                    <Badge>{c.es}</Badge>
                  </Flex>
                  {cases.filter((c2) => c2.name == c.name).length > 0 ? (
                    <Button
                      fontSize={'l'}
                      textColor={'green.400'}
                      variant={'outlined'}
                      leftIcon={<FaCheck />}
                    >
                      Đã thêm
                    </Button>
                  ) : (
                    <Button
                      backgroundColor={'blue.400'}
                      textColor={'white'}
                      onClick={() => {
                        if (
                          cases.filter((c2) => c2.type != c.type).length > 0
                        ) {
                          toast({
                            title: 'Thêm Test Case không hợp lệ',
                            description:
                              'Bạn không thể thêm một Test Case ' +
                              c.type +
                              ' vào một danh sách có các Test Case khác loại.',
                            status: 'error',
                            duration: 3000,
                            position: 'top-right',
                            isClosable: true,
                          });
                          return;
                        }
                        setCases([c, ...cases]);
                        formStore['cases'] = JSON.stringify(
                          [c, ...cases].map((z) => z.id) ?? []
                        );
                      }}
                    >
                      Thêm
                    </Button>
                  )}
                </Flex>
              );
            })}
        </Box>
      </Flex>
    );
  }

  if (loading) return <CircularProgress isIndeterminate />;

  return (
    <Flex direction={'column'}>
      <Input
        placeholder="Tên test run"
        onChange={(e) => {
          formStore['name'] = e.target.value;
        }}
      />
      <Flex mt={'16px'}>
        <Select
          icon={<MdArrowDropDown />}
          placeholder="Môi trường"
          onChange={(e) => {
            formStore['environment'] = e.target.value;
          }}
        >
          <option value="PRODUCTION">{'Production'}</option>
          <option value="QC">{'QC'}</option>
        </Select>
        <div style={{ width: '20px' }} />
        <Select
          icon={<MdArrowDropDown />}
          placeholder="ES"
          onChange={(e) => {
            formStore['es'] = e.target.value;
          }}
        >
          <option value="BACKOFFICE">{'Backoffice'}</option>
          <option value="STUDENT_APP">{'Student App'}</option>
          <option value="PLATFORM">{'Platform'}</option>
        </Select>
      </Flex>
      {AddTestCaseSection(formStore, testCases)}
    </Flex>
  );
}
