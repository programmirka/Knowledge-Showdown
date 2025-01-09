import LocalStorage from "../services/LocalStorage";

function checkPermission(id) {
  let check = false;
  if (LocalStorage.getUser()) {
    for (const perm of LocalStorage.getUser().permissions) {
      if (perm.per_id === id) {
        check = true;
      }
    }
    return check;
  }
}

export default {
  checkPermission,
};
