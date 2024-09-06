import { TestCaseEntity } from 'data/entity/test_case_entity';
import { supabase } from '../../index';

export async function createTestCase(data) {
  await supabase.from('testcase').insert(data);
  return true;
}

export async function deleteTestCase(uuid) {
  await supabase.from('testcase').delete().eq('id', uuid);
}

export async function getTestCaseByID(uuid) {
  var data = await supabase.from('testcase').select('*').eq('id', uuid);
  data = data.data[0];
  return new TestCaseEntity({
    id: data.id,
    name: data.name,
    type: data.type,
    es: data.es,
    severity: data.severity,
    layer: data.layer,
    preconditions: data.preconditions,
    postconditions: data.postconditions,
    data: data.data,
    createdAt: data.createdAt,
    createdBy: data.createdBy,
  });
}

export async function updateTestCase(uuid, data) {
  await supabase
    .from('testcase')
    .update({ data: JSON.stringify(data) })
    .eq('id', uuid);
}

export async function getAllTestCases() {
  var result = [];
  var data = await supabase.from('testcase').select('*');

  for (var i = 0; i < data.data.length; i++) {
    var testcase = data.data[i];
    result.push(
      new TestCaseEntity({
        id: testcase.id,
        name: testcase.name,
        type: testcase.type,
        es: testcase.es,
        severity: testcase.severity,
        layer: testcase.layer,
        preconditions: testcase.preconditions,
        postconditions: testcase.postconditions,
        data: testcase.data,
        createdAt: testcase.createdAt,
        createdBy: testcase.createdBy,
      })
    );
  }
  return result;
}
