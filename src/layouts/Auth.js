import { Box } from '@chakra-ui/react';
import React from 'react';

export default function Pages(props) {
  const { ...rest } = props;
  const wrapper = React.createRef();
  React.useEffect(() => {
    document.body.style.overflow = 'unset';
    return function cleanup() {};
  });

  const navRef = React.useRef();
  return (
    <Box ref={navRef} w="100%">
      <Box w="100%">
        <Box ref={wrapper} w="100%"></Box>
      </Box>
      <Box px="24px" mx="auto" width="1044px" maxW="100%" mt="60px"></Box>
    </Box>
  );
}
