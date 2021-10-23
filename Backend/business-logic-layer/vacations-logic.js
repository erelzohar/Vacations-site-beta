const dal = require("../data-access-layer/dal");
const path = require("path");
const filesHelper = require("../helpers/files-helper");
const uuid = require("uuid");


async function getAllVacationsAsync(uuid) {

    //order by followed vacation
    const userId = await dal.executeAsync(`SELECT id FROM users WHERE uuid = '${uuid}'`);
    const followersInfo = await dal.executeAsync(`SELECT * FROM followers WHERE userId = ${userId[0].id}`);
    const sql = `SELECT uuid , destination , description , vacationStart,
    vacationEnd, price,followersCount as followers,imageName FROM vacations ${followersInfo.length > 0 ? "ORDER BY " +  "vacations.id IN (" + followersInfo.map(f => f.vacationId).toString() + ") DESC" : ""}`;
    const vacations = await dal.executeAsync(sql);
    return vacations;
}

async function getVacationAsync(uuid) {
    const sql = `SELECT uuid , destination , description , vacationStart,
    vacationEnd, price,followersCount as followers,imageName FROM vacations WHERE uuid = '${uuid}'`;
    const vacation = await dal.executeAsync(sql);
    return vacation;

}

async function addVacationAsync(vacation, image) {

    vacation.uuid = uuid.v4();

    // // Save the image to the disk
    const extension = image.name.substr(image.name.lastIndexOf("."));
    vacation.imageName = vacation.uuid + extension;
    const absolutePath = path.join(__dirname, "..", "assets", "images", "vacations", vacation.imageName);
    await image.mv(absolutePath);

    const sql = `INSERT INTO vacations(uuid,destination, description, price,vacationStart,vacationEnd,imageName)
                 VALUES(?,?,?,?,?,?,?)`;
    const info = await dal.executeAsync(sql,
        [vacation.uuid, vacation.destination, vacation.description, vacation.price, vacation.vacationStart, vacation.vacationEnd, vacation.imageName]);

    vacation.id = info.insertId;

    return vacation;
}


async function updateVacationAsync(vacation, image) {
    const sql = `UPDATE vacations SET
                 destination = '${vacation.destination}',
                 description = '${vacation.description}',
                 price = ${vacation.price},
                 vacationStart = '${vacation.vacationStart}',
                 vacationEnd = '${vacation.vacationEnd}'
                 WHERE uuid = '${vacation.uuid}'`;

    const info = await dal.executeAsync(sql);

    // Save image if exists
    if (image) {
        const extension = image.name.substr(image.name.lastIndexOf("."));
        const fileName = vacation.uuid + extension;
        vacation.imageName = fileName;
        const absolutePath = path.join(__dirname, "..", "assets", "images", "vacations", fileName);
        await image.mv(absolutePath);
    }

    return vacation;
}

async function deleteVacationAsync(uuid) {
    const sql = `DELETE FROM vacations WHERE uuid = '${uuid}'`;
    await dal.executeAsync(sql);
    const fileName = uuid + ".jpg";
    const absolutePath = path.join(__dirname, "..", "assets", "images", "vacations", fileName);
    filesHelper.safeDelete(absolutePath);
}

async function followUnfollowVacationAsync(userUuid, vacationUuid) {

    let userId = await dal.executeAsync(`SELECT id FROM users WHERE uuid = '${userUuid}'`);
    let vacationId = await dal.executeAsync(`SELECT id FROM vacations WHERE uuid = '${vacationUuid}'`);

    userId = userId[0].id;
    vacationId = vacationId[0].id;

    //check if the user is following the vacation
    const checkSql = `SELECT * FROM followers WHERE userId = ${userId} AND vacationId = ${vacationId}`;
    const response = await dal.executeAsync(checkSql);

    if (response.length === 0) {
        const sql = `INSERT INTO followers VALUES(${vacationId},${userId});
        UPDATE vacations SET followersCount = followersCount + 1 WHERE id = ${vacationId}`;
        await dal.executeAsync(sql);
        return "Followed!";
    }

    const sql = `DELETE FROM followers WHERE userId = ${userId} AND vacationId = ${vacationId};
    UPDATE vacations SET followersCount = followersCount - 1 WHERE id = ${vacationId}`;
    await dal.executeAsync(sql);
    return "Unfollowed!";

}

async function checkFollowerAsync(userUuid) {

    let userId = await dal.executeAsync(`SELECT id FROM users WHERE uuid = '${userUuid}'`);
    userId = userId[0].id;

    //check witch vacations the user is following
    const checkSql = `SELECT vacationId FROM followers WHERE userId = ${userId}`;
    const response = await dal.executeAsync(checkSql);
    const idArr = response.map(o => o.vacationId);
    let vacationsUuid = [];
    if (idArr.length > 0) {
        vacationsUuid = await dal.executeAsync(`SELECT uuid FROM vacations WHERE id IN (${idArr.map(e => e)})`);
    }
    return vacationsUuid;
}



module.exports = {
    getAllVacationsAsync,
    addVacationAsync,
    updateVacationAsync,
    deleteVacationAsync,
    followUnfollowVacationAsync,
    getVacationAsync,
    checkFollowerAsync
}