import {host} from "./index"

export async function register(email: string, password: string) {
    return await host.post('auth/signup', {
        email: email,
        password: password
    });
}

export async function login(email: string, password: string) {
    return await host.post('auth/login', {
        email: email,
        password: password
    });
}

