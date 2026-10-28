export class HttpResponse {
    static success(res, status = 200, message, data) {
        return res.status(status).json({
            type: 'Success',
            message,
            data
        });
    }
    static warning(res, status = 400, message, error) {
        return res.status(status).json({
            type: 'Warning',
            message,
            error
        });
    }
}
//# sourceMappingURL=httpResponse.js.map