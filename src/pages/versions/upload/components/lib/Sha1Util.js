import Sha1 from 'js-sha1';

export async function ContentHash(file, progress) {
  return new Promise((resolve, reject) => {
    const chunkSize = 5 * 1024 * 1024;
    let promise = Promise.resolve();
    for (let index = 0; index < file.size; index += chunkSize) {
      promise = promise.then(() => hashBlob(file.slice(index, index + chunkSize)));
      console.log(index, index + chunkSize);
    }
    let count = 0;
    const hash = Sha1.create();

    function hashBlob(blob) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = ({ target }) => {
          hash.update(target.result);
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
        reader.readAsArrayBuffer(blob);
      });
    }

    promise
      .then(async () => {
        const conHash = hash.hex().toUpperCase();
        resolve({ conHash });
      })
      .catch(() => {
        reject();
      });
  });
}
