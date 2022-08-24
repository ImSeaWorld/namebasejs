class Auth {
    /**
     * Auction constructor
     * @param {NameBase} namebase Namebase instance
     */
    constructor(namebase) {
        this.nb = namebase;
    }

    /**
     * Start session using email and password
     * @param {string} email
     * @param {string} password
     * @param {string} token 2FA Token
     */
    login(email, password, token = '') {
        return new Promise((resolve, reject) => {
            this.nb
                .request('auth/local/account-login', 'POST', {
                    email,
                    password,
                    token,
                })
                .then((res) => {
                    if (res.headers['set-cookie']) {
                        for (var key in res.headers['set-cookie']) {
                            if (
                                res.headers['set-cookie'][key].indexOf(
                                    'namebase-main',
                                ) > -1
                            ) {
                                this._auth.session =
                                    res.headers['set-cookie'][key].split(
                                        ' ',
                                    )[0];
                            }
                        }
                    }
                    resolve({
                        ...res,
                        session: this._auth.session,
                    });
                })
                .catch(reject);
        });
    }

    /**
     * Logs out the current session
     * @returns {AxiosPromise} AxiosPromise
     */
    logout() {
        return this.nb.request('auth/logout', 'POST');
    }

    /**
     * API Key list
     * @returns {AxiosPromise} AxiosPromise
     */
    apiKeys() {
        return this.nb.request('auth/keys', 'GET');
    }

    /**
     * Create an API key
     * @param {string} name API Key name
     * @returns {AxiosPromise} AxiosPromise
     */
    apiKeyCreate(name) {
        return this.nb.request('auth/logout', 'POST', { name });
    }

    /**
     * Delete a specified API key
     * @param {string} accessKey
     * @returns {AxiosPromise} AxiosPromise
     */
    apiKeyDelete(accessKey) {
        return this.nb.request('auth/key', 'DELETE', { accessKey });
    }
}

export default Auth;
