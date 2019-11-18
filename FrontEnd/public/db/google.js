


async function googleLogin() {

  const googleUrl = "http://localhost:3000/googleToken";
  // const googleUrl = "http://localhost:3000/auth/google";
  // const result = window.location.assign("http://localhost:3000/googleToken");
  // console.log(result);
  const result = await axios.get(googleUrl)
    .catch(err => {
      console.log(err);
    });

  console.log(result);
}