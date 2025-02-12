export class errorHandler extends Error{
  constructor(error,statusCode,message){
    super(message)

    this.error = error
    this.statusCode = statusCode
  }
}
