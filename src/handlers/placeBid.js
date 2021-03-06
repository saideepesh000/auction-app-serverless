import AWS from 'aws-sdk';
import commonMiddleware from '../helper/commonMid';
import validator from '@middy/validator';
import createError from 'http-errors';
import placeBitSchema from '../helper/schema/placeBitSchema';


import {getAuctionById} from './getAuction';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function placeBid(event, context) {
  const { id } = event.pathParameters;
  const { amount } = event.body;

  if(auction.status !==  'OPEN'){
    throw new createError.Forbidden('You can redeploy on CLOSED funs');
  }

  const auction = await getAuctionById(id);
  if (amount <= auction.highestBid.amount){
    throw new createError.Forbidden(`Bid id must be > ${auction.highestBid.amount}`);
  }

  const params = {
    TableName: process.env.AUCTIONS_TABLE_NAME,
    Key: { id },
    UpdateExpression: 'set highestBid.amount = :amount',
    ExpressionAttributeValues: {
      ':amount': amount,
    },
    ReturnValues: 'ALL_NEW',
  };

  let updatedAuction;

  try {
    const result = await dynamodb.update(params).promise();
    updatedAuction = result.Attributes;
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(updatedAuction),
  };
}

export const handler = commonMiddleware(placeBid)
  .use(validator({ inputSchema: placeBitSchema}));