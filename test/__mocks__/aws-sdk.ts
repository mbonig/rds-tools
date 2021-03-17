export const awsSdkPromiseResponse = jest.fn().mockReturnValue(Promise.resolve({ } ));

const putFn = jest.fn().mockImplementation(() => ({ promise: awsSdkPromiseResponse }));

class DocumentClient {
  put = putFn;
}

export const DynamoDB = {
  DocumentClient,
};

const getSecretValueFn = jest.fn().mockImplementation(() => ({ promise: awsSdkPromiseResponse }));

export class SecretsManager {
  getSecretValue = getSecretValueFn;
}