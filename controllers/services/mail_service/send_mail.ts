import { createTransport } from "nodemailer";
import Helpers from "../../../utils/helpers";


export default async function sendMail(receiverEmail: string[], subject: string, html: string) {
    try {
        const transporter = createTransport({
            service: "gmail",
            auth: {
                user: "hephcore@gmail.com",
                pass: "kbtg atbv xigd sdyd"
            }
        });
        const info = await transporter.sendMail({
            from: "BadIdeas <hephcore@gmail.com>",
            to: receiverEmail,
            subject: subject,
            html: html,
        });

    } catch (e) {
        Helpers.printAndAddToLog(`${e}`);
        throw e;
    }
}

export { sendMail };