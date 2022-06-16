const AUTH_KEY = "JWT"

export function isAuthToken(): boolean {
    const authToken = localStorage.getItem(AUTH_KEY);
    return authToken !== null;
}

export function getAuthToken(): string | null {
    return localStorage.getItem(AUTH_KEY);
}

export function setAuthToken(token: string): void {
    localStorage.setItem(AUTH_KEY, token)
}

export function setNotAuthToken(): void {
    localStorage.removeItem(AUTH_KEY)
}