const form = document.getElementById("form");
const password = document.getElementById("password");

const url = window.location.href;
const params = url.split("/");
const token = params[params.length - 1];

form.addEventListener("submit", (e) => {
  e.preventDefault();
  fetch(`/api/sessions/restorePass/${token}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ password: password.value }),
  })
    .then((res) => res.json())
    .then((json) => {
      console.log(json);
      if (json.status === "success") {
        return (window.location.href = "/login");
      }
      form.reset();
    });
});
