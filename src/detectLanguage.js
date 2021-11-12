const { ComprehendClient, DetectDominantLanguageCommand }  = require("@aws-sdk/client-comprehend");

const client = new ComprehendClient({});
const command = new DetectDominantLanguageCommand({ Text: 'zhe yang zhen hao' });
client.send(command).then(() => {
    console.log("got response")
})

// Uncaught:
// UnrecognizedClientException: The security token included in the request is invalid.
//     at deserializeAws_json1_1DetectDominantLanguageCommandError (/Users/jcoyne85/workspace/ld4p/sinopia_editor/node_modules/@aws-sdk/client-comprehend/dist-cjs/protocols/Aws_json1_1.js:2572:41)
//     at processTicksAndRejections (node:internal/process/task_queues:96:5)
//     at async /Users/jcoyne85/workspace/ld4p/sinopia_editor/node_modules/@aws-sdk/client-comprehend/node_modules/@aws-sdk/middleware-serde/dist-cjs/deserializerMiddleware.js:6:20
//     at async /Users/jcoyne85/workspace/ld4p/sinopia_editor/node_modules/@aws-sdk/client-comprehend/node_modules/@aws-sdk/middleware-signing/dist-cjs/middleware.js:11:20
//     at async StandardRetryStrategy.retry (/Users/jcoyne85/workspace/ld4p/sinopia_editor/node_modules/@aws-sdk/client-comprehend/node_modules/@aws-sdk/middleware-retry/dist-cjs/StandardRetryStrategy.js:51:46)
//     at async /Users/jcoyne85/workspace/ld4p/sinopia_editor/node_modules/@aws-sdk/client-comprehend/node_modules/@aws-sdk/middleware-logger/dist-cjs/loggerMiddleware.js:6:22
//     at async REPL4:1:47 {
//   __type: 'UnrecognizedClientException',
//   '$fault': 'client',
//   '$metadata': {
//     httpStatusCode: 400,
//     requestId: 'c13f791b-7bcd-4b2b-b1f7-ed0ef18560df',
//     extendedRequestId: undefined,
//     cfId: undefined,
//     attempts: 1,
//     totalRetryDelay: 0
//   }
// }