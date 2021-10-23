const Joi = require("joi");

class VacationModel{
    constructor(vacation){
        this.id = vacation.id;
        this.uuid = vacation.uuid;
        this.destination = vacation.destination;
        this.description = vacation.description;
        this.price = vacation.price;
        this.followers = vacation.followersCount;
        this.vacationStart = vacation.vacationStart;
        this.vacationEnd = vacation.vacationEnd;
        this.imageName = vacation.imageName;
    }

      static #postValidationSchema = Joi.object({
        id: Joi.forbidden(),
        uuid:Joi.string().required(),
        followers: Joi.forbidden(),
        destination: Joi.string().required().min(2).max(100),
        description: Joi.string().required().min(2).max(200),
        vacationStart: Joi.date().required(),
        vacationEnd: Joi.date().required(),
        price: Joi.number().required().min(0).max(10000),
        imageName:Joi.string().optional()
    });

    static #putValidationSchema = Joi.object({
        id:Joi.number().optional().integer(),
        uuid:Joi.string().required(),
        followers: Joi.number().optional().positive().integer(),
        destination: Joi.string().required().min(2).max(100),
        description: Joi.string().required().min(2).max(200),
        vacationStart: Joi.date().required(),
        vacationEnd: Joi.date().required(),
        price: Joi.number().required().min(0).max(10000),
        imageName:Joi.string().optional()

    });

    validatePost() {
        const result = VacationModel.#postValidationSchema.validate(this, { abortEarly: false }); 
        return result.error ? result.error.message : null; // null = no errors.
    }

    validatePut() {
        const result = VacationModel.#putValidationSchema.validate(this, { abortEarly: false }); 
        return result.error ? result.error.message : null; 
    }


}

module.exports = VacationModel;