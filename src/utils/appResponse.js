class AppResponse {
  constructor(status, message, data = null) {
    this.status = status;
    this.message = message;
    this.data = data;
  }
}

export default AppResponse;
