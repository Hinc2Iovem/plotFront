export function generateMongoObjectId() {
  const timestamp = Math.floor(new Date().getTime() / 1000).toString(16); // 4-byte timestamp
  const randomValue = Math.random().toString(16).substr(2, 10); // 5-byte random value
  const counter = Math.floor(Math.random() * 0xffffff)
    .toString(16)
    .padStart(6, "0"); // 3-byte counter

  return (timestamp + randomValue + counter).toLowerCase();
}
