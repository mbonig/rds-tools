export const SUCCESS: string;
export const FAILED: string;

export function send(
  event: any,
  context: any,
  responseStatus: string,
  responseData?: any,
  physicalResourceId?: string | null,
  noEcho?: boolean
): Promise<void>;