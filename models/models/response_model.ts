function responseModel(response: ResponseInterface): Object {
    return {
        "status": response.status,
        "message": response.message,
        ...(response.data != null ? { "data": response.data } : {})
    };
}

export default responseModel;