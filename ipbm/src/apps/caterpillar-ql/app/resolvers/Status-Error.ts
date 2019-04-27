export default class StatusError extends Error {
  status: number;
  constructor(message: string, status: number): void {
    super(message)
    this.status = status
  }
}