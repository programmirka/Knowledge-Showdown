// setuje trenutno ulogovanog usera

function setUser(res) {
  try {
    return localStorage.setItem("loggedInUser", JSON.stringify(res)); //res.data.user umesto res
  } catch (e) {
    console.log(e);
  }
}

//vraca objekat sa informaicjama o auth user-u
function getUser() {
  try {
    let storedUser = localStorage.getItem("loggedInUser");

    return JSON.parse(storedUser);
  } catch (e) {
    console.log(e);
  }
}

//brise usera iz locale storage-a pri logout-u
function removeUser() {
  try {
    localStorage.removeItem("loggedInUser");
    deleteAllCookies();
  } catch (e) {
    console.log(e);
  }
}

//da save-uje na locale storage-u novi username,
//kako bi ostao taj novi a ne stari iz local storage
function setUsername(username) {
  try {
    return localStorage.setItem("username", username);
  } catch (e) {
    console.log(e);
  }
}

//vraca objekat sa informaicjama o auth user-u
function getUsername() {
  try {
    let storedUsername = localStorage.getItem("username");

    return storedUsername;
  } catch (e) {
    console.log(e);
  }
}

function removeUsername() {
  try {
    localStorage.removeItem("username");
  } catch (e) {
    console.log(e);
  }
}

//setuje SID trenutno ulogovanog user-a
function setSid(res) {
  try {
    return localStorage.setItem("sid", JSON.stringify(res));
  } catch (e) {
    console.log(e);
  }
}
//vraca string SID trenutno ulogovanog user-a
function getSid(res) {
  try {
    let sid = localStorage.getItem("sid");

    return JSON.parse(sid);
  } catch (e) {
    console.log(e);
  }
}

function removeSid() {
  try {
    localStorage.removeItem("sid");
  } catch (e) {
    console.log(e);
  }
}

//brise  sve cookies pri logout-u
function deleteAllCookies() {
  const cookies = document.cookie.split(";");

  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i];
    const eqPos = cookie.indexOf("=");
    const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
  }
}

//vraca id trenutno ulogovanog user-a
function id() {
  if (getUser()) {
    let user_id_local = getUser().usr_id;
    return user_id_local;
  } else {
    return;
  }
}

export default {
  setUser,
  getUser,
  removeUser,
  setSid,
  getSid,
  id,
  setUsername,
  getUsername,
  removeSid,
  removeUsername,
};
