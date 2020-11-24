// setup materialize components
document.addEventListener("DOMContentLoaded", function () {
  var modals = document.querySelectorAll(".modal");
  M.Modal.init(modals);

  var items = document.querySelectorAll(".collapsible");
  M.Collapsible.init(items);
});

//----------------

const guideList = document.querySelector(".guides");

// setup guides

const setupGuides = (data) => {
  if (data.length) {
    let html = "";
    data.forEach((doc) => {
      const guide = doc.data();
      const li = `
    <li>
      <div class='collapsible-header grey lighten-4'>${guide.title}</div>
      <div class='collapsible-body white'>${guide.content}</div>
    </li>
    `;
      html += li;
    });
    guideList.innerHTML = html;
  } else {
    guideList.innerHTML = `<h5 class='center-align'>Please Log in to view guides</h5>`;
  }
};
//togle ui
const logedOutLinks = document.querySelectorAll(".logged-out");
const logedInLinks = document.querySelectorAll(".logged-in");
const accountDetails = document.querySelector(".account-details");

const setupUI = (user) => {
  if (user) {
    //add account details
    db.collection("users")
      .doc(user.uid)
      .get()
      .then((doc) => {
        const html = `
        <div>Logged in as ${user.email}</div>
        <div>${doc.data().bio}</div>`;
        accountDetails.innerHTML = html;
      });

    //toggle buttons
    logedInLinks.forEach((item) => {
      item.style.display = "block";
    });
    logedOutLinks.forEach((item) => {
      item.style.display = "none";
    });
  } else {
    //hide account details
    accountDetails.innerHTML = "";
    logedInLinks.forEach((item) => {
      item.style.display = "none";
    });
    logedOutLinks.forEach((item) => {
      item.style.display = "block";
    });
  }
};
