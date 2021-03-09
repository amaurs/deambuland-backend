const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

async function listEasterEgg(authorId: string) {
    const params = {
        TableName: process.env.EASTER_EGGS_TABLE,
        KeyConditionExpression: "#author = :aaaa",
        ExpressionAttributeNames:{
            "#author": "authorId"
        },
        ExpressionAttributeValues: {
            ":aaaa": authorId
        }
    }
    try {
        const data = await docClient.query(params).promise()
        return data.Items
    } catch (err) {
        console.log('DynamoDB error: ', err)
        return null
    }
}

export default listEasterEgg;