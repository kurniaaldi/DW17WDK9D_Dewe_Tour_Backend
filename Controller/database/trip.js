const { Trip, Country, Transaction } = require('../../models');
const joi = require('@hapi/joi');
const transaction = require('../../models/transaction');

exports.readTrip = async (req, res) => {
  try {
    const trips = await Trip.findAll({
      include: [
        {
          model: Country,
          as: "country",
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          }
        }, {
          model: Transaction,
          as: "transaction",
          attributes: {
            exclude: ["tripId", "updatedAt", "createdAt", "TripId", "attachment"],
          }
        }
      ],
      attributes: {
        exclude: ["countryId", "updatedAt", "createdAt", "CountryId"],
      },

    });

    res.status(200).send({
      message: "response sucess",
      data: {
        trips,
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
};

exports.oneTrip = async (req, res) => {
  try {
    const { id } = req.params;
    const trip = await Trip.findOne({
      where: {
        id: id,
      }, include: [{
        model: Country,
        as: "country",
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      }, {
        model: Transaction,
        as: "transaction",
        attributes: {
          exclude: ["tripId", "updatedAt", "createdAt", "TripId", "attachment"],
        }
      }],
      attributes: {
        exclude: ["countryId", "updatedAt", "createdAt", "CountryId"],
      },
    });

    if (!trip)
      return res.status(400).send({
        message: `trip with id: ${id} is not existed`,
      });

    res.status(200).send({
      message: "response Success",
      data: {
        trip,
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

exports.destroyTrip = async (req, res) => {
  try {
    const { id } = req.params;
    const popTrip = await Trip.destroy({
      where: {
        id
      },
    })

    if (!popTrip)
      return res.status(400).send({
        message: `trip with id: ${id} is not existed`,
      });

    res.status(200).send({
      message: `Trip with ${id} has been destroy`,
      data: {
        id: popTrip.id,
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

exports.createTrip = async (req, res) => {
  try {
    const {
      title,
      countryId,
      accomodation,
      transportation,
      eat,
      day,
      night,
      dateTrip,
      price,
      quota,
      description,
    } = req.body

    const { images } = req.files
    const imageTrip = images.name
    await images.mv(`./images/${imageTrip}`);

    const schema = joi.object({
      title: joi.string().required(),
      countryId: joi.number().required(),
      accomodation: joi.string().required(),
      transportation: joi.string().required(),
      eat: joi.string().required(),
      day: joi.number().required(),
      night: joi.number().required(),
      dateTrip: joi.date().required(),
      price: joi.number().required(),
      quota: joi.number().required(),
      description: joi.string().required(),
    })

    const { error } = schema.validate(req.body)

    if (error) {
      return res.status(400).send({
        error: {
          message: error.details[0].message,
        },
      });
    }

    const checkCountry = await Country.findOne({
      where: {
        id: countryId
      }
    })
    if (!checkCountry) {
      return res.status(400).send({
        error: {
          message: "Country Not Found"
        }
      })
    }

    const createTrip = await Trip.create({
      title,
      countryId,
      accomodation,
      transportation,
      eat,
      day,
      night,
      dateTrip,
      price,
      quota,
      description,
      image: imageTrip
    })

    res.status(200).send({
      message: "response Success",
      data: {
        title: createTrip.title,
        country: {
          id: checkCountry.id,
          name: checkCountry.name
        },
        accomodation: createTrip.accomodation,
        transportation: createTrip.transportation,
        eat: createTrip.eat,
        day: createTrip.day,
        night: createTrip.night,
        dateTrip: createTrip.dateTrip,
        price: createTrip.price,
        quota: createTrip.quota,
        description: createTrip.description,
        image: createTrip.image
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

exports.patchTrip = async (req, res) => {
  try {
    const { id } = req.params
    const {
      title,
      countryId,
      accomodation,
      transportation,
      eat,
      day,
      night,
      dateTrip,
      price,
      quota,
      description,
      image
    } = req.body

    const schema = joi.object({
      title: joi.string().required(),
      countryId: joi.number().required(),
      accomodation: joi.string().required(),
      transportation: joi.string().required(),
      eat: joi.string().required(),
      day: joi.number().required(),
      night: joi.number().required(),
      dateTrip: joi.date().required(),
      price: joi.number().required(),
      quota: joi.number().required(),
      description: joi.string().required(),
      image: joi.string().required()
    })

    const { error } = schema.validate(req.body)

    if (error) {
      return res.status(400).send({
        error: {
          message: error.details[0].message,
        },
      });
    }

    const checkCountry = await Country.findOne({
      where: {
        id: countryId
      }
    })
    if (!checkCountry) {
      return res.status(400).send({
        error: {
          message: "Country Not Found"
        }
      })
    }

    const checkIdParams = await Trip.findOne({
      where: {
        id
      }
    })
    if (!checkIdParams) {
      return res.status(400).send({
        error: {
          message: "Trip Not Found"
        }
      })
    }

    const updateTrip = await Trip.update({
      title,
      countryId,
      accomodation,
      transportation,
      eat,
      day,
      night,
      dateTrip,
      price,
      quota,
      description,
      image
    }, {
      where: { id }
    })

    res.status(200).send({
      message: "response Success",
      data: {
        title: title,
        country: {
          id: checkCountry.id,
          name: checkCountry.name
        },
        accomodation: accomodation,
        transportation: transportation,
        eat: eat,
        day: day,
        night: night,
        dateTrip: dateTrip,
        price: price,
        quota: quota,
        description: description,
        image: image
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
