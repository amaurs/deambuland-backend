const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

async function deleteEasterEgg(easterEggId: string, authorId: string) {
    const params = {
        TableName: process.env.EASTER_EGGS_TABLE,
        Key: {
           id: easterEggId, authorId: authorId
        }
    }
    try {
        await docClient.delete(params).promise()
        return easterEggId
    } catch (err) {
        console.log('DynamoDB error: ', err)
        return null
    }
}

export default deleteEasterEgg;