const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();
import EasterEgg from './EasterEgg';

async function createEasterEgg(easterEgg: EasterEgg) {
    const params = {
        TableName: process.env.EASTER_EGGS_TABLE,
        Item: easterEgg
    }
    try {
        await docClient.put(params).promise();
        return easterEgg;
    } catch (err) {
        console.log('DynamoDB error: ', err);
        return null;
    }
}

export default createEasterEgg;