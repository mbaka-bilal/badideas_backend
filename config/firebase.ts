import { cert, initializeApp } from "firebase-admin/app";


export const app = initializeApp({
    credential: cert("servicekey.json"),
});
