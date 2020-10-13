import AWS from 'aws-sdk';
import commonMid from '../helper/CommonMid';
import createError from 'http-errors';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function getAuction(event, context) {
 let auction;
 const {id} = event.pathParameters;

 try{
  const res = await dynamodb.get({
    TableName: process.env.AUCTIONS_TABLE_NAME,
    Key: {id}
  }).promise();

  auction = res.Item;
 }catch(err){
    console.error(err);
    throw new createError.InternalServerError(err);
 }

  if(!auction){
    throw new createError.NotFound(`Auction with ${id} not found!`);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(auction),
  };
}

export const handler = commonMid(getAuction);
