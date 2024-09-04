export const mockTestRunData = [
  {
    name: 'Ai không học bài thì là con chó',
    environment: 'Production',
    es: 'Student App',
    cases: [
      {
        name: 'Ngồi vào bàn học',
        status: 'PASSED',
      },
      {
        name: 'Mở sách vở',
        status: 'PASSED',
      },
      {
        name: 'Chuẩn bị bút',
        status: 'FAILED',
      },
      {
        name: 'Hoàn thành bài tập',
        status: 'PENDING',
      },
    ],
    creator: 'Đỗ hoàng',
  },
  {
    name: 'Ai không học bài thì là con chó',
    environment: 'Qc',
    es: 'Platform',
    cases: [
      {
        name: 'Ngồi vào bàn học',
        status: 'PASSED',
      },
      {
        name: 'Mở sách vở',
        status: 'PASSED',
      },
      {
        name: 'Chuẩn bị bút',
        status: 'FAILED',
      },
      {
        name: 'Hoàn thành bài tập',
        status: 'PENDING',
      },
    ],
    creator: 'Đỗ hoàng',
  },
];

export const mockAutomationTestRunData = [
  {
    name: 'Test Case 5 á',
    type: 'Automation',
    es: 'Backoffice',
    severity: 'Major',
    layer: 'E2E',
    creator: 'Đỗ hoàng',
    steps: [
      {
        action: 'GET',
        data: '/v1/users/get-info',
        expect: 'code=200;success=true',
      },
      {
        action: 'POST',
        data: '/v1/users/get-info',
        expect: 'code=200;success=true',
      },
      {
        action: 'PUT',
        data: '/v1/users/get-info',
        expect: 'code=200;success=true',
      },
    ],
  },
  {
    name: 'Test Case 5 á',
    type: 'Automation',
    es: 'Backoffice',
    severity: 'Major',
    layer: 'E2E',
    creator: 'Đỗ hoàng',
    steps: [
      {
        action: 'GET',
        data: '/v1/users/get-info',
        expect: 'code=200;success=true',
      },
      {
        action: 'POST',
        data: '/v1/users/get-info',
        expect: 'code=200;success=true',
      },
      {
        action: 'PUT',
        data: '/v1/users/get-info',
        expect: 'code=200;success=true',
      },
    ],
  },
];
