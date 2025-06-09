exports.error = (error, req, res, next) => {
    res.status(error.statusCode || 500).json({msg: error.message})
}