function email(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (re.test(String(email).toLowerCase())) {
    return "";
  } else {
    return "Please enter a valid email address";
  }
}
function password(password) {
  let re = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&.])[A-Za-z\d@$!%*#?&.]{8,30}$/;

  //Minimum eight characters, maximum 30 characters, at least one letter, one number and one special character:
  if (re.test(password)) {
    return "";
  } else {
    return "8-30 chars with a letter, number, and symbol.";
  }
}
function name(name) {
  const re = /^[a-zA-Z0-9-' ]+$/;
  //only contains letters, numbers, spaces, hyphens, and apostrophes,
  if (re.test(name) && name.length > 1 && name.length <= 30) {
    return "";
  } else {
    return `2-30 chars: letters, numbers, space, ' `;
  }
}
function username(username) {
  const re = /^[a-zA-Z0-9_'\-]{2,15}$/;

  //only contains letters, numbers, spaces, hyphens, and apostrophes,
  if (re.test(username)) {
    return "";
  } else {
    return `2-15 chars: letters, numbers, ', -, _`;
  }
}

//answers 200
//question 500
//category name 50
//category description 400

function about(about) {
  const re = /^[-'A-Za-z0-9 .,:;!@#$%^&*()_+={}[\]|<>/~\\?"'\n]+$/;

  //only contains letters, numbers, spaces, hyphens, and apostrophes,
  if (re.test(about) && about.length < 300) {
    return "";
  } else {
    return "max 300 chars, no spec. chars";
  }
}

function answer(answer) {
  const re = /^[-'A-Za-z0-9 .,:;!@#$%^&*()_+={}[\]|<>/~\\?"'\n]+$/;

  //only contains letters, numbers, spaces, hyphens, and apostrophes,
  if (re.test(answer) && answer.length < 200) {
    return "";
  } else {
    return "Max 200 chars, no spec. chars";
  }
}

function question(question) {
  const re = /^[-'A-Za-z0-9 .,:;!@#$%^&*()_+={}[\]|<>/~\\?"'\n]+$/;

  //only contains letters, numbers, spaces, hyphens, and apostrophes,
  if (re.test(question) && question.length < 200) {
    return "";
  } else {
    return "Max 200 chars, no spec. chars";
  }
}

function cat_name(question) {
  const re = /^[-'A-Za-z0-9 .,:;!@#$%^&*()_+={}[\]|<>/~\\?"'\n]+$/;

  //only contains letters, numbers, spaces, hyphens, and apostrophes,
  if (re.test(question) && question.length < 50) {
    return "";
  } else {
    return "Max 50 chars, no spec. chars";
  }
}

function cat_description(question) {
  const re = /^[-'A-Za-z0-9 .,:;!@#$%^&*()_+={}[\]|<>/~\\?"'\n]+$/;

  //only contains letters, numbers, spaces, hyphens, and apostrophes,
  if (re.test(question) && question.length < 400) {
    return "";
  } else {
    return "Max 400 chars, no spec. chars";
  }
}

function rePassword(password, rePassword) {
  if (password === rePassword) {
    return "";
  } else {
    return "Passwords do not match";
  }
}
export default {
  email,
  password,
  name,
  username,
  rePassword,
  about,
  answer,
  question,
  cat_name,
  cat_description,
};
