"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();
async function getEasterEggIdById(easterEggId, authorId) {
    const params = {
        TableName: process.env.EASTER_EGGS_TABLE,
        Key: { id: easterEggId, authorId: authorId }
    };
    try {
        const { Item } = await docClient.get(params).promise();
        return Item;
    }
    catch (err) {
        console.log('DynamoDB error: ', err);
    }
}
exports.default = getEasterEggIdById;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0RWFzdGVyRWdnQnlJZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImdldEVhc3RlckVnZ0J5SWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxNQUFNLEdBQUcsR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDL0IsTUFBTSxTQUFTLEdBQUcsSUFBSSxHQUFHLENBQUMsUUFBUSxDQUFDLGNBQWMsRUFBRSxDQUFDO0FBRXBELEtBQUssVUFBVSxrQkFBa0IsQ0FBQyxXQUFtQixFQUFFLFFBQWdCO0lBQ25FLE1BQU0sTUFBTSxHQUFHO1FBQ1gsU0FBUyxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUJBQWlCO1FBQ3hDLEdBQUcsRUFBRSxFQUFFLEVBQUUsRUFBRSxXQUFXLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRTtLQUMvQyxDQUFBO0lBQ0QsSUFBSTtRQUNBLE1BQU0sRUFBRSxJQUFJLEVBQUUsR0FBRyxNQUFNLFNBQVMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUE7UUFDdEQsT0FBTyxJQUFJLENBQUE7S0FDZDtJQUFDLE9BQU8sR0FBRyxFQUFFO1FBQ1YsT0FBTyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsRUFBRSxHQUFHLENBQUMsQ0FBQTtLQUN2QztBQUNMLENBQUM7QUFFRCxrQkFBZSxrQkFBa0IsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IEFXUyA9IHJlcXVpcmUoJ2F3cy1zZGsnKTtcbmNvbnN0IGRvY0NsaWVudCA9IG5ldyBBV1MuRHluYW1vREIuRG9jdW1lbnRDbGllbnQoKTtcblxuYXN5bmMgZnVuY3Rpb24gZ2V0RWFzdGVyRWdnSWRCeUlkKGVhc3RlckVnZ0lkOiBzdHJpbmcsIGF1dGhvcklkOiBzdHJpbmcpIHtcbiAgICBjb25zdCBwYXJhbXMgPSB7XG4gICAgICAgIFRhYmxlTmFtZTogcHJvY2Vzcy5lbnYuRUFTVEVSX0VHR1NfVEFCTEUsXG4gICAgICAgIEtleTogeyBpZDogZWFzdGVyRWdnSWQsIGF1dGhvcklkOiBhdXRob3JJZCB9XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHsgSXRlbSB9ID0gYXdhaXQgZG9jQ2xpZW50LmdldChwYXJhbXMpLnByb21pc2UoKVxuICAgICAgICByZXR1cm4gSXRlbVxuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBjb25zb2xlLmxvZygnRHluYW1vREIgZXJyb3I6ICcsIGVycilcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGdldEVhc3RlckVnZ0lkQnlJZCJdfQ==