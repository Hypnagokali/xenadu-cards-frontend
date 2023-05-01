const deserialize = function (data, classType) {
  if (data instanceof Object && data.hasOwnProperty('length')) {
    // List of objects
    const result = [];
    for (let obj of data) {
      const instance = new classType();

      for (let attr in obj) {
        if (instance.hasOwnProperty(attr)) {
          instance[attr] = obj[attr];
        }
      }

      result.push(instance);
    }

    return result;
  }

  if (data instanceof Object) {
    // single object
    const instance = new classType();
    for (let attr in data) {
      if (instance.hasOwnProperty(attr)) {
        instance[attr] = data[attr];
      }
    }

    return instance;
  }

  throw new Error('Could not deserialize datastructure');
};

const extractResponse = function (axiosReq, classType) {
  return new Promise((resolve, reject) => {
    axiosReq
      .then((res) => {
        if (classType) {
          resolve(deserialize(res.data, classType));
        } else {
          resolve(res.data);
        }
      })
      .catch((e) => reject(e));
  });
};

export { extractResponse };
