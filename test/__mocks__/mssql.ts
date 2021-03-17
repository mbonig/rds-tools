export const mssqlPromiseResponse = jest.fn().mockReturnValue(Promise.resolve(true));


const sql = {
  connect: jest.fn().mockImplementation(() => ({ promise: mssqlPromiseResponse })),
  query: jest.fn().mockImplementation(() => ({ promise: mssqlPromiseResponse })),
};

module.exports = sql;