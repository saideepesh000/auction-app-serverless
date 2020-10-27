import {getEndedAuctions} from '../helper/getEndedAuctions';

async function processAuctions(event, context){
	const auctionsToClose = await getEndedAuctions();
	console.log(auctionsToClose);
}

export const handler = processAuctions;