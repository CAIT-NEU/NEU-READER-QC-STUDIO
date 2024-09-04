export class UserEntity {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.role = data.role;
    this.es = data.es;
    this.username = data.username;
    this.password = data.password;
    this.lastLogin = data.lastLogin;
    this.isAdmin = data.isAdmin;
  }
}
