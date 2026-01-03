import { HttpGateway } from '#core/HttpGateway.ts';

import type { ContainerDefinition } from '#ioc';

export class FakeHttpGateway extends HttpGateway {
  constructor({
    HttpConfig,
  }: {
    HttpConfig: ContainerDefinition['HttpConfig'];
  }) {
    super({
      HttpConfig,
    });
  }

  async get<Res>(
    path: string,
    { signal }: { signal: AbortSignal },
  ): Promise<Res> {
    const fakeRes: Res = {} as Res;
    return fakeRes;
  }

  async post<Req, Res>(path: string, reqDto: Req): Promise<Res> {
    const fakeRes: Res = {} as Res;
    return fakeRes;
  }

  async delete<Res>(path: string): Promise<Res> {
    const fakeRes: Res = {} as Res;
    return fakeRes;
  }
}
