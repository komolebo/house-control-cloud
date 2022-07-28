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
