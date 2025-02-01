import {join} from "path";
import { readFileSync } from 'fs';

export const coverPath = join(process.cwd(), "src/lib/books");
export function getBookMetadata(){
    console.log("getting book Metadata!");
    const data = JSON.parse(readFileSync(`${coverPath}/metadata.json`))
    console.log("Metadata: ", data);
return data

}

export function getBookCover(title, coverImage) {
    console.log("getting the cover!", title);
    if (!title || !coverImage) {
        console.log('failed to find cover image')
        return '/images/books/default-cover.jpg';
    }
    return `/images/bookcovers/${coverImage}`;
}
