import { Box } from '@chakra-ui/react';
import { getCurrentUser } from 'data/data_source/user_data_source';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SignIn from 'views/Pages/SignIn';

export default function Pages(props) {
  let navigate = useNavigate();

  useEffect(() => {
    if (getCurrentUser() != null) {
      return navigate('/admin/testcase');
    }
  }, [getCurrentUser()]);

  React.useEffect(() => {
    document.body.style.overflow = 'unset';
    return function cleanup() {};
  });

  const navRef = React.useRef();
  return (
    <Box ref={navRef} w="100%">
      <SignIn />
    </Box>
  );
}
