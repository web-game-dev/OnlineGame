function validate (input) {
  if($(input).attr('type') == 'email' || $(input).attr('name') == 'email') {
    if($(input).val().trim().match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) == null) {
      showValidate(input);
      return false;
    }
  }
  else {
    if($(input).val().trim() == ''){
      showValidate(input);
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
  let validName = false;
  let validEmail = false;
  let validPassword = false;


  const nameValidate = document.getElementById("name");
  if (!nameValidate.value) {
    validName = false;
    showValidate(nameValidate);
  }
  
  if (validate(nameValidate)) {
    validName = true;
    const name = document.getElementById("name").value;
    data.name = name;
  }

  const emailValidate = document.getElementById("email");
  if (!emailValidate.value) {
    validEmail = false;
    showValidate(emailValidate);
  }

  if (validate(emailValidate)) {
    validEmail = true;
    const email = document.getElementById("email").value;
    data.email = email;
  }

  const passwordValidate = document.getElementById("password");
  if (!passwordValidate.value) {
    validPassword = false;
    showValidate(passwordValidate);
  }
  if (validate(passwordValidate)) {
    validPassword = true;
    const password = document.getElementById("password").value;
    data.password = password;
  }

  registrationUrl = "https://dungeon-crawler-back-end.herokuapp.com/auth/register";
  redirectUrl = "https://dungeon-crawler-98765.herokuapp.com/demo";
  
  if (validName && validEmail && validPassword) {
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
