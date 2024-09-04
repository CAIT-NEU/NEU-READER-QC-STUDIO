export class TestRunResult {
  constructor(data) {
    this.runID = data.runID;
    this.caseID = data.caseID;
    this.result = data.result;
    this.updateTime = data.updateTime;
    this.updateBy = data.updateBy;
  }
}
