import { randomBytes } from "crypto";

const randomString = (length) => {
    return randomBytes(length).toString('hex');
};
//https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript


export default randomString 