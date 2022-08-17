import {host} from "./index"

export async function register(login: string,
                               password: string,
                               email: string,
                               name: string) {
    return await host.post('auth/signup', {
        email: email,
        password: password,
        full_name: name,
        login: login
    });
}

export async function login(email: string, password: string) {
    return await host.post('auth/login', {
        login: email,
        password: password
    });
}

export function nestPostForgotPassword(email: string) {
    return host.post ("auth/forgot/", {
        email: email
    })
}

export function nestGetTokenExist(token: string) {
    return host.post ("auth/isToken/", {
        token: token
    })
}

export function nestPostChangePassword(token: string, password: string) {
    return host.patch ("auth/change/", {
        token: token,
        password: password
    })
}

export function nestPostIsPendingActivation(email: string) {
    return host.post("auth/pending_activation", {
        email: email
    })
}

export function nestPostActivateAccount(token: string) {
    return host.post("auth/activate", {
        token: token
    })
}

export function nestPostResendEmail(email: string) {
    return host.post("auth/resend", {
        email: email
    })
}