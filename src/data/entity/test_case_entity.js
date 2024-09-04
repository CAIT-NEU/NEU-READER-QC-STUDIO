export class TestCaseEntity {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.type = data.type;
    this.es = data.es;
    this.severity = data.severity;
    this.layer = data.layer;
    this.preconditions = data.preconditions;
    this.postconditions = data.postconditions;
    this.data = data.data;
    this.createdAt = data.createdAt;
    this.createdBy = data.createdBy;
  }
}
