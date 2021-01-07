const { Country } = require('../../models');
const joi = require('@hapi/joi');



exports.readCountry = async (req, res) => {
    try {
        const allCountry = await Country.findAll({
            attributes: {
                exclude: ["createdAt", "updatedAt"],
            }
        })
        res.status(200).send({
            message: "response Success",
            data: { allCountry },
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

exports.oneCountry = async (req, res) => {
    try {
        const { id } = req.params;
        const country = await Country.findOne({
            where: {
                id: id,
            },
            attributes: {
                exclude: ["createdAt", "updatedAt"],
            }
        });

        if (!country)
            return res.status(400).send({
                message: `todo with id: ${id} is not existed`,
            });

        res.status(200).send({
            message: "response Success",
            data: {
                country,
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


exports.addCountry = async (req, res) => {
    try {
        const { name } = req.body

        const schema = joi.object({
            name: joi.string().required()
        })

        const { error } = schema.validate(req.body)

        if (error) return res.status(400).send({
            error: {
                message: error.details[0].message,
            }
        })

        const checkCountry = await Country.findOne({
            where: { name }
        })

        if (checkCountry) return res.status(400).send({
            error: {
                message: 'Country Already Existed',
            }
        })

        const createCountry = await Country.create({ name })
        res.status(200).send({
            message: "Create Country Success",
            data: {
                id: createCountry.id,
                country: createCountry.name
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

exports.editCountry = async (req, res) => {
    try {
        const { id } = req.params
        const { name } = req.body

        const schema = joi.object({
            name: joi.string().required()
        })

        const { error } = schema.validate(req.body)

        if (error) return res.status(400).send({
            error: {
                message: error.details[0].message,
            }
        })

        const checkCountry = await Country.findOne({
            where: { name }
        })

        if (checkCountry) return res.status(400).send({
            error: {
                message: 'Country Already Existed',
            }
        })

        const editCountry = await Country.update({
            name
        }, {
            where: { id }
        })

        res.status(200).send({
            error: {
                message: `Data with id ${id} success to updated to ${name}`
            }
        })
    } catch (err) {
        console.log(err);
        res.status(500).send({
            error: {
                message: "Server ERROR",
            },
        });
    }
}

exports.destroyCountry = async (req, res) => {
    try {
        const { id } = req.params

        const checkCountry = await Country.findOne({
            where: {
                id: id
            }
        })

        if (!checkCountry) {
            return res.status(400).send({
                error: {
                    message: 'Country Not Found',
                }
            })
        }

        const deleteCountry = await Country.destroy({
            where: {
                id
            }
        })

        res.status(200).send({
            message: "Country has been destroy",
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









