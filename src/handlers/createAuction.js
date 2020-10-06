async function createAuction(event, context) {
  const {title} = JSON.parse(event.body);
  const createdTime = new Date();

  const auction = {
	title,
	status: 'OPEN',
	createdAt: createdTime.toISOString(),
  };

  return {
    statusCode: 201,
    body: JSON.stringify(auction),
  };
}

export const handler = createAuction;


