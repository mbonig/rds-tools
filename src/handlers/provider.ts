export interface IProvider {
  query(script: string): Promise<any>;
}