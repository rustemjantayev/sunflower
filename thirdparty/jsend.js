function jsendError(data="", message=""){
    return {
        status: "error",
        data: data,
        message: message
    }
}

function jsendSuccess(data="", message=""){
    return {
        status: "success",
        data: data,
        message: message
    }
}

module.exports.jsendError = jsendError;
module.exports.jsendSuccess = jsendSuccess;