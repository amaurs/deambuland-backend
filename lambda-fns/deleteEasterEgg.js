"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();
async function deleteEasterEgg(easterEggId, authorId) {
    const params = {
        TableName: process.env.EASTER_EGGS_TABLE,
        Key: {
            id: easterEggId, authorId: authorId
        }
    };
    try {
        await docClient.delete(params).promise();
        return easterEggId;
    }
    catch (err) {
        console.log('DynamoDB error: ', err);
        return null;
    }
}
exports.default = deleteEasterEgg;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVsZXRlRWFzdGVyRWdnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZGVsZXRlRWFzdGVyRWdnLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsTUFBTSxHQUFHLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQy9CLE1BQU0sU0FBUyxHQUFHLElBQUksR0FBRyxDQUFDLFFBQVEsQ0FBQyxjQUFjLEVBQUUsQ0FBQztBQUVwRCxLQUFLLFVBQVUsZUFBZSxDQUFDLFdBQW1CLEVBQUUsUUFBZ0I7SUFDaEUsTUFBTSxNQUFNLEdBQUc7UUFDWCxTQUFTLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUI7UUFDeEMsR0FBRyxFQUFFO1lBQ0YsRUFBRSxFQUFFLFdBQVcsRUFBRSxRQUFRLEVBQUUsUUFBUTtTQUNyQztLQUNKLENBQUE7SUFDRCxJQUFJO1FBQ0EsTUFBTSxTQUFTLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFBO1FBQ3hDLE9BQU8sV0FBVyxDQUFBO0tBQ3JCO0lBQUMsT0FBTyxHQUFHLEVBQUU7UUFDVixPQUFPLENBQUMsR0FBRyxDQUFDLGtCQUFrQixFQUFFLEdBQUcsQ0FBQyxDQUFBO1FBQ3BDLE9BQU8sSUFBSSxDQUFBO0tBQ2Q7QUFDTCxDQUFDO0FBRUQsa0JBQWUsZUFBZSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgQVdTID0gcmVxdWlyZSgnYXdzLXNkaycpO1xuY29uc3QgZG9jQ2xpZW50ID0gbmV3IEFXUy5EeW5hbW9EQi5Eb2N1bWVudENsaWVudCgpO1xuXG5hc3luYyBmdW5jdGlvbiBkZWxldGVFYXN0ZXJFZ2coZWFzdGVyRWdnSWQ6IHN0cmluZywgYXV0aG9ySWQ6IHN0cmluZykge1xuICAgIGNvbnN0IHBhcmFtcyA9IHtcbiAgICAgICAgVGFibGVOYW1lOiBwcm9jZXNzLmVudi5FQVNURVJfRUdHU19UQUJMRSxcbiAgICAgICAgS2V5OiB7XG4gICAgICAgICAgIGlkOiBlYXN0ZXJFZ2dJZCwgYXV0aG9ySWQ6IGF1dGhvcklkXG4gICAgICAgIH1cbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgYXdhaXQgZG9jQ2xpZW50LmRlbGV0ZShwYXJhbXMpLnByb21pc2UoKVxuICAgICAgICByZXR1cm4gZWFzdGVyRWdnSWRcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ0R5bmFtb0RCIGVycm9yOiAnLCBlcnIpXG4gICAgICAgIHJldHVybiBudWxsXG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBkZWxldGVFYXN0ZXJFZ2c7Il19