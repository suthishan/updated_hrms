const axios = require('axios');
const qs = require('querystring');

class MessageSendException extends Error {
    constructor(message, cause) {
        super(message);
        this.name = 'MessageSendException';
        this.cause = cause;
    }
}

const SMS_CONFIG = {
    PROVIDER_URL: "https://ultronsms.com/api/mt/SendSMS",
    API_KEY: "MVWDGkq6RkmvxQs1ay35AA",
    SENDER_ID: "Japfac",
    CHANNEL: "Trans",
    DCS: 0,
    FLASH_SMS: 0,
    ROUTE: 2,
    PEID: "1301159714918918088",
    DLT_TEMPLATE_ID: "1707177139363215741",
    MESSAGE_TEMPLATE: "Dear User,Your OTP for login to the Japfa Intranet Portal is %s.Please do not share this OTP with anyone.- Japfa Comfeed India Pvt Ltd"
};

async function sendUltronSMS(phoneNumber, otp) {
    try {
        if (!phoneNumber || !otp) {
            throw new Error("Phone number and OTP are required.");
        }

        const formattedNo = phoneNumber.replace("+", "").trim();
        const message = SMS_CONFIG.MESSAGE_TEMPLATE.replace("%s", otp);

        const queryParams = {
            APIKey: SMS_CONFIG.API_KEY,
            senderid: SMS_CONFIG.SENDER_ID,
            channel: SMS_CONFIG.CHANNEL,
            DCS: SMS_CONFIG.DCS,
            flashsms: SMS_CONFIG.FLASH_SMS,
            number: formattedNo,
            text: message,
            route: SMS_CONFIG.ROUTE,
            peid: SMS_CONFIG.PEID,
            DLTTemplateId: SMS_CONFIG.DLT_TEMPLATE_ID
        };

        const finalUrl = `${SMS_CONFIG.PROVIDER_URL}?${qs.stringify(queryParams)}`;
        console.info(finalUrl)
        const response = await axios.get(finalUrl, {
            timeout: 10000
        });

        if (response.status >= 200 && response.status < 300) {
            console.info(`OTP sent successfully to: ${phoneNumber} | Status: ${response.status}`);
            return true;
        } else {
            console.error(`Failed to send OTP to: ${phoneNumber} | Status: ${response.status}`);
            return false;
        }

    } catch (error) {
        console.error("Error sending OTP:", error.message);
        throw new MessageSendException(
            "Something went wrong while sending OTP via Ultronsms",
            error
        );
    }
}

module.exports = { sendUltronSMS };
