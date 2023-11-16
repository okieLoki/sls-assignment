const handleError = (error) => {
    return {
        statusCode: error.statusCode || 500,
        body: error.message || 'Internal server error'
    }
}

module.exports = handleError;