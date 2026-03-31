import { HttpGateway } from '#core/HttpGateway.ts';
import { err, type Result } from '#util/error';

import type { ContainerDefinition } from '#ioc';

type AnyResult = Result<unknown>;

export class FakeHttpGateway extends HttpGateway {
  public postCalls: Array<{ path: string; signal?: AbortSignal | null; reqDto: unknown }> = [];
  public getCalls: Array<{ path: string; signal?: AbortSignal | null }> = [];
  public deleteCalls: Array<{ path: string }> = [];

  private postResults = new Map<string, AnyResult>();
  private getResults = new Map<string, AnyResult>();
  private deleteResults = new Map<string, AnyResult>();

  constructor({ HttpConfig }: { HttpConfig: ContainerDefinition['HttpConfig'] }) {
    super({ HttpConfig });
  }

  reset(): void {
    this.postCalls.length = 0;
    this.getCalls.length = 0;
    this.deleteCalls.length = 0;
    this.postResults.clear();
    this.getResults.clear();
    this.deleteResults.clear();
  }

  setPostResult<Res>(path: string, result: Result<Res>): void {
    this.postResults.set(path, result as AnyResult);
  }

  setGetResult<Res>(path: string, result: Result<Res>): void {
    this.getResults.set(path, result as AnyResult);
  }

  setDeleteResult<Res>(path: string, result: Result<Res>): void {
    this.deleteResults.set(path, result as AnyResult);
  }

  override async post<Req, Res>(
    path: string,
    { signal }: { signal?: AbortSignal | null },
    reqDto: Req,
  ): Promise<Result<Res>> {
    this.postCalls.push({ path, signal, reqDto });
    const result = this.postResults.get(path);
    if (!result) return err(new Error(`No fake POST result configured for: ${path}`), 500);
    return result as Result<Res>;
  }

  override async get<Res>(
    path: string,
    { signal }: { signal?: AbortSignal | null },
  ): Promise<Result<Res>> {
    this.getCalls.push({ path, signal });
    const result = this.getResults.get(path);
    if (!result) return err(new Error(`No fake GET result configured for: ${path}`), 500);
    return result as Result<Res>;
  }

  override async delete<Res>(path: string): Promise<Result<Res>> {
    this.deleteCalls.push({ path });
    const result = this.deleteResults.get(path);
    if (!result) return err(new Error(`No fake DELETE result configured for: ${path}`), 500);
    return result as Result<Res>;
  }
}
