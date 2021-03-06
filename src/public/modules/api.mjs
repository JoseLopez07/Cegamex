class ApiRequestError extends Error {
    constructor(status, ...rest) {
        super(rest);
        this.status = status;
    }
}

// API client singleton
class ApiClient {
    constructor() {
        if (ApiClient._instance) {
            return ApiClient._instance;
        }
        ApiClient._instance = this;
    }

    async _apiRequest(
        uri,
        method,
        data = null,
        { tryRefreshingTokens = true, credentials = 'omit' } = {}
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
                this._apiRequest(uri, method, data, {
                    tryRefreshingTokens: false,
                })
            );
        }

        // something wrong
        if (!response.ok) {
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
        return this._apiRequest('/api/v1/auth', 'GET');
    }

    async logIn(email, password, rememberMe = false) {
        const response = await this._apiRequest(
            '/api/v1/auth/login',
            'POST',
            {
                email,
                password,
                rememberMe,
            },
            {
                credentials: 'include',
            }
        );
        this.token = (await response.json()).access_token;
    }

    async refreshTokens() {
        const response = await this._apiRequest(
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
        return this._apiRequest('/api/v1/auth/logout', 'GET', null, {
            credentials: 'include',
        });
    }

    async register(userData) {
        return this._apiRequest('/api/v1/users', 'POST', userData);
    }
    
    async getTopUserData() {
        return this._apiRequest('/api/v1/users/top','GET');
    }

    // must be an admin to specify user id
    async modifyUserData(userId = null, userData) {
        return this._apiRequest(
            `/api/v1/users/${userId || ''}`,
            'PUT',
            userData
        );
    }

    // must be an admin to specify user id
    async deleteUser(userId = null) {
        return this._apiRequest(`/api/v1/users/${userId || ''}`, 'DELETE');
    }

    // must be an admin to specify user id
    async getUserAdmin(userId = null) {
        return this._apiRequest(`/api/v1/users/admins/${userId || ''}`, 'GET');
    }

    // must be an admin to send request
    async setUserAdmin(userId, admData) {
        return this._apiRequest(
            `/api/v1/users/admins/${userId}`,
            'PUT',
            admData
        );
    }

    // if userIds specified, response is an array, otherwise returns a single
    // object with user's own info
    // using userName has precedence over ids, which also returns an object
    async getUserData(userIds = null, userName = null) {
        return this._apiRequest(
            formatQuery('/api/v1/users', {
                userIds: userIds && userIds.join(),
                userName,
            }),
            'GET'
        );
    }

    // defaults to getting your own
    async getPetData(userId = null) {
        return this._apiRequest(
            formatQuery('/api/v1/users/pets', { userId }),
            'GET'
        );
    }

    async modifyPetData(petData) {
        return this._apiRequest('/api/v1/users/pets', 'POST', petData);
    }

    async getCountFechasIssues() {
        //
        return this._apiRequest(`/api/v1/jira/issues/dates`, 'GET');
    }

    // defaults to getting your own
    async getAchievements(userId = null) {
        return this._apiRequest(
            formatQuery('/api/v1/users/achievements', { userId }),
            'GET'
        );
    }

    // defaults to getting your own
    async getFriends(userId = null) {
        return this._apiRequest(
            formatQuery('/api/v1/users/friends', { userId }),
            'GET'
        );
    }

    async isUserFriend(userId) {
        return this._apiRequest(`/api/v1/users/friends/${userId}`, 'GET');
    }

    async addFriend(userId) {
        return this._apiRequest('/api/v1/users/friends', 'POST', { userId });
    }

    async removeFriend(userId) {
        return this._apiRequest(`/api/v1/users/friends/${userId}`, 'DELETE');
    }
}

function omitNull(obj) {
    return Object.fromEntries(
        Object.entries(obj).filter(([_, v]) => v != null)
    );
}

function formatQuery(path, params) {
    return `${path}?${new URLSearchParams(omitNull(params)).toString()}`;
}

export default { ApiRequestError, ApiClient };
