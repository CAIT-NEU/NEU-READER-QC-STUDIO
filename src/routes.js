import React from 'react';
import TestCase from 'views/TestCase/TestCase.js';

import { FaBook, FaPlay } from 'react-icons/fa';
import TestRun from 'views/TestRun/TestRun';

var dashRoutes = [
  {
    path: '/testcase',
    name: 'Test Case',
    icon: <FaBook color="inherit" />,
    component: TestCase,
    layout: '/admin',
  },
  {
    path: '/testrun',
    name: 'Test Run',
    icon: <FaPlay color="inherit" />,
    component: TestRun,
    layout: '/admin',
  },
];
export default dashRoutes;
