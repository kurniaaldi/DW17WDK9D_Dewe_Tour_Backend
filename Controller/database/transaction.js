const { Trip, Transaction, Country, user } = require('../../models');
const joi = require('@hapi/joi')

exports.readTransaction = async (req, res) => {
  try {
    const allTransaction = await Transaction.findAll({
      include: [
        {
          model: user,
          as: "user",
          attributes: {
            exclude: ["createdAt", "role", "address", "password", "updatedAt"]
          }
        },
        {
          model: Trip,
          as: 'trip',
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },

          include: {
            model: Country,
            as: "country",
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
          }, attributes: {
            exclude: ["countryId", "updatedAt", "createdAt", "CountryId"],
          },
        }],
      attributes: {
        exclude: ["tripId", "updatedAt", "userId", "TripId"],
      },

    })
    res.status(200).send({
      message: "response sucess",
      data: {
        allTransaction,
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

exports.oneTransaction = async (req, res) => {
  try {
    const { id } = req.params
    const oneOrder = await Transaction.findOne({
      where: {
        id
      },
      include: [
        {
          model: user,
          as: "user",
          attributes: {
            exclude: ["createdAt", "role", "address", "password", "updatedAt"]
          }
        },
        {
          model: Trip,
          as: 'trip',
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },

          include: {
            model: Country,
            as: "country",
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
          }, attributes: {
            exclude: ["countryId", "updatedAt", "createdAt", "CountryId"],
          },
        }],
      attributes: {
        exclude: ["tripId", "updatedAt", "userId", "TripId"],
      },
    });



    res.status(200).send({
      message: "Response Success",
      data: {
        oneOrder,
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

exports.newTransaction = async (req, res) => {
  try {
    const {
      counterQty,
      total,
      status,
      tripId,
      userId
    } = req.body

    const schema = joi.object({
      counterQty: joi.number().required(),
      total: joi.number().required(),
      status: joi.string().required(),
      tripId: joi.number().required(),
      userId: joi.number().required()

    })

    const { error } = schema.validate(req.body)
    if (error) {
      return res.status(400).send({
        error: {
          message: error.details[0].message,
        },
      });
    }

    const checkTrip = await Trip.findOne({
      where: {
        id: tripId
      }
    })

    if (!checkTrip) {
      return res.status(400).send({
        error: {
          message: "Trip Not Found"
        }
      })
    }

    const checkCountry = await Country.findOne({
      where: {
        id: checkTrip.countryId
      }
    })

    if (!checkCountry) {
      return res.status(400).send({
        error: {
          message: "Country Not Found"
        }
      })
    }

    const createTransaction = await Transaction.create({
      counterQty,
      total,
      status,
      tripId,
      userId
    })

    res.status(200).send({
      message: "Transaction Has Been Create",
      data: {
        id: createTransaction.id,
        counterQty: createTransaction.counterQty,
        total: createTransaction.total,
        status: createTransaction.status,
        trip: {
          id: checkTrip.id,
          title: checkTrip.title,
          country: {
            id: checkCountry.id,
            name: checkCountry.name
          },
          accomodation: checkTrip.accomodation,
          transportation: checkTrip.transportation,
          eat: checkTrip.eat,
          day: checkTrip.day,
          night: checkTrip.night,
          dateTrip: checkTrip.dateTrip,
          price: checkTrip.price,
          quota: checkTrip.quota,
          description: checkTrip.description,
          image: checkTrip.image
        },
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


exports.updateTransaction = async (req, res) => {
  try {
    const { id } = req.params
    const { status, } = req.body

    const { proof } = req.files
    const imageProof = proof.name
    await proof.mv(`./images/${imageProof}`);

    const schema = joi.object({
      status: joi.string().required(),
    })

    const { error } = schema.validate(req.body)
    if (error) {
      return res.status(400).send({
        error: {
          message: error.details[0].message,
        },
      });
    }

    const checkTransaction = await Transaction.findOne({
      where: {
        id
      }
    })

    if (!checkTransaction) {
      return res.status(400).send({
        error: {
          message: "Transaction Not Found"
        }
      })
    }

    const checkTrip = await Trip.findOne({
      where: {
        id: checkTransaction.tripId
      }
    })

    if (!checkTrip) {
      return res.status(400).send({
        error: {
          message: "Trip Not Found"
        }
      })
    }

    const checkCountry = await Country.findOne({
      where: {
        id: checkTrip.countryId
      }
    })

    if (!checkCountry) {
      return res.status(400).send({
        error: {
          message: "Country Not Found"
        }
      })
    }

    const accTransaction = await Transaction.update({
      status,
      attachment: imageProof
    }, {
      where: { id }
    })

    res.status(200).send({
      message: "Transaction Has Been Create",
      data: {
        id: checkTransaction.id,
        counterQty: checkTransaction.counterQty,
        total: checkTransaction.total,
        status: status,
        attachment: checkTransaction.attachment,
        trip: {
          id: checkTrip.id,
          title: checkTrip.title,
          country: {
            id: checkCountry.id,
            name: checkCountry.name
          },
          accomodation: checkTrip.accomodation,
          transportation: checkTrip.transportation,
          eat: checkTrip.eat,
          day: checkTrip.day,
          night: checkTrip.night,
          dateTrip: checkTrip.dateTrip,
          price: checkTrip.price,
          quota: checkTrip.quota,
          description: checkTrip.description,
          image: checkTrip.image
        },
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

exports.approveTrip = async (req, res) => {
  try {
    const { id } = req.params
    const { status, } = req.body

    const schema = joi.object({
      status: joi.string().required(),
    })

    const { error } = schema.validate(req.body)
    if (error) {
      return res.status(400).send({
        error: {
          message: error.details[0].message,
        },
      });
    }

    const checkTransaction = await Transaction.findOne({
      where: {
        id
      }
    })

    if (!checkTransaction) {
      return res.status(400).send({
        error: {
          message: "Transaction Not Found"
        }
      })
    }

    const checkTrip = await Trip.findOne({
      where: {
        id: checkTransaction.tripId
      }
    })

    if (!checkTrip) {
      return res.status(400).send({
        error: {
          message: "Trip Not Found"
        }
      })
    }

    const checkCountry = await Country.findOne({
      where: {
        id: checkTrip.countryId
      }
    })

    if (!checkCountry) {
      return res.status(400).send({
        error: {
          message: "Country Not Found"
        }
      })
    }

    const accTransaction = await Transaction.update({
      status,
    }, {
      where: { id }
    })

    res.status(200).send({
      message: "Transaction Has Been Create",
      data: {
        id: checkTransaction.id,
        counterQty: checkTransaction.counterQty,
        total: checkTransaction.total,
        status: status,
        attachment: checkTransaction.attachment,
        trip: {
          id: checkTrip.id,
          title: checkTrip.title,
          country: {
            id: checkCountry.id,
            name: checkCountry.name
          },
          accomodation: checkTrip.accomodation,
          transportation: checkTrip.transportation,
          eat: checkTrip.eat,
          day: checkTrip.day,
          night: checkTrip.night,
          dateTrip: checkTrip.dateTrip,
          price: checkTrip.price,
          quota: checkTrip.quota,
          description: checkTrip.description,
          image: checkTrip.image
        },
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