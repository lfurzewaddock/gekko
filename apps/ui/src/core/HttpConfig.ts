export class HttpConfig {
  apiUrl: string;
  constructor() {
    this.apiUrl =
      process.env.API_URL_PUBLIC_BASE || 'http://localhost:3000/api';
  }
}
