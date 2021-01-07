const jwt = require('jsonwebtoken')

exports.authenticated = (req, res, next) => {
    let header, token;

    if (
        !(header = req.header('Authorization')) ||
        !(token = header.replace("Bearer ", ""))
    )
        return res.status(200).send({
            error: {
                message: "Access Danied",
            },
        })

    try {
        const secretKey = "dumbways17"

        const verified = jwt.verify(token, secretKey)
        req.user = verified;
        next()
    } catch (err) {
        console.log(err);
        res.status(400).send({
            error: {
                message: "Invalid token",
            },
        });
    }
}