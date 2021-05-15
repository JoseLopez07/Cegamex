class ApiRequestError extends Error {
    constructor(status, ...rest) {
        super(rest);
        this.status = status;
    }
}

// in milliseconds
const RETRY_DELAY = 3000;

// API client singleton
class ApiClient {
    constructor() {
        if (ApiClient._instance) {
            return ApiClient._instance;
        }
        ApiClient._instance = this;
    }

    async apiRequest(
        uri,
        method,
        data = null,
        { tryRefreshingTokens = true, retries = 3, credentials = 'omit' } = {}
    ) {
        const response = await fetch(uri, {
            method: method,
            // mode: 'cors',
            credentials: credentials,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.token || ''}`,
            },
            ...(data === null ? {} : { body: JSON.stringify(data) }),
        });

        // access token is expired, try refreshing
        if (response.status == 401 && tryRefreshingTokens) {
            return this.refreshTokens().then(() =>
                this.apiRequest(uri, method, data, {
                    tryRefreshingTokens: false,
                    retries: retries,
                })
            );
        }

        // something wrong
        if (!response.ok) {
            // client error, no use in retrying
            if (response.status >= 400 && response.status < 500) {
                throw new ApiRequestError(
                    response.status,
                    (await response.json()).error
                );
            }

            // other errors worth retrying
            console.warn(
                `Failed API request with status code ${response.status} (${retries} retries remaining)`
            );
            if (retries > 0) {
                return setTimeout(
                    () =>
                        this.apiRequest(uri, method, data, {
                            tryRefreshingTokens: tryRefreshingTokens,
                            retries: retries - 1,
                        }),
                    RETRY_DELAY
                );
            }

            // all retries used up
            throw new ApiRequestError(
                response.status,
                (await response.json()).error
            );
        }

        // all good
        return response;
    }

    get token() {
        return window.localStorage.getItem('access_token');
    }

    set token(newToken) {
        window.localStorage.setItem('access_token', newToken);
    }

    async checkLoggedIn() {
        return this.apiRequest('/api/v1/auth', 'GET');
    }

    async logIn(email, password) {
        const response = await this.apiRequest('/api/v1/auth/login', 'POST', {
            email: email,
            password: password,
        });
        this.token = (await response.json()).access_token;
    }

    async refreshTokens() {
        const response = await this.apiRequest(
            '/api/v1/auth/refresh',
            'GET',
            null,
            {
                tryRefreshingTokens: false,
                credentials: 'include',
            }
        );
        this.token = (await response.json()).access_token;
    }

    async logOut() {
        this.token = '';
        return this.apiRequest('/api/v1/auth/logout', 'GET');
    }

    async register(userData) {
        return this.apiRequest('/api/v1/users', 'POST', userData);
    }

    // must be an admin to specify user id
    async changeUserInfo(userId = null, userData) {
        return this.apiRequest(
            `/api/v1/users/${userId || ''}`,
            'PUT',
            userData
        );
    }

    // must be an admin to specify user id
    async deleteUser(userId = null) {
        return this.apiRequest(`/api/v1/users/${userId || ''}`, 'DELETE');
    }

    // must be an admin to specify user id
    async getUserAdmin(userId) {
        return this.apiRequest(`/api/v1/users/admins/${userId}`, 'GET');
    }

    // must be an admin to send request
    async setUserAdmin(userId, admData) {
        return this.apiRequest(
            `/api/v1/users/admins/${userId}`,
            'PUT',
            admData
        );
    }
}

export default { ApiRequestError, ApiClient };
