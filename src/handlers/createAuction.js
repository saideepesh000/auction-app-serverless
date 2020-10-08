import {v4 as uuid} from 'uuid';
import AWS from 'aws-sdk';

const dynamodb = new AWS.Dynamodb.DocumentClient();

async function createAuction(event, context) {
  const {title} = JSON.parse(event.body);
  const createdTime = new Date();

  const auction = {
	id: uuid(),
	title,
	status: 'OPEN',
	createdAt: createdTime.toISOString(),
  };

  await dynamodb.put({
	TableName: 'AuctionsTable',
	Item: auction
  }).promise();

  return {
    statusCode: 201,
    body: JSON.stringify(auction),
  };
}

export const handler = createAuction;

