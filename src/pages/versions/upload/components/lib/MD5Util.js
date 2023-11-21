import SparkMD5 from 'spark-md5';

export async function ContentMD5(file, progress) {
  return new Promise((resolve, reject) => {
    const chunkSize = 5 * 1024 * 1024;
    let promise = Promise.resolve();
    for (let index = 0; index < file.size; index += chunkSize) {
      promise = promise.then(() => hashBlob(file.slice(index, index + chunkSize)));
      console.log(index, index + chunkSize);
    }
    let count = 0;
    const md5 = new SparkMD5();

    function hashBlob(blob) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = ({ target }) => {
          md5.appendBinary(target.result);
          count += 1;
          resolve();
        };
        reader.onerror = function (event) {
          reject(event);
        };
        reader.onprogress = function (event) {
          if (event) {
            // eslint-disable-next-line no-param-reassign
            const pro = Math.ceil(((event.loaded + count * chunkSize) * 100) / file.size);
            progress && progress(pro);
          }
        };
        reader.readAsBinaryString(blob);
      });
    }

    promise
      .then(async () => {
        const conMd5 = md5.end();
        resolve({ conMd5 });
      })
      .catch(() => {
        reject();
      });
  });
}
