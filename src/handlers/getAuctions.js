import AWS from 'aws-sdk';
import commonMid from '../helper/CommonMid';
import createError from 'http-errors';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function getAuctions(event, context) {
  const {status} = event.queryStringParameters;
  let auctions;

  const params ={
  TableName: process.env.AUCTIONS_TABLE_NAME,
  IndexName: 'statusAndEndDate',
  KeyConditionExpression:'#status = :status',
  ExpressionAttributeValues: {
    ':status': status,
  },
  ExpressionAttributeNames:{
    '#status':'status',
  },
};
  try{
    const res = await dynamodb.query(params).promise();

    auctions = res.Items;
  }catch(err){
    console.error(err);
    throw new createError.InternalServerError(err);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(auctions),
  };
}

export const handler = commonMid(getAuctions);
