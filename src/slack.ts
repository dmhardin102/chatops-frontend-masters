import type { Handler } from '@netlify/functions';

import { parse } from 'querystring';
import { slackApi, verifySlackRequest } from './util/slack';

async function handleSlashCommand(payload: SlackSlashCommandPayload) {
	switch (payload.command) {
		case '/foodfight':
			const joke = await fetch('http://icanhazdadjoke.com', {
				headers: {accept: 'text/plain'}
			})
			const response = await slackApi('chat.postMessage', {
				channel: payload.channel_id,
				text: await joke.text(),
			})
			if (!response.ok){
				console.log(response);
			}

			break;

			default:
				return {
					statusCode: 200,
					body: `Command ${payload.command} is not recognized`,
				}
	}

	return{
		statusCode: 200,
		body: ``,
	};
}

export const handler: Handler = async (event) => {
	const valid = verifySlackRequest(event);
	console.log(valid);
	console.log(event);
	if (!valid) {
		console.error('invalid request');

		return {
			statusCode: 400,
			body: 'invalid request',
		};
	}

	const body = parse(event.body ?? '') as SlackPayload;
	if (body.command) {
		return handleSlashCommand(body as SlackSlashCommandPayload);
	}
	// TODO handle interactivity (e.g. context commands, modals)

	return {
		statusCode: 200,
		body: 'TODO: handle Slack commands and interactivity. Herro Jackie!',
	};
};
