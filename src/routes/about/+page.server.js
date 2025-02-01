
import {getAbout} from "$lib/server/markdown.server.js";

export async function load ({ params }) {
	console.log(getAbout)
	const content = await getAbout();	
	console.log("content from backend",content);
	return  {content}
}
