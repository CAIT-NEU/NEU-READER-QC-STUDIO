export class TestRunEntity {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.es = data.es;
    this.environment = data.environment;
    this.cases = data.cases;
    this.createdAt = data.createdAt;
    this.createdBy = data.createdBy;
  }
}
