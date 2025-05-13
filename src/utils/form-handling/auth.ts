class AuthClass {
  private token: string;

  constructor() {
    this.token = "";
  }

  async getAsyncToken(): Promise<{ token: string }> {
    try {
      if (!this.token) {
        const user = localStorage.getItem("token") || "";
        this.token = user;
      }
      return { token: this.token };
    } catch {
      return { token: this.token };
    }
  }

  isAuthenticated(): boolean {
    this.token = localStorage.getItem("token") || "";
    return !!this.token;
  }

  clearToken(): void {
    this.token = "";
    localStorage.clear();
  }

  removeStorage(): void {
    localStorage.clear();
    this.token = "";
  }
}

const Auth = new AuthClass();
export default Auth;
