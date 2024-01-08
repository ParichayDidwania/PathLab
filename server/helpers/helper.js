class HelperClass {
    static generateRandomString(length) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        let counter = 0;
        while (counter < length) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
          counter += 1;
        }
        return result;
    }

    static isNullOrEmptyString(str) {
      str = str.toString();
      return !str || str.trim() === '';
    }

    static isNullOrEmptyObject(obj, fields) {
      if(!fields || fields.length === 0) {
        return !obj || Object.keys(obj).length === 0;
      } else {
        if(!obj || Object.keys(obj).length === 0) {
          return true;
        }

        for(const field of fields) {
          if(HelperClass.isNullOrEmptyString(obj[field])) {
            return true;
          }
        }
      }
    }

    static isNullOrEmptyArrayOfObjects(arr, fields) {
      if(!arr || arr.length === 0) {
        return true;
      }

      for(const obj of arr) {
        if(HelperClass.isNullOrEmptyObject(obj, fields)) {
          return true;
        }
      }
    }
}

module.exports = HelperClass;