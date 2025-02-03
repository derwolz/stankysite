
import {getAbout} from "$lib/server/markdown.server.js";

export async function load ({ params }) {
	const content = await getAbout();	
	return  {content}
}
