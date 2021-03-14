"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeambulandInfraStack = void 0;
const cdk = require("@aws-cdk/core");
const amplify = require("@aws-cdk/aws-amplify");
const appsync = require("@aws-cdk/aws-appsync");
const ddb = require("@aws-cdk/aws-dynamodb");
const lambda = require("@aws-cdk/aws-lambda");
const cognito = require("@aws-cdk/aws-cognito");
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
        const userPool = new cognito.UserPool(this, "DeambulandUserPool", {
            userPoolName: "DeambulandUserPool",
            signInAliases: {
                username: true,
            },
        });
        const userPoolClient = new cognito.UserPoolClient(this, "DeambulandUserPoolClient", {
            userPool
        });
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
                additionalAuthorizationModes: [{
                        authorizationType: appsync.AuthorizationType.USER_POOL,
                        userPoolConfig: {
                            userPool,
                        }
                    }]
            },
            xrayEnabled: true,
        });
        additionalAuthorizationModes: [{
                authorizationType: appsync.AuthorizationType.USER_POOL,
                userPoolConfig: {
                    userPool,
                }
            }];
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
        new cdk.CfnOutput(this, "userPoolClientId", {
            value: userPoolClient.userPoolClientId
        });
        new cdk.CfnOutput(this, "userPoolId", {
            value: userPool.userPoolId
        });
        new cdk.CfnOutput(this, "userPoolProviderUrl", {
            value: userPool.userPoolProviderUrl
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVhbWJ1bGFuZC1pbmZyYS1zdGFjay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRlYW1idWxhbmQtaW5mcmEtc3RhY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEscUNBQXFDO0FBQ3JDLGdEQUFnRDtBQUNoRCxnREFBZ0Q7QUFDaEQsNkNBQTZDO0FBQzdDLDhDQUE4QztBQUM5QyxnREFBZ0Q7QUFFaEQsTUFBYSxvQkFBcUIsU0FBUSxHQUFHLENBQUMsS0FBSztJQUNqRCxZQUFZLEtBQW9CLEVBQUUsRUFBVSxFQUFFLEtBQXNCO1FBQ2xFLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXhCLE1BQU0sVUFBVSxHQUFHLElBQUksT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsZUFBZSxFQUFFO1lBQ3hELGtCQUFrQixFQUFFLElBQUksT0FBTyxDQUFDLHdCQUF3QixDQUFDO2dCQUN2RCxLQUFLLEVBQUUsUUFBUTtnQkFDZixVQUFVLEVBQUUsWUFBWTtnQkFDeEIsVUFBVSxFQUFFLEdBQUcsQ0FBQyxXQUFXLENBQUMsY0FBYyxDQUFDLDRCQUE0QixFQUFFO29CQUN2RSxTQUFTLEVBQUUsWUFBWTtpQkFDeEIsQ0FBQzthQUNILENBQUM7U0FDSCxDQUFDLENBQUM7UUFDSCxNQUFNLFlBQVksR0FBRyxVQUFVLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBSWxELE1BQU0sUUFBUSxHQUFHLElBQUksT0FBTyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsb0JBQW9CLEVBQUU7WUFDOUQsWUFBWSxFQUFFLG9CQUFvQjtZQUNsQyxhQUFhLEVBQUU7Z0JBQ1gsUUFBUSxFQUFFLElBQUk7YUFDakI7U0FDSixDQUFDLENBQUM7UUFFSCxNQUFNLGNBQWMsR0FBRyxJQUFJLE9BQU8sQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLDBCQUEwQixFQUFFO1lBQ2hGLFFBQVE7U0FDWCxDQUFDLENB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UUFBUSxFQUFFLFVBQVU7WUFDcEIsU0FBUyxFQUFFLGlCQUFpQjtTQUMvQixDQUFDLENBQUM7UUFFSCxRQUFRLENBQUMsY0FBYyxDQUFDO1lBQ3BCLFFBQVEsRUFBRSxVQUFVO1lBQ3BCLFNBQVMsRUFBRSxpQkFBaUI7U0FDL0IsQ0FBQyxDQUFDO1FBRUgsUUFBUSxDQUFDLGNBQWMsQ0FBQztZQUNwQixRQUFRLEVBQUUsVUFBVTtZQUNwQixTQUFTLEVBQUUsaUJBQWlCO1NBQy9CLENBQUMsQ0FBQztRQUVILE1BQU0sZUFBZSxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsb0JBQW9CLEVBQUU7WUFDOUQsV0FBVyxFQUFFLEdBQUcsQ0FBQyxXQUFXLENBQUMsZUFBZTtZQUM1QyxPQUFPLEVBQUU7Z0JBQ0wsSUFBSSxFQUFFLElBQUk7Z0JBQ1YsSUFBSSxFQUFFLEdBQUcsQ0FBQyxhQUFhLENBQUMsTUFBTTthQUNqQztZQUNELFlBQVksRUFBRTtnQkFDVixJQUFJLEVBQUUsVUFBVTtnQkFDaEIsSUFBSSxFQUFFLEdBQUcsQ0FBQyxhQUFhLENBQUMsTUFBTTthQUNqQztTQUNKLENBQUMsQ0FBQztRQUNILHNFQUFzRTtRQUN0RSxlQUFlLENBQUMsZUFBZSxDQUFDLGdCQUFnQixDQUFDLENBQUE7UUFFakQsdUVBQXVFO1FBQ3ZFLGdCQUFnQixDQUFDLGNBQWMsQ0FBQyxtQkFBbUIsRUFBRSxlQUFlLENBQUMsU0FBUyxDQUFDLENBQUM7SUFJbEYsQ0FBQztDQUNGO0FBakpELG9EQWlKQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCAqIGFzIGFtcGxpZnkgZnJvbSBcIkBhd3MtY2RrL2F3cy1hbXBsaWZ5XCI7XG5pbXBvcnQgKiBhcyBhcHBzeW5jIGZyb20gJ0Bhd3MtY2RrL2F3cy1hcHBzeW5jJztcbmltcG9ydCAqIGFzIGRkYiBmcm9tICdAYXdzLWNkay9hd3MtZHluYW1vZGInO1xuaW1wb3J0ICogYXMgbGFtYmRhIGZyb20gJ0Bhd3MtY2RrL2F3cy1sYW1iZGEnO1xuaW1wb3J0ICogYXMgY29nbml0byBmcm9tICdAYXdzLWNkay9hd3MtY29nbml0byc7XG5cbmV4cG9ydCBjbGFzcyBEZWFtYnVsYW5kSW5mcmFTdGFjayBleHRlbmRzIGNkay5TdGFjayB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBjZGsuQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wcz86IGNkay5TdGFja1Byb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG5cbiAgICBjb25zdCBhbXBsaWZ5QXBwID0gbmV3IGFtcGxpZnkuQXBwKHRoaXMsIFwiRGVhbWJ1bGFuZEFwcFwiLCB7XG4gICAgICBzb3VyY2VDb2RlUHJvdmlkZXI6IG5ldyBhbXBsaWZ5LkdpdEh1YlNvdXJjZUNvZGVQcm92aWRlcih7XG4gICAgICAgIG93bmVyOiBcImFtYXVyc1wiLFxuICAgICAgICByZXBvc2l0b3J5OiBcImRlYW1idWxhbmRcIixcbiAgICAgICAgb2F1dGhUb2tlbjogY2RrLlNlY3JldFZhbHVlLnNlY3JldHNNYW5hZ2VyKFwicGxhdGZvcm0vZ2l0aHViL29BdXRoVG9rZW5cIiwge1xuICAgICAgICAgIGpzb25GaWVsZDogXCJvQXV0aFRva2VuXCIsXG4gICAgICAgIH0pLFxuICAgICAgfSksXG4gICAgfSk7XG4gICAgY29uc3QgbWFzdGVyQnJhbmNoID0gYW1wbGlmeUFwcC5hZGRCcmFuY2goXCJtYWluXCIpO1xuXG5cblxuICAgIGNvbnN0IHVzZXJQb29sID0gbmV3IGNvZ25pdG8uVXNlclBvb2wodGhpcywgXCJEZWFtYnVsYW5kVXNlclBvb2xcIiwge1xuICAgICAgICB1c2VyUG9vbE5hbWU6IFwiRGVhbWJ1bGFuZFVzZXJQb29sXCIsXG4gICAgICAgIHNpZ25JbkFsaWFzZXM6IHtcbiAgICAgICAgICAgIHVzZXJuYW1lOiB0cnVlLFxuICAgICAgICB9LFxuICAgIH0pO1xuXG4gICAgY29uc3QgdXNlclBvb2xDbGllbnQgPSBuZXcgY29nbml0by5Vc2VyUG9vbENsaWVudCh0aGlzLCBcIkRlYW1idWxhbmRVc2VyUG9vbENsaWVudFwiLCB7XG4gICAgICAgIHVzZXJQb29sXG4gICAgfSlcblxuXG4gICAgICAgIC8vIENyZWF0ZXMgdGhlIEFwcFN5bmMgQVBJXG4gICAgY29uc3QgYXBpID0gbmV3IGFwcHN5bmMuR3JhcGhxbEFwaSh0aGlzLCAnRGVhbWJ1bGFuZEFwaScsIHtcbiAgICAgIG5hbWU6ICdkZWFtYnVsYW5kLWFwaScsXG4gICAgICBzY2hlbWE6IGFwcHN5bmMuU2NoZW1hLmZyb21Bc3NldCgnZ3JhcGhxbC9zY2hlbWEuZ3JhcGhxbCcpLFxuICAgICAgYXV0aG9yaXphdGlvbkNvbmZpZzoge1xuICAgICAgICBkZWZhdWx0QXV0aG9yaXphdGlvbjoge1xuICAgICAgICAgIGF1dGhvcml6YXRpb25UeXBlOiBhcHBzeW5jLkF1dGhvcml6YXRpb25UeXBlLkFQSV9LRVksXG4gICAgICAgICAgYXBpS2V5Q29uZmlnOiB7XG4gICAgICAgICAgICBleHBpcmVzOiBjZGsuRXhwaXJhdGlvbi5hZnRlcihjZGsuRHVyYXRpb24uZGF5cygzNjUpKVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgYWRkaXRpb25hbEF1dGhvcml6YXRpb25Nb2RlczogW3tcbiAgICAgICAgICBhdXRob3JpemF0aW9uVHlwZTogYXBwc3luYy5BdXRob3JpemF0aW9uVHlwZS5VU0VSX1BPT0wsXG4gICAgICAgICAgdXNlclBvb2xDb25maWc6IHtcbiAgICAgICAgICAgIHVzZXJQb29sLFxuICAgICAgICAgIH1cbiAgICAgICAgfV1cbiAgICAgIH0sXG4gICAgICB4cmF5RW5hYmxlZDogdHJ1ZSxcbiAgICB9KTtcblxuXG4gICAgICAgIGFkZGl0aW9uYWxBdXRob3JpemF0aW9uTW9kZXM6IFt7XG4gICAgICBhdXRob3JpemF0aW9uVHlwZTogYXBwc3luYy5BdXRob3JpemF0aW9uVHlwZS5VU0VSX1BPT0wsXG4gICAgICB1c2VyUG9vbENvbmZpZzoge1xuICAgICAgICB1c2VyUG9vbCxcbiAgICAgIH1cbiAgICB9XVxuXG4gICAgLy8gUHJpbnRzIG91dCB0aGUgQXBwU3luYyBHcmFwaFFMIGVuZHBvaW50IHRvIHRoZSB0ZXJtaW5hbFxuICAgIG5ldyBjZGsuQ2ZuT3V0cHV0KHRoaXMsIFwiR3JhcGhRTEFQSVVSTFwiLCB7XG4gICAgIHZhbHVlOiBhcGkuZ3JhcGhxbFVybFxuICAgIH0pO1xuXG4gICAgLy8gUHJpbnRzIG91dCB0aGUgQXBwU3luYyBHcmFwaFFMIEFQSSBrZXkgdG8gdGhlIHRlcm1pbmFsXG4gICAgbmV3IGNkay5DZm5PdXRwdXQodGhpcywgXCJHcmFwaFFMQVBJS2V5XCIsIHtcbiAgICAgIHZhbHVlOiBhcGkuYXBpS2V5IHx8ICcnXG4gICAgfSk7XG5cbiAgICAvLyBQcmludHMgb3V0IHRoZSBzdGFjayByZWdpb24gdG8gdGhlIHRlcm1pbmFsXG4gICAgbmV3IGNkay5DZm5PdXRwdXQodGhpcywgXCJTdGFjayBSZWdpb25cIiwge1xuICAgICAgdmFsdWU6IHRoaXMucmVnaW9uXG4gICAgfSk7XG5cbiAgICBuZXcgY2RrLkNmbk91dHB1dCh0aGlzLCBcInVzZXJQb29sQ2xpZW50SWRcIiwge1xuICAgICAgdmFsdWU6IHVzZXJQb29sQ2xpZW50LnVzZXJQb29sQ2xpZW50SWRcbiAgICB9KTtcblxuICAgIG5ldyBjZGsuQ2ZuT3V0cHV0KHRoaXMsIFwidXNlclBvb2xJZFwiLCB7XG4gICAgICB2YWx1ZTogdXNlclBvb2wudXNlclBvb2xJZFxuICAgIH0pO1xuXG4gICAgbmV3IGNkay5DZm5PdXRwdXQodGhpcywgXCJ1c2VyUG9vbFByb3ZpZGVyVXJsXCIsIHtcbiAgICAgIHZhbHVlOiB1c2VyUG9vbC51c2VyUG9vbFByb3ZpZGVyVXJsXG4gICAgfSk7XG5cblxuICAgIFxuXG5cbiAgICAvLyBsaWIvYXBwc3luYy1jZGstYXBwLXN0YWNrLnRzXG4gICAgY29uc3QgZGVhbWJ1bGFuZExhbWJkYSA9IG5ldyBsYW1iZGEuRnVuY3Rpb24odGhpcywgJ0RlYW1idWxhbmRIYW5kbGVyJywge1xuICAgICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMTJfWCxcbiAgICAgICAgaGFuZGxlcjogJ21haW4uaGFuZGxlcicsXG4gICAgICAgIGNvZGU6IGxhbWJkYS5Db2RlLmZyb21Bc3NldCgnbGFtYmRhLWZucycpLFxuICAgICAgICBtZW1vcnlTaXplOiAxMDI0XG4gICAgfSk7XG5cbiAgICAvLyBTZXQgdGhlIG5ldyBMYW1iZGEgZnVuY3Rpb24gYXMgYSBkYXRhIHNvdXJjZSBmb3IgdGhlIEFwcFN5bmMgQVBJXG4gICAgY29uc3QgbGFtYmRhRHMgPSBhcGkuYWRkTGFtYmRhRGF0YVNvdXJjZSgnbGFtYmRhRGF0YXNvdXJjZScsIGRlYW1idWxhbmRMYW1iZGEpO1xuXG4gICAgbGFtYmRhRHMuY3JlYXRlUmVzb2x2ZXIoe1xuICAgICAgICB0eXBlTmFtZTogXCJRdWVyeVwiLFxuICAgICAgICBmaWVsZE5hbWU6IFwiZ2V0RWFzdGVyRWdnQnlJZFwiXG4gICAgfSk7XG5cbiAgICBsYW1iZGFEcy5jcmVhdGVSZXNvbHZlcih7XG4gICAgICAgIHR5cGVOYW1lOiBcIlF1ZXJ5XCIsXG4gICAgICAgIGZpZWxkTmFtZTogXCJsaXN0RWFzdGVyRWdnc1wiXG4gICAgfSk7XG5cbiAgICBsYW1iZGFEcy5jcmVhdGVSZXNvbHZlcih7XG4gICAgICAgIHR5cGVOYW1lOiBcIk11dGF0aW9uXCIsXG4gICAgICAgIGZpZWxkTmFtZTogXCJjcmVhdGVFYXN0ZXJFZ2dcIlxuICAgIH0pO1xuXG4gICAgbGFtYmRhRHMuY3JlYXRlUmVzb2x2ZXIoe1xuICAgICAgICB0eXBlTmFtZTogXCJNdXRhdGlvblwiLFxuICAgICAgICBmaWVsZE5hbWU6IFwiZGVsZXRlRWFzdGVyRWdnXCJcbiAgICB9KTtcblxuICAgIGxhbWJkYURzLmNyZWF0ZVJlc29sdmVyKHtcbiAgICAgICAgdHlwZU5hbWU6IFwiTXV0YXRpb25cIixcbiAgICAgICAgZmllbGROYW1lOiBcInVwZGF0ZUVhc3RlckVnZ1wiXG4gICAgfSk7XG5cbiAgICBjb25zdCBkZWFtYnVsYW5kVGFibGUgPSBuZXcgZGRiLlRhYmxlKHRoaXMsICdDREtFYXN0ZXJFZ2dzVGFibGUnLCB7XG4gICAgICAgIGJpbGxpbmdNb2RlOiBkZGIuQmlsbGluZ01vZGUuUEFZX1BFUl9SRVFVRVNULFxuICAgICAgICBzb3J0S2V5OiB7XG4gICAgICAgICAgICBuYW1lOiAnaWQnLFxuICAgICAgICAgICAgdHlwZTogZGRiLkF0dHJpYnV0ZVR5cGUuU1RSSU5HLFxuICAgICAgICB9LFxuICAgICAgICBwYXJ0aXRpb25LZXk6IHtcbiAgICAgICAgICAgIG5hbWU6ICdhdXRob3JJZCcsXG4gICAgICAgICAgICB0eXBlOiBkZGIuQXR0cmlidXRlVHlwZS5TVFJJTkcsXG4gICAgICAgIH0sXG4gICAgfSk7XG4gICAgLy8gZW5hYmxlIHRoZSBMYW1iZGEgZnVuY3Rpb24gdG8gYWNjZXNzIHRoZSBEeW5hbW9EQiB0YWJsZSAodXNpbmcgSUFNKVxuICAgIGRlYW1idWxhbmRUYWJsZS5ncmFudEZ1bGxBY2Nlc3MoZGVhbWJ1bGFuZExhbWJkYSlcblxuICAgIC8vIENyZWF0ZSBhbiBlbnZpcm9ubWVudCB2YXJpYWJsZSB0aGF0IHdlIHdpbGwgdXNlIGluIHRoZSBmdW5jdGlvbiBjb2RlXG4gICAgZGVhbWJ1bGFuZExhbWJkYS5hZGRFbnZpcm9ubWVudCgnRUFTVEVSX0VHR1NfVEFCTEUnLCBkZWFtYnVsYW5kVGFibGUudGFibGVOYW1lKTtcblxuXG5cbiAgfVxufVxuIl19