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
  Button,
  Flex,
  Center,
  Text,
  CircularProgress,
  HStack,
  useToast,
} from '@chakra-ui/react';
import { updateTestRunResult } from 'data/data_source/test_run_data_source';
import { useState } from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import { MdHorizontalRule } from 'react-icons/md';

export default function TestRunLowLevel(props) {
  const { runID, name, cases, isOpen, onClose, formStore } = props;

  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: cases.length,
  });
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
          {loading ? (
            <Center mb={'16px'}>
              <CircularProgress isIndeterminate />
            </Center>
          ) : (
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
                {steps.map((step, index) => (
                  <Flex
                    direction={'column'}
                    borderBottomColor={'gray.200'}
                    borderBottomWidth={'1px'}
                    p={'16px 16px 16px 16px'}
                  >
                    <Flex alignItems={'center'}>
                      {index < currentStep ? (
                        <FaCheckCircle color="green" />
                      ) : index == currentStep ? (
                        <CircularProgress size={4} isIndeterminate />
                      ) : (
                        <MdHorizontalRule color="gray.300" />
                      )}

                      <Flex
                        justifyContent={'space-between'}
                        alignItems={'center'}
                        flex={'1'}
                      >
                        <Flex direction={'column'}>
                          <Text
                            ml={'20px'}
                            color={
                              index > currentStep ? 'gray.300' : 'black.400'
                            }
                          >
                            {step.action}
                          </Text>
                          <Text
                            ml={'20px'}
                            color={
                              index > currentStep ? 'gray.300' : 'gray.500'
                            }
                          >
                            {step.data}
                          </Text>
                        </Flex>
                        <Text
                          ml={'20px'}
                          color={
                            index < currentStep
                              ? 'green'
                              : index == currentStep
                                ? 'black.400'
                                : 'gray.200'
                          }
                        >
                          {step.expect}
                        </Text>
                      </Flex>
                    </Flex>
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
                  </Flex>
                ))}
              </Box>
            </Flex>
          )}
        </ModalBody>

        {loading ? null : <ModalFooter></ModalFooter>}
      </ModalContent>
    </Modal>
  );
}

function buildStepper(activeStep, cases) {
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
