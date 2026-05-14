import { post } from "./api";
import type { ContactFormData } from "../schemas/contact.schema";
export const sendContactForm = (data: ContactFormData) => {
    return post("/contact/send/", data, {skipAuth: true, includeCredentials: false})
}
