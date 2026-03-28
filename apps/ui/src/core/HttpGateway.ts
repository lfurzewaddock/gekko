import { ok, err, toErrorWithMessage, type Result } from '#util/error';

import type { ContainerDefinition } from '#ioc';

export class HttpGateway {
  private config;
  private headers: Record<string, string>;
  constructor({ HttpConfig }: { HttpConfig: ContainerDefinition['HttpConfig'] }) {
    this.config = HttpConfig;
    this.headers = {
      'Content-Type': 'application/json',
    };
  }

  async get<Res>(path: string, { signal }: { signal?: AbortSignal | null }): Promise<Result<Res>> {
    let response;
    try {
      response = await fetch(this.config.apiUrl + path, {
        method: 'GET',
        headers: this.headers,
        signal,
      });
      if (!response.ok) {
        const { status = 0 } = response ?? {};
        return err(new Error(response.statusText), status);
      }
      // TODO use Zod/similar to verify runtime and no need to force type on dto
      const dto = (await response.json()) as Res;
      return ok<Res>(dto, response.status);
    } catch (e) {
      const { status = 0 } = response ?? {};
      const error = toErrorWithMessage(e);
      return err(error, status);
    }
  }

  async post<Req, Res>(
    path: string,
    { signal }: { signal?: AbortSignal | null },
    reqDto: Req,
  ): Promise<Result<Res>> {
    let response;
    try {
      response = await fetch(this.config.apiUrl + path, {
        method: 'POST',
        body: JSON.stringify(reqDto),
        headers: this.headers,
        signal,
      });
      if (!response.ok) {
        const { status = 0 } = response ?? {};
        return err(new Error(response.statusText), status);
      }
      // TODO use Zod/similar to verify runtime and no need to force type on dto
      const dto = (await response.json()) as Res;
      return ok<Res>(dto, response.status);
    } catch (e) {
      const { status = 0 } = response ?? {};
      const error = toErrorWithMessage(e);
      return err(error, status);
    }
  }

  async delete<Res>(path: string): Promise<Result<Res>> {
    let response;
    try {
      response = await fetch(this.config.apiUrl + path, {
        method: 'DELETE',
        headers: this.headers,
      });
      if (!response.ok) {
        const { status = 0 } = response ?? {};
        return err(new Error(response.statusText), status);
      }
      // TODO use Zod/similar to verify runtime and no need to force type on dto
      const dto = (await response.json()) as Res;
      return ok<Res>(dto, response.status);
    } catch (e) {
      const { status = 0 } = response ?? {};
      const error = toErrorWithMessage(e);
      return err(error, status);
    }
  }
}
