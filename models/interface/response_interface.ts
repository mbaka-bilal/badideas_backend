interface ResponseInterface {
    status: boolean,
    message: string,
    data?: { [key: string]: any } | null
}