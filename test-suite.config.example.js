// To use this configuration file, rename it to test-suite.config.js
// and fill it with your own configuration.
// NamebaseJS will expect either a Session, or both a Key(aKey) and Secret(sKey).
// Without these filled out, most tests will fail, other than public endpoints.
import NameBase from './namebasejs/index.js';

export default new NameBase({
    session: '', // Expects a valid session cookie
    aKey: false, // sKey is also needed, expects string
    sKey: false, // aKey is also needed, expects string
});
