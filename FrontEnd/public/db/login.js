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

async function loginUser() {
  const data = {};
  let validEmail = false;
  let validPassword = false;

  const emailValidate = document.getElementById("loginEmail");
  if (!emailValidate.value) {
    validEmail = false;
    showValidate(emailValidate);
  }

  if (validate(emailValidate)) {
    validEmail = true;
    const email = document.getElementById("loginEmail").value;
    data.email = email;
  }

  const passwordValidate = document.getElementById("loginPassword");
  if (!passwordValidate.value) {
    validPassword = false;
    showValidate(passwordValidate);
  }
  if (validate(passwordValidate)) {
    validPassword = true;
    const password = document.getElementById("loginPassword").value;
    data.password = password;
  }

  loginUrl = "https://dungeon-crawler-back-end.herokuapp.com/auth/login";
  redirectUrl = "https://dungeon-crawler-98765.herokuapp.com/demo";
  
  if (validEmail && validPassword) {
    await axios.post(loginUrl, data)
      .then((res) => {
        const token = res.data;
        window.location.replace(redirectUrl);
      })
      .catch(err => {
        alert("Invalid email or Password");
      });
  }
}

