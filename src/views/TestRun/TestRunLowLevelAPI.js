import {
  Step,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  Stepper,
  useSteps,
  Box,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Flex,
  Text,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  useToast,
  Tag,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  CircularProgress,
  Center,
  HStack,
  Button,
} from '@chakra-ui/react';
import { updateTestRunResult } from 'data/data_source/test_run_data_source';
import { useState } from 'react';
import { FaCheckCircle } from 'react-icons/fa';

export default function TestRunLowLevelAPI(props) {
  const { runID, name, cases, isOpen, onClose, formStore } = props;

  const [currentStep, setCurrentStep] = useState(0);
  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: cases.length,
  });
  var [running, setRunning] = useState(false);
  const toast = useToast();

  var steps = JSON.parse(cases[activeStep].data);

  return (
    <Modal
      size={'6xl'}
      width={'1000px'}
      isOpen={isOpen}
      onClose={onClose}
      closeOnOverlayClick={false}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{name}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex>
            {buildStepper(activeStep, cases)}{' '}
            <Box
              flex={'1'}
              ml={'20px'}
              border={'1px solid'}
              borderColor={'gray.200'}
              borderRadius={'8px'}
              overflowY={'scroll'}
            >
              <Accordion
                mt={'16px'}
                allowMultiple
                index={currentStep}
                allowToggle={false}
              >
                {steps.map((c, index) => (
                  <AccordionItem>
                    <h2>
                      <AccordionButton>
                        <Box as="span" flex="1" textAlign="left">
                          <Flex>
                            {buildMethodTag(c.action)}
                            <Box w={'16px'} />
                            <Text>{c.data}</Text>
                          </Flex>
                        </Box>
                        <Flex alignItems={'center'}>
                          {index < currentStep ? (
                            <FaCheckCircle color={'green'} />
                          ) : (
                            <CircularProgress
                              size={5}
                              isIndeterminate={currentStep == index}
                            />
                          )}

                          <AccordionIcon ml={'16px'} />
                        </Flex>
                      </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4}>
                      <Table>
                        <Thead>
                          <Tr>
                            <Th>Tham số</Th>
                            <Th>Kết quả mong muốn</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {c.expect.split(';').map((p) => (
                            <Tr>
                              <Td>{p.split('=')[0]}</Td>
                              <Td>{p.split('=')[1]}</Td>
                              <Td>
                                <CircularProgress
                                  isIndeterminate={running}
                                  size={4}
                                />
                              </Td>
                            </Tr>
                          ))}
                        </Tbody>
                      </Table>
                      {index == currentStep ? (
                        <Center mt={'20px'}>
                          <HStack spacing={'8px'}>
                            <Button
                              backgroundColor={'green.400'}
                              textColor={'white'}
                              onClick={() => {
                                if (currentStep != steps.length - 1) {
                                  formStore[activeStep][currentStep] = 'PASSED';
                                  setCurrentStep(currentStep + 1);
                                } else {
                                  formStore[activeStep][currentStep] = 'PASSED';
                                  setCurrentStep(0);

                                  if (activeStep + 1 == cases.length) {
                                    setActiveStep(0);
                                    onClose();
                                    toast({
                                      title: 'Test Run hoàn tất thành công',
                                      description:
                                        'Toàn bộ các Test Case của Test Run này đã pass 🥳!',
                                      status: 'success',
                                      duration: 5000,
                                      position: 'top-right',
                                      isClosable: true,
                                    });

                                    updateTestRunResult(runID, formStore).then(
                                      (_) => {
                                        setInterval(() => {
                                          location.reload();
                                        }, 2000);
                                      }
                                    );
                                  } else setActiveStep(activeStep + 1);
                                }
                              }}
                            >
                              PASSED
                            </Button>
                            <Button
                              backgroundColor={'red.400'}
                              textColor={'white'}
                              onClick={() => {
                                formStore[activeStep][currentStep] = 'FAILED';
                                setActiveStep(0);
                                onClose();
                                toast({
                                  title: 'Test Run thất bại',
                                  description:
                                    'Test Run thất bại do Test Case ' +
                                    cases[activeStep].name +
                                    ' bị FAILED !',
                                  status: 'error',
                                  duration: 5000,
                                  position: 'top-right',
                                  isClosable: true,
                                });

                                updateTestRunResult(runID, formStore).then(
                                  (_) => {
                                    setInterval(() => {
                                      location.reload();
                                    }, 2000);
                                  }
                                );
                              }}
                            >
                              FAILED
                            </Button>
                          </HStack>
                        </Center>
                      ) : null}
                    </AccordionPanel>
                  </AccordionItem>
                ))}
              </Accordion>
            </Box>
          </Flex>
        </ModalBody>

        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  );
}

function buildMethodTag(method) {
  if (method == 'GET')
    return (
      <Tag
        backgroundColor={'green.400'}
        textColor={'white'}
        fontWeight={'bold'}
      >
        GET
      </Tag>
    );
  if (method == 'POST')
    return (
      <Tag
        backgroundColor={'yellow.400'}
        textColor={'white'}
        fontWeight={'bold'}
      >
        POST
      </Tag>
    );
  if (method == 'PUT')
    return (
      <Tag backgroundColor={'blue.500'} textColor={'white'} fontWeight={'bold'}>
        PUT
      </Tag>
    );
}

function buildStepper(activeStep, cases) {
  console.log(activeStep);
  return (
    <Stepper
      colorScheme={'green'}
      index={activeStep}
      orientation="vertical"
      height="400px"
      gap="0"
    >
      {cases.map((step, index) => (
        <Step key={index}>
          <StepIndicator>
            <StepStatus
              complete={<StepIcon />}
              incomplete={<StepNumber />}
              active={<StepNumber />}
            />
          </StepIndicator>

          <Box w={'200px'} mb={'30px'}>
            <Text
              fontWeight={activeStep == index ? 'bold' : 'medium'}
              color={activeStep > index ? 'green.600' : 'gray.500'}
            >
              {step.name}
            </Text>
          </Box>

          <StepSeparator />
        </Step>
      ))}
    </Stepper>
  );
}
