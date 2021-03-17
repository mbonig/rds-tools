export const mssqlPromiseResponse = jest.fn().mockReturnValue(Promise.resolve(true));


class Client {
  connect = jest.fn().mockImplementation(() => ({ promise: mssqlPromiseResponse }));
  query = jest.fn().mockImplementation(() => ({ promise: mssqlPromiseResponse }));
  end = jest.fn().mockImplementation(() => ({ promise: mssqlPromiseResponse }));
}
module.exports = { Client };