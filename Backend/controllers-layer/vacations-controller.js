const express = require("express");
const uuid = require("uuid");
const fs = require("fs");
const path = require("path");
const logic = require("../business-logic-layer/vacations-logic");
const errorsHelper = require("../helpers/errors-helper");
const verifyLoggedIn = require("../middleware/verify-logged-in");
const verifyAdmin = require("../middleware/verify-admin");
const VacationModel = require("../models/VacationModel");
const router = express.Router();

//get all vacations ordered by the user followed vacations
//http://localhost:3001/api/vacations/:uuid
router.get("/:uuid", verifyLoggedIn, async (request, response) => {
    try {
        const vacations = await logic.getAllVacationsAsync(request.params.uuid);
        response.json(vacations);
    }
    catch (err) {
        response.status(500).send(errorsHelper.getError(err));
    }
});

//get one vacation
//http://localhost:3001/api/vacations/select/:uuid
router.get("/select/:uuid", verifyLoggedIn, async (request, response) => {
    try {
        const vacation = await logic.getVacationAsync(request.params.uuid);
        response.json(vacation);
    }
    catch (err) {
        response.status(500).send(errorsHelper.getError(err));
    }
});

//add new vacation
//http://localhost:3001/api/vacations
router.post("/", [verifyLoggedIn, verifyAdmin], async (request, response) => {
    try {

        const vacation = new VacationModel(request.body);

        // Extract the image file from the request:
        const image = request.files && request.files.image ? request.files.image : null;
        if (!image) return response.status(400).send("Missing image.");

        vacation.uuid = uuid.v4();

        const errors = vacation.validatePost();

        if (errors) {
            return response.status(400).send(errors);
        }

        const addedVacation = await logic.addVacationAsync(vacation, image);//add image args

        response.status(201).json(addedVacation);
    }
    catch (err) {
        response.status(500).send(errorsHelper.getError(err));
    }
});

//update vacation
//http://localhost:3001/api/vacations/:uuid
router.put("/:uuid", [verifyLoggedIn, verifyAdmin], async (request, response) => {
    try {
        const uuid = request.params.uuid;
        const vacation = new VacationModel(request.body);
        vacation.uuid = uuid;
        const errors = vacation.validatePut();
        if (errors) return response.status(400).send(errors);

        // Extract the image file from the request:
        const image = request.files && request.files.image ? request.files.image : null;

        const updatedVacation = await logic.updateVacationAsync(vacation, image);

        response.json(updatedVacation);
    }
    catch (err) {
        response.status(500).send(errorsHelper.getError(err));

    }
});

//http://localhost:3001/api/vacations/:uuid
router.delete("/:uuid", [verifyLoggedIn, verifyAdmin], async (request, response) => {
    try {
        const uuid = request.params.uuid;
        await logic.deleteVacationAsync(uuid);
        response.sendStatus(204);
    }
    catch (err) {
        response.status(500).send(errorsHelper.getError(err));
    }
});

//get an image by name param
//http://localhost:3001/api/vacations/images/:name
router.get("/images/:name", (request, response) => {
    try {
        const name = request.params.name;
        let absolutePath = path.join(__dirname, "..", "assets", "images", "vacations", name);
        if (!fs.existsSync(absolutePath)) {
            absolutePath = path.join(__dirname, "..", "assets", "images", "not-found.jpg");
        }
        response.sendFile(absolutePath);
    }
    catch (err) {
        response.status(500).send(errorsHelper.getError(err));
    }
});

//follow/unfollow a vacation
//http://localhost:3001/api/vacations/followers/:uuid
router.post("/follow/:uuid", verifyLoggedIn, async (request, response) => {
    try {
        const vacationUuid = request.params.uuid;
        const status = await logic.followUnfollowVacationAsync(request.body.uuid, vacationUuid);
        
        response.status(200).send(status);
    }
    catch (err) {
        response.status(500).send(errorsHelper.getError(err));
    }
});

router.get("/check-follower/:uuid", async (request, response) => {
    try {
        const userUuid = request.params.uuid;
        const answer = await logic.checkFollowerAsync(userUuid);
        response.header("Access-Control-Allow-Origin","*");
        response.json(answer);
    }
    catch (err) {
        response.status(500).send(errorsHelper.getError(err));
    }

});


module.exports = router;