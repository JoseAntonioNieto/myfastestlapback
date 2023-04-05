import { OAuth2Client } from "google-auth-library";

export async function verify(token) {
    const client = new OAuth2Client('626104102087-raim7uq02tefr5djn5sppq38ka3ksihr.apps.googleusercontent.com');
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: '626104102087-raim7uq02tefr5djn5sppq38ka3ksihr.apps.googleusercontent.com',
    });
    const payload = ticket.getPayload();
    return payload;
}

export async function getId(token) {
    const client = new OAuth2Client('626104102087-raim7uq02tefr5djn5sppq38ka3ksihr.apps.googleusercontent.com');
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: '626104102087-raim7uq02tefr5djn5sppq38ka3ksihr.apps.googleusercontent.com',
    });
    const payload = ticket.getUserId();
    return payload;
}