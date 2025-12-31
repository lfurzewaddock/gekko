import type { ContainerDefinition } from '#ioc';

export class HttpGateway {
  private config;
  private headers: Record<string, string>;
  constructor({
    HttpConfig,
  }: {
    HttpConfig: ContainerDefinition['HttpConfig'];
  }) {
    this.config = HttpConfig;
    this.headers = {
      'Content-Type': 'application/json',
    };
  }

  async get<Res>(
    path: string,
    { signal }: { signal: AbortSignal },
  ): Promise<Res> {
    const response = await fetch(this.config.apiUrl + path, {
      method: 'GET',
      headers: this.headers,
      signal,
    });
    const dto = response.json();
    return dto;
  }

  async post<Req, Res>(path: string, reqDto: Req): Promise<Res> {
    const response = await fetch(this.config.apiUrl + path, {
      method: 'POST',
      body: JSON.stringify(reqDto),
      headers: this.headers,
    });
    const dto = response.json();
    return dto;
  }

  async delete<Res>(path: string): Promise<Res> {
    const response = await fetch(this.config.apiUrl + path, {
      method: 'DELETE',
      headers: this.headers,
    });
    const dto = response.json();
    return dto;
  }
}
