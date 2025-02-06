This repo contains a solution for the Fetch Receipt Processor take home exercise.

To create a web service, I used Express.js to set up a Node.js web server.

This server is listening on port 3000 for incoming requests to two endpoints: /receipts/process and /receipts/:id/points.

If a JSON object that meets the schema for a receipt is received as the payload for a POST request to the //receipts/process endpoint, then we use a JavaScript object to create a key/value pair, with the key being the hash of the JSON and the value being the JSON itself.

If an ID that matches a key in the JavaScript object is received at the /receipts/:id/points, we run a calculatePoints() function to determine how may points to award.

Unit tests for the endpoints can be found in the app.test.js file. These can be run using the jest utility.
