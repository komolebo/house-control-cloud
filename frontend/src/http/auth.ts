import {host} from "./index"

export async function register(email: string, password: string, name: string) {
    return await host.post('auth/signup', {
        email: email,
        password: password,
        name: name
    });
}

export async function login(email: string, password: string) {
    return await host.post('auth/login', {
        login: email,
        password: password
    });
}
