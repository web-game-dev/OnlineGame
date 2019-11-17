function validate (input) {
  if($(input).attr('type') == 'email' || $(input).attr('name') == 'email') {
    if($(input).val().trim().match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) == null) {
      return false;
    }
  }
  else {
    if($(input).val().trim() == ''){
      return false;
    }
  }
  return true;
}

function showValidate(input) {
  var thisAlert = $(input).parent();
  $(thisAlert).addClass('alert-validate');
}

async function postUser() {
  const data = {};
  let check = false;

  const nameValidate = document.getElementById("name");
  if (!nameValidate.value) {
    check = false;
    showValidate(nameValidate);
  }
  
  if (validate(nameValidate)) {
    check = true;
    const name = document.getElementById("name").value;
    data.name = name;
  }

  const emailValidate = document.getElementById("email");
  if (!emailValidate.value) {
    check = false;
    showValidate(emailValidate);
  }
  if (validate(emailValidate)) {
    check = true;
    const email = document.getElementById("email").value;
    data.email = email;
  }

  const passwordValidate = document.getElementById("password");
  if (!passwordValidate.value) {
    check = false;
    showValidate(passwordValidate);
  }
  if (validate(passwordValidate)) {
    check = true;
    const password = document.getElementById("password").value;
    data.password = password;
  }

  registrationUrl = "https://dungeon-crawler-back-end.herokuapp.com/auth/register";
  redirectUrl = "https://dungeon-crawler-98765.herokuapp.com/demo";
  
  if (check) {
    await axios.post(registrationUrl, data)
      .then((res) => {
        const token = res.data;
        window.location.replace(redirectUrl);
      })
      .catch(err => {
        alert("Email already exists\nPlease use another email");
      });
  }
}
