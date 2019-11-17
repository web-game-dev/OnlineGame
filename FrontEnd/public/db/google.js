


async function google() {

  googleUrl = "https://dungeon-crawler-back-end.herokuapp.com/auth/google";

  const result = await axios.get(googleUrl);
  console.log(result);
}