const launchesDB = require("./launches.mongo");
const planets = require("./planets.mongo");


let DEFAULT_FLIGHT_NUMBER = 100;

const launch = {
    flightNumber : 100,
    mission : "Kepler Exploration X",
    rocket : "Explorer IS1",
    launchDate: new Date("December 28, 2030"),
    target : "Kepler-442 b",
    customers : ["ZTM","NASA"],
    upcoming : true,
    success: true,
};

saveLaunch(launch);
// launches.set(launch.flightNumber,launch);

function getAllLaunches()
{
    return launchesDB.find({},{
        '_id':0,
        '__v':0,
    });
}


async function existsLaunchWithId(launchId)
{
    return await launchesDB.findOne({
        flightNumber:launchId,
    });
}

async function getLatestFlightNumber()
{
    const latestFlightNumber = await launchesDB
    .findOne({})
    .sort('-flightNumber');
    if(!latestFlightNumber)
    {
        return DEFAULT_FLIGHT_NUMBER;
    }

    return latestFlightNumber.flightNumber;
}


async function saveLaunch(launch)
{
    const planet = await planets.findOne({
        keplerName:launch.target,
    });
    if(!planet)
    {
        throw new Error("No matching planet found!");
    }
    else
    {
        await launchesDB.findOneAndUpdate({
            flightNumber:launch.flightNumber,
        },launch,{
            upsert:true,
        });
    }
    
}


async function scheduleNewLaunch(launch)
{
    const newFligthNumber = await getLatestFlightNumber() + 1;
    const newLaunch = Object.assign(launch,{
        success : true,
        upcoming : true,
        customers : ["RaddSoft Technology", "NASA"],
        flightNumber: newFligthNumber,
    });

    await saveLaunch(newLaunch);
}

async function abortLaunchById(launchId)
{
    const aborted = await launchesDB.updateOne({
        flightNumber:launchId,
    },{
        upcoming:false,
        success:false,
    });

    return aborted.acknowledged === true && aborted.modifiedCount === 1;
}


module.exports = {
    getAllLaunches,
    scheduleNewLaunch,
    existsLaunchWithId,
    abortLaunchById,
};