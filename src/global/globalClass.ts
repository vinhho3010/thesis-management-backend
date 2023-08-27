export class ResponseData<D> {
  data: D | D[];
  message: string;
  statusCode: number;

  constructor(data: D | D[], message: string, statusCode: number) {
    this.data = data;
    this.message = message;
    this.statusCode = statusCode;

    return this;
  }
}
