function successResponse(message, data = null) {
  return { success: true, message, data };
}

function errorResponse(message, details = null) {
  return { success: false, message, details };
}

module.exports = { successResponse, errorResponse };
