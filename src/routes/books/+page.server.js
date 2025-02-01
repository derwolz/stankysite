import {getBookMetadata, getBookCover} from "$lib/server/bookCover.server.js";

export async function load ({ params }) {
	const metadata = getBookMetadata();
	let books;
	console.log("loading book covers");
	metadata.forEach( (item, key) => {
		console.log("found item and key: ", item, key);
		metadata[key].image = getBookCover(item.title, item.coverImage);
	})
		console.log("metadata: ", metadata);
	
	return  {books: await metadata}
}
