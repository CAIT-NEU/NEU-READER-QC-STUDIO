import { TestRunEntity } from 'data/entity/test_run_entity';
import { supabase } from '../../index';
import { getAllTestCases } from './test_case_data_source';
import { now } from 'moment';
import { CURRENT_USER } from './user_data_source';

export async function createTestRun(data) {
  await supabase.from('testrun').insert(data);
  return true;
}

export async function getTestRunByID(uuid) {
  var data = await supabase.from('testrun').select('*').eq('id', uuid);
  data = data.data[0];
  var allCases = await getAllTestCases();
  var cases = JSON.parse(data.cases).map(
    (c) => allCases.filter((c2) => c2.id == c)[0]
  );
  return new TestRunEntity({
    id: data.id,
    name: data.name,
    es: data.es,
    cases: cases,
    environment: data.environment,
    createdAt: data.createdAt,
    createdBy: data.createdBy,
  });
}

export async function getAllTestRuns() {
  var result = [];
  var data = await supabase.from('testrun').select('*');

  var allCases = await getAllTestCases();

  for (var i = 0; i < data.data.length; i++) {
    var testcase = data.data[i];
    console.log(testcase.cases);
    var cases = JSON.parse(testcase.cases).map(
      (c) => allCases.filter((c2) => c2.id == c)[0]
    );
    result.push(
      new TestRunEntity({
        id: testcase.id,
        name: testcase.name,
        es: testcase.es,
        cases: cases,
        environment: testcase.environment,
        createdAt: testcase.createdAt,
        createdBy: testcase.createdBy,
      })
    );
  }
  return result;
}

export async function getTestCaseRunResults(runUUID) {
  var testRun = await getTestRunByID(runUUID);

  var result = {};

  for (var i = 0; i < testRun.cases.length; i++) {
    var testCase = testRun.cases[i];

    var data = await supabase
      .from('testrunresults')
      .select('*')
      .eq('runID', runUUID)
      .eq('caseID', testCase.id);
    data = data.data[0];

    var caseResult = [];
    if (data == null || data == undefined) {
      for (var j = 0; j < JSON.parse(testCase.data).length ?? 0; j++) {
        caseResult.push('PENDING');
      }
    } else {
      caseResult = JSON.parse(data.result);
    }

    result[testCase.id] = caseResult;
  }

  return result;
}

export async function updateTestRunResult(runID, result) {
  var testRun = await getTestRunByID(runID);

  for (var i = 0; i < testRun.cases.length; i++) {
    var testCase = testRun.cases[i];

    var data = await supabase
      .from('testrunresults')
      .select('*')
      .eq('runID', runID)
      .eq('caseID', testCase.id);

    if (data.data == null || data.data == undefined || data.data.length == 0) {
      await supabase.from('testrunresults').insert({
        runID: runID,
        caseID: testCase.id,
        result: JSON.stringify(Object.values(result[i])),
        updateTime: now(),
        updateBy: CURRENT_USER.id,
      });
    } else {
      await supabase
        .from('testrunresults')
        .update({
          result: JSON.stringify(Object.values(result[i])),
          updateTime: now(),
          updateBy: CURRENT_USER.id,
        })
        .eq('runID', runID)
        .eq('caseID', testCase.id);
    }
  }
}
