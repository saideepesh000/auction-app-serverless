import {v4 as uuid} from 'uuid';
import AWS from 'aws-sdk';
import commonMid from '../helper/CommonMid';
import createError from 'http-errors';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function createAuction(event, context) {
  const {title} = event.body;
  const createdTime = new Date();
  const endDate = new Date();
  endDate.setHours(createdTime.getHours()+1);

  const auction = {
	id: uuid(),
	title,
	status: 'OPEN',
	createdAt: createdTime.toISOString(),
  endingAt: endDate.toISOString(),
  highestBid: {
    amount: 0,
    },
  };

try{
  await dynamodb.put({
  TableName: process.env.AUCTIONS_TABLE_NAME,
  Item: auction
  }).promise();
} catch(err){
  console.log(err);
  throw new createError.InternalServerError(err);
}


  return {
    statusCode: 201,
    body: JSON.stringify(auction),
  };
}

export const handler = commonMid(createAuction);
