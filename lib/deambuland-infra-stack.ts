import * as cdk from '@aws-cdk/core';
import * as amplify from "@aws-cdk/aws-amplify";
import * as appsync from '@aws-cdk/aws-appsync';
import * as ddb from '@aws-cdk/aws-dynamodb';
import * as lambda from '@aws-cdk/aws-lambda';

export class DeambulandInfraStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
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
    deambulandTable.grantFullAccess(deambulandLambda)

    // Create an environment variable that we will use in the function code
    deambulandLambda.addEnvironment('EASTER_EGGS_TABLE', deambulandTable.tableName);
  }
}
