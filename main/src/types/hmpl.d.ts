declare module "*.hmpl" {
  import type {
    HMPLInstance,
    HMPLInstanceContext,
    HMPLRequestInit,
    HMPLRequestInitFunction,
  } from "hmpl-js";

  type HMPLTemplate = (
    options?: HMPLRequestInitFunction | HMPLRequestInit
  ) => HMPLInstance;

  const template: HMPLTemplate;
  export default template;
}
