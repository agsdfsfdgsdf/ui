function formatDate(time) {
  const now = new Date(time);
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const date = now.getDate();
  const hour = now.getHours();
  const minute = now.getMinutes();
  const second = now.getSeconds();
  return (
    year +
    '-' +
    (month < 10 ? '0' + month : month) +
    '-' +
    (date < 10 ? '0' + date : date) +
    ' ' +
    (hour < 10 ? '0' + hour : hour) +
    ':' +
    (minute < 10 ? '0' + minute : minute) +
    ':' +
    (second < 10 ? '0' + second : second)
  );
}

export { formatDate };
