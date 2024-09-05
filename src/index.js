import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import {
  Routes,
  Route,
  BrowserRouter,
  useNavigate,
  Navigate,
} from 'react-router-dom';

import AuthLayout from 'layouts/Auth.js';
import AdminLayout from 'layouts/AdminLayout';
import { ChakraProvider } from '@chakra-ui/react';

import theme from 'theme/theme.js';
import TestCase from 'views/TestCase/TestCase';
import TestCaseDetail from 'views/TestCase/TestCaseDetail';
import TestRun from 'views/TestRun/TestRun';
import TestRunDetail from 'views/TestRun/TestRunDetail';

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(<App />);

export default function App() {
  return (
    <ChakraProvider theme={theme} resetCss={false} position="relative">
      <BrowserRouter>
        <Routes>
          <Route path={`/auth`} element={<AuthLayout />} />
          <Route path="/admin" Component={AdminLayout}>
            <Route path="testcase" Component={TestCase} />
            <Route path="case/:id" Component={TestCaseDetail} />
            <Route path="testrun" Component={TestRun} />
            <Route path="run/:id" Component={TestRunDetail} />
          </Route>
          <Route path="*" element={<Navigate to="/auth" replace />} />
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  );
}
