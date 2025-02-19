const LOG = cds.log('KupitO2PSrv');
const connectivity = require('@sap-cloud-sdk/connectivity');
const client = require('@sap-cloud-sdk/http-client');
const axios = require('axios')
const moment = require('moment');

const { getEnvParam } = require('./Utils');
const cronParser = require('cron-parser');


async function _getDestination() {
    let dest = await connectivity.getDestination({ destinationName: "job-scheduler" });
    return dest;
}

async function scheduleRun(iRequest) {

    let oJobRunHeaderNew = {}

    let oResult = {
        MTYPE: '',
        TEXT: ''
    }


    try {

        let oInput = iRequest.data.INPUT

   

        var schDay = oInput.CREATION_DATE
        var schTime = oInput.CREATION_TIME.split(':')
        var schWeek = oInput.CREATION_WEEK
        var schPer = oInput.REPETITION_PERIOD


        var cron = ''
        var cron2 = ''


        var day = parseInt(schDay.substr(6, 2)) + 1;
        var hour = parseInt(schTime[0]);
        var minute = parseInt(schTime[1]);
        var second = parseInt(schTime[2]);

        if (schPer === 0) { // giorno
            cron = '* * * * ' + hour + ' ' + schTime[1] + ' 00';
            cron2 = '00 ' + schTime[1] + ' ' + hour + ' * * *';
        }
        if (schPer === 1) { // settimana
            cron = '* * * ' + schWeek + ' ' + hour + ' ' + schTime[1] + ' 00';
            cron2 = '00 ' + schTime[1] + ' ' + hour + ' * * ' + schWeek;
        }
        if (schPer === 2) { // mese
            cron = schDay.substr(0, 4) + ' * ' + day + ' * ' + hour + ' ' + schTime[1] + ' 00';
            cron2 = '00 ' + schTime[1] + ' ' + hour + ' ' + day + ' * *';
        }


        if (schPer === 3) { // minuto
            cron = '* * * * * ' + minute + ' 00';
            cron2 = '00 ' + minute + ' * * * *';
        }


        if (schPer === 4) { // secondo
            cron = '* * * * * * 00 ' + second;
            cron2 = second + ' 00 * * * * *';
        }



        var sD = iRequest.timestamp.getDate().toString().length === 2 ? iRequest.timestamp.getDate() : '0' + iRequest.timestamp.getDate();
        var sH = iRequest.timestamp.getHours().toString().length === 2 ? iRequest.timestamp.getHours() : '0' + iRequest.timestamp.getHours();

        var sM = iRequest.timestamp.getMonth() + 1;
        var sMl = sM.length === 2 ? sM : '0' + sM;
        var sm = iRequest.timestamp.getMinutes().toString().length === 2 ? iRequest.timestamp.getMinutes() : '0' + iRequest.timestamp.getMinutes();
        var d = iRequest.timestamp.getFullYear() + '-' + sMl + '-' + sD + ' ' + sH + ':' + sm + ' +0000';


        let jobManagerUrl = getEnvParam("JobManagerSrv_URL", false);


        let runId = 1
        let oJobRunHeader = await SELECT.one.from(JobRunHeader).columns(["max(RUN_ID) as maxId"])
            .where({ ENTITY: oInput.ENTITY, STATUS: 'C' })
        if (Boolean(oJobRunHeader.maxId)) {
            runId = oJobRunHeader.maxId + 1
        }


        // let runId = Number(moment(new Date).format('YYYYMMDDhhmmss'))

        let nameJob = oInput.PREFIX_JOB_NAME + ' ' + oInput.ENTITY + ' ' + runId
        let nameJobDesc = oInput.PREFIX_JOB_NAME + ' ' + oInput.ENTITY

        var schedule = cronParser.parseExpression(cron2);


        oJobRunHeaderNew = {
            "ENTITY": oInput.ENTITY,
            "JOB_NAME": nameJob,
            "RUN_ID": runId,
            "SCHEDULED_AT": schedule.next().toString(),
            "STATUS_JOB": 'Scheduled',
            "STATUS": ""
        }


        let oInsert = await INSERT(oJobRunHeaderNew).into(JobRunHeader)

        let oBody = { INPUT: oInput, CRON: cron2, HEADER_ID: oJobRunHeaderNew.ID }


        var data = {
            "name": nameJob,
            "description": nameJobDesc,
            "action": jobManagerUrl + "/odata/v2/job-scheduler/callService",
            "active": true,
            "httpMethod": "POST",
            "ansConfig": {
                "onError": false,
                "onSuccess": false
            },
            "schedules": [
                {
                   // "cron": cron,
                   "cron" : "* * * * * */05 0",
                    "description": nameJobDesc,
                    "data": {
                        "destinationName": "kupit-o2p",
                        "uriPath": "/createScheduledRun",
                        "method": "POST",
                        "body": JSON.stringify(oBody)
                        //"body": oBody
                    },
                    "active": true,
                    "startTime": {
                        "date": d,
                        "format": "YYYY-MM-DD HH:mm Z"
                    }
                }
            ]
        }


        let dest = await _getDestination();
        let oJob = await new Promise((resolve, reject) => {
            client.executeHttpRequest(dest, {
                method: 'POST',
                url: '/jobs',
                data: data,
            }
            ).then(async (result) => {
                resolve(result)
                oJobRunHeaderNew.JOB_ID = result.data._id.toString()
                oJobRunHeaderNew.JOB_SCHEDULED_ID = result.data.schedules[0].scheduleId
                oJobRunHeaderNew.STATUS = 'C'
                oJobRunHeaderNew.STATUS_TEXT = 'Created Successfully with ID ' + oJobRunHeaderNew.ID

            })

                .catch((e) => {
                    reject(e)
                    oJobRunHeaderNew.STATUS = 'E'
                    oJobRunHeaderNew.STATUS_TEXT = e.message

                });

        });


        let oUpsert = await UPSERT(oJobRunHeaderNew).into(JobRunHeader)
        oResult.MTYPE = oJobRunHeaderNew.STATUS
        oResult.TEXT = oJobRunHeaderNew.STATUS_TEXT
        return oResult


    } catch (e) {

        oJobRunHeaderNew.STATUS = 'E'
        oJobRunHeaderNew.STATUS_TEXT = e.message

        let oUpsert = await UPSERT(oJobRunHeaderNew).into(JobRunHeader)
        oResult.MTYPE = oJobRunHeaderNew.STATUS
        oResult.TEXT = oJobRunHeaderNew.STATUS_TEXT
        return oResult

    }

}



async function createScheduledRun(iRequest,iJobHeader) {

let oJobRunHeader = {}

    try {



        let oInput = iRequest.data.INPUT
        let headerId = iRequest.data.HEADER_ID
        let cron = iRequest.data.CRON



        let runId = 1
        oJobRunHeader = await SELECT.one.from(JobRunHeader).columns(["max(RUN_ID) as maxId"]).where({ ENTITY: oInput.ENTITY })
        if (oJobRunHeader) {
            runId = oJobRunHeader.maxId + 1
        }


        // let runId = Number(moment(new Date).format('YYYYMMDDhhmmss'))


        oJobRunHeader = await SELECT.one.from(JobRunHeader).where({ ID: headerId })

        /*
       oJobRunHeader = await SELECT.one.from(JobRunHeader)
       .where({ JOB_ID: iJobHeader.jobId,
        JOB_SCHEDULED_ID: iJobHeader.jobScheduleId,
        Status: 'Scheduled' })
        */



        let authorization = iRequest.headers.authorization;

        let url = 'http://' + iRequest.headers.host + '/odata/v2/kupito2pmodel-srv/' + oInput.ENTITY +
            '?$filter=' + oInput.FILTER


        var aResponse = await axios.get(url, {
            headers: {
                "content-type": "application/json",
                "Authorization": authorization
            }
        }).then(response => response.data.d.results)


        let aJobRunItem = []

        for (let i = 0; i < aResponse.length; i++) {
            let id = i + 1

            aJobRunItem.push({
                to_JobRunHeader_ID: headerId,
                ID: id,
                ENTITY: oInput.ENTITY,
                JOB_NAME: oJobRunHeader.JOB_NAME,
                RESULT_TEXT: aResponse[i].RESULT_TEXT,
                RESULT_TYPE: aResponse[i].RESULT_TYPE,

            })

        }


        let oUpsert = await UPSERT(aJobRunItem).into(JobRunItem)


        let oJobRunHeaderUpd = oJobRunHeader
        oJobRunHeaderUpd.STATUS_JOB = 'Completed'
        oUpsert = await UPSERT(oJobRunHeaderUpd).into(JobRunHeader)

/*
    
                let oCallJobScheduling = await callJobScheduling(
                    'PUT',
                    `/jobs/${oJobRunHeader.JOB_ID}/schedules/${oJobRunHeader.JOB_SCHEDULED_ID}/runs/${String(oJobRunHeader.RUN_ID)}`,
                    {
                        "success": true,
                        "message": "Successful finished long running operation. New run: " + runId
                    }
                );
      
 */

                /*
 
                let dest = await _getDestination();
                url = `/jobs/${oJobRunHeader.JOB_ID}/schedules/${oJobRunHeader.JOB_SCHEDULED_ID}/runs/${String(oJobRunHeader.RUN_ID)}`
                let oJob = await new Promise((resolve, reject) => {
                    client.executeHttpRequest(dest, {
                        method: 'PUT',
                        url: url,
                        data: {
                            "success": true,
                            "message": "Successful finished long running operation. New run: " + runId
                        },
                    }
                    ).then(async (result) => {
                        resolve(result)
                 
        
                    })
        
                        .catch((e) => {
                            reject(e)
                   
        
                        });
        
                });

                */

        let jobName = oInput.PREFIX_JOB_NAME + ' ' + oInput.ENTITY + ' ' + runId

        var schedule = cronParser.parseExpression(cron);

        var oJobRunHeaderNew = {
            "ENTITY": oInput.ENTITY,
            "JOB_NAME": jobName,
            "RUN_ID": runId,
            "SCHEDULED_AT": schedule.next().toString(),
            "STATUS_JOB": 'Scheduled',
            "STATUS": 'C',
            "STATUS_TEXT": 'Created Successfully',
            "JOB_ID": oJobRunHeader.JOB_ID,
            "JOB_SCHEDULED_ID": oJobRunHeader.JOB_SCHEDULED_ID
        }

        let oInsert = await INSERT(oJobRunHeaderNew).into(JobRunHeader)

    } catch (err) {

        let oJobRunHeaderUpd = oJobRunHeader

        oJobRunHeaderUpd.STATUS_JOB = 'Completed'
        oJobRunHeaderUpd.STATUS = 'E'
        oJobRunHeaderUpd.STATUS_TEXT = err.message

        let oUpsert = await UPSERT(oJobRunHeaderUpd).into(JobRunHeader)

    }

}


async function saveVariant(iRequest) {

    let oResult = {
        MTYPE: '',
        TEXT : ''
    }

    try {

        let aJobRunVariant = await SELECT.from(JobRunVariant).where({ ENTITY: iRequest.data.ENTITY })

        for (let i = 0; i < aJobRunVariant.length; i++) {

            let oActiveVariant = iRequest.data.ACTIVE_VARIANT.find(oActiveVariant => oActiveVariant === aJobRunVariant[i].VARIANT)
            if (!oActiveVariant) {
                let oDelete = await DELETE.from(JobRunVariant).where({ ENTITY: iRequest.data.ENTITY, VARIANT: aJobRunVariant[i].VARIANT })
            }

        }

        let oJobRunVariant = {
            ENTITY : iRequest.data.ENTITY,
            VARIANT: iRequest.data.NAME_VARIANT,
            FILTER : iRequest.data.FILTER_VARIANT
        }

        let oUpsert = await UPSERT(oJobRunVariant).into(JobRunVariant)

        oResult.MTYPE = 'S'
        oResult.TEXT = 'Saved Successfully'
        return oResult

    } catch (err) {

        oResult.MTYPE = 'E'
        oResult.TEXT = err.message
        return oResult

    }

}


async function deactivateJobRun(request) {

    let job_id = request.data.jobId;
    let run_id = request.data.ID;

    let header = await SELECT.one.from(RunHeader).
        where({
            ID: run_id
        });

    var data = {
        "active": false
    }


    let dest = await _getDestination();
    header.Status = 'Inactive';



    new Promise((resolve, reject) => {
        client.executeHttpRequest(dest, {
            method: 'PUT',
            url: '/jobs/' + job_id,
            data: data,
        }
        ).then((result) => {
            resolve(result);


        }).catch((e) => {
            reject({ code: 499, message: `JobSchedulerManager - ${e.message}`, error: e });
        });
    });

    // let tx = cds.tx();
    // let headerNew = await tx.run(UPSERT(header).into(RunHeader));
    // await tx.commit();
    return 'ok'

}


async function callJobScheduling(method, uri, body) {

    let dest = await _getDestination();

    return new Promise((resolve, reject) => {
        client.executeHttpRequest(dest, {
            method: method,
            url: uri,
            data: body
        }).then((result) => {
            LOG.info(result);
            resolve(result);
        }).catch((e) => {
            LOG.error(e);
            reject(e);
        });
    });
}

module.exports = {
    scheduleRun,
    deactivateJobRun,
    createScheduledRun,
    saveVariant
}