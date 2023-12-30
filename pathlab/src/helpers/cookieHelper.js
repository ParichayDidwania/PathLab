import Cookies from 'universal-cookie';

class CookieHelper {
    static __cookies;

    static init() {
        CookieHelper.__cookies = new Cookies(null, { path: '/' });
    }

    static set(key, value) {
        CookieHelper.__cookies.set(key, value);
    }

    static get(key) {
        return CookieHelper.__cookies.get(key);
    }

    static remove(key) {
        CookieHelper.__cookies.remove(key, { path: '/' });
    }
}

export default CookieHelper;