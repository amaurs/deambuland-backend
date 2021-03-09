const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

async function getEasterEggIdById(easterEggId: string, authorId: string) {
    const params = {
        TableName: process.env.EASTER_EGGS_TABLE,
        Key: { id: easterEggId, authorId: authorId }
    }
    try {
        const { Item } = await docClient.get(params).promise()
        return Item
    } catch (err) {
        console.log('DynamoDB error: ', err)
    }
}

export default getEasterEggIdById