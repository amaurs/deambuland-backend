"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeambulandInfraStack = void 0;
const cdk = require("@aws-cdk/core");
const amplify = require("@aws-cdk/aws-amplify");
const appsync = require("@aws-cdk/aws-appsync");
const ddb = require("@aws-cdk/aws-dynamodb");
const lambda = require("@aws-cdk/aws-lambda");
class DeambulandInfraStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const amplifyApp = new amplify.App(this, "DeambulandApp", {
            sourceCodeProvider: new amplify.GitHubSourceCodeProvider({
                owner: "amaurs",
                repository: "deambuland",
                oauthToken: cdk.SecretValue.secretsManager("platform/github/oAuthToken", {
                    jsonField: "oAuthToken",
                }),
            }),
        });
        const masterBranch = amplifyApp.addBranch("main");
        // Creates the AppSync API
        const api = new appsync.GraphqlApi(this, 'DeambulandApi', {
            name: 'deambuland-api',
            schema: appsync.Schema.fromAsset('graphql/schema.graphql'),
            authorizationConfig: {
                defaultAuthorization: {
                    authorizationType: appsync.AuthorizationType.API_KEY,
                    apiKeyConfig: {
                        expires: cdk.Expiration.after(cdk.Duration.days(365))
                    }
                },
            },
            xrayEnabled: true,
        });
        // Prints out the AppSync GraphQL endpoint to the terminal
        new cdk.CfnOutput(this, "GraphQLAPIURL", {
            value: api.graphqlUrl
        });
        // Prints out the AppSync GraphQL API key to the terminal
        new cdk.CfnOutput(this, "GraphQLAPIKey", {
            value: api.apiKey || ''
        });
        // Prints out the stack region to the terminal
        new cdk.CfnOutput(this, "Stack Region", {
            value: this.region
        });
        // lib/appsync-cdk-app-stack.ts
        const deambulandLambda = new lambda.Function(this, 'DeambulandHandler', {
            runtime: lambda.Runtime.NODEJS_12_X,
            handler: 'main.handler',
            code: lambda.Code.fromAsset('lambda-fns'),
            memorySize: 1024
        });
        // Set the new Lambda function as a data source for the AppSync API
        const lambdaDs = api.addLambdaDataSource('lambdaDatasource', deambulandLambda);
        lambdaDs.createResolver({
            typeName: "Query",
            fieldName: "getEasterEggById"
        });
        lambdaDs.createResolver({
            typeName: "Query",
            fieldName: "listEasterEggs"
        });
        lambdaDs.createResolver({
            typeName: "Mutation",
            fieldName: "createEasterEgg"
        });
        lambdaDs.createResolver({
            typeName: "Mutation",
            fieldName: "deleteEasterEgg"
        });
        lambdaDs.createResolver({
            typeName: "Mutation",
            fieldName: "updateEasterEgg"
        });
        const deambulandTable = new ddb.Table(this, 'CDKEasterEggsTable', {
            billingMode: ddb.BillingMode.PAY_PER_REQUEST,
            sortKey: {
                name: 'id',
                type: ddb.AttributeType.STRING,
            },
            partitionKey: {
                name: 'authorId',
                type: ddb.AttributeType.STRING,
            },
        });
        // enable the Lambda function to access the DynamoDB table (using IAM)
        deambulandTable.grantFullAccess(deambulandLambda);
        // Create an environment variable that we will use in the function code
        deambulandLambda.addEnvironment('EASTER_EGGS_TABLE', deambulandTable.tableName);
    }
}
exports.DeambulandInfraStack = DeambulandInfraStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVhbWJ1bGFuZC1pbmZyYS1zdGFjay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRlYW1idWxhbmQtaW5mcmEtc3RhY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEscUNBQXFDO0FBQ3JDLGdEQUFnRDtBQUNoRCxnREFBZ0Q7QUFDaEQsNkNBQTZDO0FBQzdDLDhDQUE4QztBQUU5QyxNQUFhLG9CQUFxQixTQUFRLEdBQUcsQ0FBQyxLQUFLO0lBQ2pELFlBQVksS0FBb0IsRUFBRSxFQUFVLEVBQUUsS0FBc0I7UUFDbEUsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFeEIsTUFBTSxVQUFVLEdBQUcsSUFBSSxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxlQUFlLEVBQUU7WUFDeEQsa0JBQWtCLEVBQUUsSUFBSSxPQUFPLENBQUMsd0JBQXdCLENBQUM7Z0JBQ3ZELEtBQUssRUFBRSxRQUFRO2dCQUNmLFVBQVUsRUFBRSxZQUFZO2dCQUN4QixVQUFVLEVBQUUsR0FBRyxDQUFDLFdBQVcsQ0FBQyxjQUFjLENBQUMsNEJBQTRCLEVBQUU7b0JBQ3ZFLFNBQVMsRUFBRSxZQUFZO2lCQUN4QixDQUFDO2FBQ0gsQ0FBQztTQUNILENBQUMsQ0FBQztRQUNILE1BQU0sWUFBWSxHQUFHLFVBQVUsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUM7UUFHOUMsMEJBQTBCO1FBQzlCLE1BQU0sR0FBRyxHQUFHLElBQUksT0FBTyxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsZUFBZSxFQUFFO1lBQ3hELElBQUksRUFBRSxnQkFBZ0I7WUFDdEIsTUFBTSxFQUFFLE9BQU8sQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLHdCQUF3QixDQUFDO1lBQzFELG1CQUFtQixFQUFFO2dCQUNuQixvQkFBb0IsRUFBRTtvQkFDcEIsaUJBQWlCLEVBQUUsT0FBTyxDQUFDLGlCQUFpQixDQUFDLE9BQU87b0JBQ3BELFlBQVksRUFBRTt3QkFDWixPQUFPLEVBQUUsR0FBRyxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7cUJBQ3REO2lCQUNGO2FBQ0Y7WUFDRCxXQUFXLEVBQUUsSUFBSTtTQUNsQixDQUFDLENBQUM7UUFFSCwwREFBMEQ7UUFDMUQsSUFBSSxHQUFHLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxlQUFlLEVBQUU7WUFDeEMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxVQUFVO1NBQ3JCLENBQUMsQ0FBQztRQUVILHlEQUF5RDtRQUN6RCxJQUFJLEdBQUcsQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLGVBQWUsRUFBRTtZQUN2QyxLQUFLLEVBQUUsR0FBRyxDQUFDLE1BQU0sSUFBSSxFQUFFO1NBQ3hCLENBQUMsQ0FBQztRQUVILDhDQUE4QztRQUM5QyxJQUFJLEdBQUcsQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLGNBQWMsRUFBRTtZQUN0QyxLQUFLLEVBQUUsSUFBSSxDQUFDLE1BQU07U0FDbkIsQ0FBQyxDQUFDO1FBRUgsK0JBQStCO1FBQy9CLE1BQU0sZ0JBQWdCLEdBQUcsSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxtQkFBbUIsRUFBRTtZQUNwRSxPQUFPLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxXQUFXO1lBQ25DLE9BQU8sRUFBRSxjQUFjO1lBQ3ZCLElBQUksRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUM7WUFDekMsVUFBVSxFQUFFLElBQUk7U0FDbkIsQ0FBQyxDQUFDO1FBRUgsbUVBQW1FO1FBQ25FLE1BQU0sUUFBUSxHQUFHLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxrQkFBa0IsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO1FBRS9FLFFBQVEsQ0FBQyxjQUFjLENBQUM7WUFDcEIsUUFBUSxFQUFFLE9BQU87WUFDakIsU0FBUyxFQUFFLGtCQUFrQjtTQUNoQyxDQUFDLENBQUM7UUFFSCxRQUFRLENBQUMsY0FBYyxDQUFDO1lBQ3BCLFFBQVEsRUFBRSxPQUFPO1lBQ2pCLFNBQVMsRUFBRSxnQkFBZ0I7U0FDOUIsQ0FBQyxDQUFDO1FBRUgsUUFBUSxDQUFDLGNBQWMsQ0FBQztZQUNwQixRQUFRLEVBQUUsVUFBVTtZQUNwQixTQUFTLEVBQUUsaUJBQWlCO1NBQy9CLENBQUMsQ0FBQztRQUVILFFBQVEsQ0FBQyxjQUFjLENBQUM7WUFDcEIsUUFBUSxFQUFFLFVBQVU7WUFDcEIsU0FBUyxFQUFFLGlCQUFpQjtTQUMvQixDQUFDLENBQUM7UUFFSCxRQUFRLENBQUMsY0FBYyxDQUFDO1lBQ3BCLFFBQVEsRUFBRSxVQUFVO1lBQ3BCLFNBQVMsRUFBRSxpQkFBaUI7U0FDL0IsQ0FBQyxDQUFDO1FBRUgsTUFBTSxlQUFlLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxvQkFBb0IsRUFBRTtZQUM5RCxXQUFXLEVBQUUsR0FBRyxDQUFDLFdBQVcsQ0FBQyxlQUFlO1lBQzVDLE9BQU8sRUFBRTtnQkFDTCxJQUFJLEVBQUUsSUFBSTtnQkFDVixJQUFJLEVBQUUsR0FBRyxDQUFDLGFBQWEsQ0FBQyxNQUFNO2FBQ2pDO1lBQ0QsWUFBWSxFQUFFO2dCQUNWLElBQUksRUFBRSxVQUFVO2dCQUNoQixJQUFJLEVBQUUsR0FBRyxDQUFDLGFBQWEsQ0FBQyxNQUFNO2FBQ2pDO1NBQ0osQ0FBQyxDQUFDO1FBQ0gsc0VBQXNFO1FBQ3RFLGVBQWUsQ0FBQyxlQUFlLENBQUMsZ0JBQWdCLENBQUMsQ0FBQTtRQUVqRCx1RUFBdUU7UUFDdkUsZ0JBQWdCLENBQUMsY0FBYyxDQUFDLG1CQUFtQixFQUFFLGVBQWUsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUNsRixDQUFDO0NBQ0Y7QUFuR0Qsb0RBbUdDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY2RrIGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0ICogYXMgYW1wbGlmeSBmcm9tIFwiQGF3cy1jZGsvYXdzLWFtcGxpZnlcIjtcbmltcG9ydCAqIGFzIGFwcHN5bmMgZnJvbSAnQGF3cy1jZGsvYXdzLWFwcHN5bmMnO1xuaW1wb3J0ICogYXMgZGRiIGZyb20gJ0Bhd3MtY2RrL2F3cy1keW5hbW9kYic7XG5pbXBvcnQgKiBhcyBsYW1iZGEgZnJvbSAnQGF3cy1jZGsvYXdzLWxhbWJkYSc7XG5cbmV4cG9ydCBjbGFzcyBEZWFtYnVsYW5kSW5mcmFTdGFjayBleHRlbmRzIGNkay5TdGFjayB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBjZGsuQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wcz86IGNkay5TdGFja1Byb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG5cbiAgICBjb25zdCBhbXBsaWZ5QXBwID0gbmV3IGFtcGxpZnkuQXBwKHRoaXMsIFwiRGVhbWJ1bGFuZEFwcFwiLCB7XG4gICAgICBzb3VyY2VDb2RlUHJvdmlkZXI6IG5ldyBhbXBsaWZ5LkdpdEh1YlNvdXJjZUNvZGVQcm92aWRlcih7XG4gICAgICAgIG93bmVyOiBcImFtYXVyc1wiLFxuICAgICAgICByZXBvc2l0b3J5OiBcImRlYW1idWxhbmRcIixcbiAgICAgICAgb2F1dGhUb2tlbjogY2RrLlNlY3JldFZhbHVlLnNlY3JldHNNYW5hZ2VyKFwicGxhdGZvcm0vZ2l0aHViL29BdXRoVG9rZW5cIiwge1xuICAgICAgICAgIGpzb25GaWVsZDogXCJvQXV0aFRva2VuXCIsXG4gICAgICAgIH0pLFxuICAgICAgfSksXG4gICAgfSk7XG4gICAgY29uc3QgbWFzdGVyQnJhbmNoID0gYW1wbGlmeUFwcC5hZGRCcmFuY2goXCJtYWluXCIpO1xuXG5cbiAgICAgICAgLy8gQ3JlYXRlcyB0aGUgQXBwU3luYyBBUElcbiAgICBjb25zdCBhcGkgPSBuZXcgYXBwc3luYy5HcmFwaHFsQXBpKHRoaXMsICdEZWFtYnVsYW5kQXBpJywge1xuICAgICAgbmFtZTogJ2RlYW1idWxhbmQtYXBpJyxcbiAgICAgIHNjaGVtYTogYXBwc3luYy5TY2hlbWEuZnJvbUFzc2V0KCdncmFwaHFsL3NjaGVtYS5ncmFwaHFsJyksXG4gICAgICBhdXRob3JpemF0aW9uQ29uZmlnOiB7XG4gICAgICAgIGRlZmF1bHRBdXRob3JpemF0aW9uOiB7XG4gICAgICAgICAgYXV0aG9yaXphdGlvblR5cGU6IGFwcHN5bmMuQXV0aG9yaXphdGlvblR5cGUuQVBJX0tFWSxcbiAgICAgICAgICBhcGlLZXlDb25maWc6IHtcbiAgICAgICAgICAgIGV4cGlyZXM6IGNkay5FeHBpcmF0aW9uLmFmdGVyKGNkay5EdXJhdGlvbi5kYXlzKDM2NSkpXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIHhyYXlFbmFibGVkOiB0cnVlLFxuICAgIH0pO1xuXG4gICAgLy8gUHJpbnRzIG91dCB0aGUgQXBwU3luYyBHcmFwaFFMIGVuZHBvaW50IHRvIHRoZSB0ZXJtaW5hbFxuICAgIG5ldyBjZGsuQ2ZuT3V0cHV0KHRoaXMsIFwiR3JhcGhRTEFQSVVSTFwiLCB7XG4gICAgIHZhbHVlOiBhcGkuZ3JhcGhxbFVybFxuICAgIH0pO1xuXG4gICAgLy8gUHJpbnRzIG91dCB0aGUgQXBwU3luYyBHcmFwaFFMIEFQSSBrZXkgdG8gdGhlIHRlcm1pbmFsXG4gICAgbmV3IGNkay5DZm5PdXRwdXQodGhpcywgXCJHcmFwaFFMQVBJS2V5XCIsIHtcbiAgICAgIHZhbHVlOiBhcGkuYXBpS2V5IHx8ICcnXG4gICAgfSk7XG5cbiAgICAvLyBQcmludHMgb3V0IHRoZSBzdGFjayByZWdpb24gdG8gdGhlIHRlcm1pbmFsXG4gICAgbmV3IGNkay5DZm5PdXRwdXQodGhpcywgXCJTdGFjayBSZWdpb25cIiwge1xuICAgICAgdmFsdWU6IHRoaXMucmVnaW9uXG4gICAgfSk7XG5cbiAgICAvLyBsaWIvYXBwc3luYy1jZGstYXBwLXN0YWNrLnRzXG4gICAgY29uc3QgZGVhbWJ1bGFuZExhbWJkYSA9IG5ldyBsYW1iZGEuRnVuY3Rpb24odGhpcywgJ0RlYW1idWxhbmRIYW5kbGVyJywge1xuICAgICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMTJfWCxcbiAgICAgICAgaGFuZGxlcjogJ21haW4uaGFuZGxlcicsXG4gICAgICAgIGNvZGU6IGxhbWJkYS5Db2RlLmZyb21Bc3NldCgnbGFtYmRhLWZucycpLFxuICAgICAgICBtZW1vcnlTaXplOiAxMDI0XG4gICAgfSk7XG5cbiAgICAvLyBTZXQgdGhlIG5ldyBMYW1iZGEgZnVuY3Rpb24gYXMgYSBkYXRhIHNvdXJjZSBmb3IgdGhlIEFwcFN5bmMgQVBJXG4gICAgY29uc3QgbGFtYmRhRHMgPSBhcGkuYWRkTGFtYmRhRGF0YVNvdXJjZSgnbGFtYmRhRGF0YXNvdXJjZScsIGRlYW1idWxhbmRMYW1iZGEpO1xuXG4gICAgbGFtYmRhRHMuY3JlYXRlUmVzb2x2ZXIoe1xuICAgICAgICB0eXBlTmFtZTogXCJRdWVyeVwiLFxuICAgICAgICBmaWVsZE5hbWU6IFwiZ2V0RWFzdGVyRWdnQnlJZFwiXG4gICAgfSk7XG5cbiAgICBsYW1iZGFEcy5jcmVhdGVSZXNvbHZlcih7XG4gICAgICAgIHR5cGVOYW1lOiBcIlF1ZXJ5XCIsXG4gICAgICAgIGZpZWxkTmFtZTogXCJsaXN0RWFzdGVyRWdnc1wiXG4gICAgfSk7XG5cbiAgICBsYW1iZGFEcy5jcmVhdGVSZXNvbHZlcih7XG4gICAgICAgIHR5cGVOYW1lOiBcIk11dGF0aW9uXCIsXG4gICAgICAgIGZpZWxkTmFtZTogXCJjcmVhdGVFYXN0ZXJFZ2dcIlxuICAgIH0pO1xuXG4gICAgbGFtYmRhRHMuY3JlYXRlUmVzb2x2ZXIoe1xuICAgICAgICB0eXBlTmFtZTogXCJNdXRhdGlvblwiLFxuICAgICAgICBmaWVsZE5hbWU6IFwiZGVsZXRlRWFzdGVyRWdnXCJcbiAgICB9KTtcblxuICAgIGxhbWJkYURzLmNyZWF0ZVJlc29sdmVyKHtcbiAgICAgICAgdHlwZU5hbWU6IFwiTXV0YXRpb25cIixcbiAgICAgICAgZmllbGROYW1lOiBcInVwZGF0ZUVhc3RlckVnZ1wiXG4gICAgfSk7XG5cbiAgICBjb25zdCBkZWFtYnVsYW5kVGFibGUgPSBuZXcgZGRiLlRhYmxlKHRoaXMsICdDREtFYXN0ZXJFZ2dzVGFibGUnLCB7XG4gICAgICAgIGJpbGxpbmdNb2RlOiBkZGIuQmlsbGluZ01vZGUuUEFZX1BFUl9SRVFVRVNULFxuICAgICAgICBzb3J0S2V5OiB7XG4gICAgICAgICAgICBuYW1lOiAnaWQnLFxuICAgICAgICAgICAgdHlwZTogZGRiLkF0dHJpYnV0ZVR5cGUuU1RSSU5HLFxuICAgICAgICB9LFxuICAgICAgICBwYXJ0aXRpb25LZXk6IHtcbiAgICAgICAgICAgIG5hbWU6ICdhdXRob3JJZCcsXG4gICAgICAgICAgICB0eXBlOiBkZGIuQXR0cmlidXRlVHlwZS5TVFJJTkcsXG4gICAgICAgIH0sXG4gICAgfSk7XG4gICAgLy8gZW5hYmxlIHRoZSBMYW1iZGEgZnVuY3Rpb24gdG8gYWNjZXNzIHRoZSBEeW5hbW9EQiB0YWJsZSAodXNpbmcgSUFNKVxuICAgIGRlYW1idWxhbmRUYWJsZS5ncmFudEZ1bGxBY2Nlc3MoZGVhbWJ1bGFuZExhbWJkYSlcblxuICAgIC8vIENyZWF0ZSBhbiBlbnZpcm9ubWVudCB2YXJpYWJsZSB0aGF0IHdlIHdpbGwgdXNlIGluIHRoZSBmdW5jdGlvbiBjb2RlXG4gICAgZGVhbWJ1bGFuZExhbWJkYS5hZGRFbnZpcm9ubWVudCgnRUFTVEVSX0VHR1NfVEFCTEUnLCBkZWFtYnVsYW5kVGFibGUudGFibGVOYW1lKTtcbiAgfVxufVxuIl19