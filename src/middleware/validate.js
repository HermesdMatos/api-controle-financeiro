const schema = joiSchema => async (req, res, next) => {
    try {
        await joiSchema.validateAsync(req.body);
        return next();
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

module.exports = {
    schema
}

