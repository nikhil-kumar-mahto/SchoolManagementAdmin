class auth {
  constructor() {
    this.token = "";
  }
  async getAsyncToken() {
    try {
      if (!this.token) {
        const user = localStorage.token;
        this.token = user;
      }
      return { token: this.token };
    } catch {
      this.token = this.token;
    }
  }
  isAuthenticated() {
    this.token = localStorage.token;
    if (this.token) {
      return true;
    } else {
      return false;
    }
  }
  removeStorage() {
    localStorage.clear();
    this.token = "";
  }
}
const Auth = new auth();
export default Auth;
