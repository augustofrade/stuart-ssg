import { AsyncFunction } from "../../../shared/types";

export abstract class PageBuildPipelineStep<
  BeforeHook extends AsyncFunction,
  AfterHook extends AsyncFunction,
> {
  protected readonly beforeHooks: BeforeHook[] = [];
  protected readonly afterHooks: AfterHook[] = [];

  public before(fns: BeforeHook[]): this {
    this.beforeHooks.push(...fns);
    return this;
  }
  public after(fns: AfterHook[]): this {
    this.afterHooks.push(...fns);
    return this;
  }
}
