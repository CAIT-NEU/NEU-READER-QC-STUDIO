import {
  Flex,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Box,
  Text,
  useToast,
} from '@chakra-ui/react';
import { useState } from 'react';
import { DrawIoEmbed } from 'react-drawio';
import { IoPencil } from 'react-icons/io5';

export default function TestCaseHighLevel() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [imgData, setImgData] = useState(null);

  return (
    <>
      <Flex direction={'column'}>
        <Button
          w={'120px'}
          backgroundColor={'blue.400'}
          textColor={'white'}
          leftIcon={<IoPencil />}
          onClick={onOpen}
        >
          Chỉnh sửa
        </Button>
        <Box h={'20px'} />
        <Box w={'100%'}>{imgData && <img src={imgData} />}</Box>
      </Flex>
      {buildDrawIO(toast, imgData, setImgData, isOpen, onClose)}
    </>
  );
}

function buildDrawIO(toast, imgData, setImgData, isOpen, onClose) {
  return (
    <Modal size={'full'} isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Tạo High-Level Test Case với draw.io</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box w={'100%'} h={'calc(100vh - 200px)'}>
            <DrawIoEmbed
              xml={imgData}
              onSave={(data) => {
                toast({
                  title: 'Lưu thành công',
                  description: 'Đã lưu thành công High-Level Test Case của bạn',
                  status: 'success',
                  duration: 3000,
                  position: 'top-right',
                  isClosable: true,
                });
                setImgData(data.xml);
              }}
            />
          </Box>
          <Text mt={'16px'} fontSize={'xl'}>
            Để di chuyển, vừa giữ phím cách (Space) vừa kéo chuột
          </Text>
        </ModalBody>

        <ModalFooter>
          <Text fontSize={'xl'} fontWeight={'bold'} color={'red'}>
            Lưu ý: Để lưu lại kết quả, bấm Ctrl + S hoặc click vào nút Save ở
            góc trên bên trái
          </Text>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
