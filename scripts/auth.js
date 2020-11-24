//listening to auth status changes

auth.onAuthStateChanged((user) => {
  if (user) {
    user.getIdTokenResult().then((idTokenResult) => {
      user.admin = idTokenResult.claims.admin;
      setupUI(user);
    });
    console.log(user);
    //get data
    db.collection("guides").onSnapshot(
      (snapshot) => {
        // onsnapshot replaces .get().then for realtime update
        setupGuides(snapshot.docs);
        //setupUI(user);
      },
      (err) => {
        console.log(err.message);
      }
    );
  } else {
    setupGuides([]);
    setupUI();
  }
});

//signup

const signUpForm = document.querySelector("#signup-form");

signUpForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  //get-user-info
  const email = signUpForm["signup-email"].value;
  const password = signUpForm["signup-password"].value;

  //sign up the user
  auth
    .createUserWithEmailAndPassword(email, password)
    .then((cred) => {
      return db
        .collection("users")
        .doc(cred.user.uid)
        .set({
          bio: signUpForm["signup-bio"].value,
        })
        .then(() => {
          const modal = document.querySelector("#modal-signup");
          M.Modal.getInstance(modal).close();
          signUpForm.reset();
          signUpForm.querySelector(".error").innerHTML = "";
        });
    })
    .catch((err) => {
      signUpForm.querySelector(".error").innerHTML = err.message;
    });
});

const logout = document.querySelector("#logout");

logout.addEventListener("click", (evt) => {
  evt.preventDefault();
  auth.signOut();
});

//login the user

const loginForm = document.querySelector("#login-form");

loginForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  const email = loginForm["login-email"].value;
  const password = loginForm["login-password"].value;

  auth
    .signInWithEmailAndPassword(email, password)
    .then((cred) => {
      //console.log(cred.user);
      const modal = document.querySelector("#modal-login");
      M.Modal.getInstance(modal).close();
      loginForm.reset();
      loginForm.querySelector(".error").innerHTML = "";
    })
    .catch((err) => {
      loginForm.querySelector(".error").innerHTML = err.message;
    });
});

//create a guide

const createForm = document.querySelector("#create-form");

createForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  const guideTitle = createForm["title"].value;
  const guideContent = createForm["content"].value;

  db.collection("guides")
    .add({
      title: guideTitle,
      content: guideContent,
    })
    .then(() => {
      const modal = document.querySelector("#modal-create");
      M.Modal.getInstance(modal).close();
      createForm.reset();
    })
    .catch((err) => {
      console.log(err.message);
    });
});

//add admin cloud functions

const adminForm = document.querySelector(".admin-actions");
adminForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  const adminEmail = adminForm["admin-email"].value;
  const addAdminRole = functions.httpsCallable("addAdminRole");
  addAdminRole({
    email: adminEmail,
  }).then((result) => {
    console.log(result);
  });
});
