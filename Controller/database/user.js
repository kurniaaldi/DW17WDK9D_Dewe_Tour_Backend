const { user } = require('../../models')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const joi = require('@hapi/joi')
const { use } = require('../../Routes/routeV1')

exports.register = async (req, res) => {
    try {
        const { fullName, email, password, phone, address, role } = req.body

        const schema = joi.object({
            fullName: joi.string().min(3).required(),
            email: joi.string().email().min(10).required(),
            password: joi.string().min(8).required(),
            phone: joi.number().required(),
            address: joi.string().required()
        })

        const { error } = schema.validate(req.body)

        if (error) {
            return res.status(400).send({
                error: {
                    message: error.details[0].message,
                },
            });
        }

        const checkMail = await user.findOne({
            where: {
                email,
            }
        })

        if (checkMail) {
            return res.status(400).send({
                error: {
                    message: "email already existed"
                }
            })
        }

        const saltRound = 10
        const hashPassword = await bcrypt.hash(password, saltRound)

        const createUser = await user.create({
            fullName,
            email,
            password: hashPassword,
            phone,
            address,
            role: false
        })

        const secretKey = "dumbways17"
        const token = jwt.sign({
            id: createUser.id
        }, secretKey)
        res.status(200).send({
            message: "register Success",
            data: {
                id: createUser.id,
                fullName: createUser.fullName,
                email: createUser.email,
                role: createUser.role,
                phone: createUser.phone,
                address: createUser.address,
                token
            },
        });
    } catch (err) {
        console.log(err);
        res.status(500).send({
            error: {
                message: "Server ERROR",
            },
        });
    }
}


exports.login = async (req, res) => {
    try {
        const { email, password } = req.body
        const schema = joi.object({
            email: joi.string().email().min(10).required(),
            password: joi.string().min(8).required()
        })

        const { error } = schema.validate(req.body)

        if (error) {
            return res.status(400).send({
                error: {
                    message: error.details[0].message,
                },
            });
        }

        const checkMe = await user.findOne({
            where: {
                email
            }
        })

        if (!checkMe) {
            console.log(err)
            res.status(400).send({
                error: {
                    message: "Email and Password Not Match"
                }
            })
        }

        const validPass = await bcrypt.compare(password, checkMe.password)
        if (!validPass) return res.status(400).send({
            error: {
                message: "Email and Password Not Match"
            }
        })

        const secretKey = "dumbways17"
        const token = jwt.sign({
            id: checkMe.id
        }, secretKey)

        res.status(200).send({
            message: "Login Success",
            data: {
                id: checkMe.id,
                fullName: checkMe.fullName,
                email: checkMe.email,
                role: checkMe.role,
                phone: checkMe.phone,
                address: checkMe.address,
                token
            }
        })

    } catch (err) {
        console.log(err)
        res.status(400).send({
            error: {
                message: "Server Error"
            }
        })
    }
}


exports.read = async (req, res) => {
    try {
        const allUser = await user.findAll({
            attributes: {
                exclude: ['password', 'createdAt', 'updatedAt']
            }
        })
        res.status(200).send({
            message: "response Success",
            data: { allUser },
        });
    } catch (err) {
        console.log(err);
        res.status(500).send({
            error: {
                message: "Server ERROR",
            },
        });
    }
}


exports.readOne = async (req, res) => {
    try {
        const { id } = req.params;
        const detailUser = await user.findOne({
            where: {
                id: id,
            },
        });


        if (!detailUser)
            return res.status(400).send({
                message: `todo with id: ${id} is not existed`,
            });

        res.status(200).send({
            message: "response Success",
            data: {

                fullName: detailUser.fullName,
                email: detailUser.email,
                phone: detailUser.phone,
                address: detailUser.address,
                foto: detailUser.foto
            },
        });
    } catch (err) {
        console.log(err);
        res.status(500).send({
            error: {
                message: "Server ERROR",
            },
        });
    }
}


exports.destroyUser = async (req, res) => {
    try {
        const { id } = req.params

        const checkUser = await user.findOne({
            where: {
                id: id
            }
        })

        if (!checkUser) {
            return res.status(400).send({
                error: {
                    message: 'User Not Found',
                }
            })
        }

        const deleteCountry = await user.destroy({
            where: {
                id
            }
        })

        res.status(200).send({
            message: "User has been destroy",
            data: {
                id
            },
        });

    } catch (err) {
        console.log(err);
        res.status(500).send({
            error: {
                message: "Server ERRORs",
            },
        });
    }
}

exports.updateProfile = async (req, res) => {
    try {
        const { id } = req.params
        const { fotoProfile } = req.files
        const imageTrip = fotoProfile.name
        await fotoProfile.mv(`./images/${imageTrip}`);

        const UploadFoto = await user.update(
            {
                foto: imageTrip
            },
            {
                where: {
                    id
                }
            })

        res.status(200).send({
            message: "response Success",
            data: {
                UploadFoto
            }
        });

    } catch (err) {
        console.log(err);
        res.status(500).send({
            error: {
                message: "Server ERROR",
            },
        });
    }
}
