const form = document.getElementById("sendLink");
const email = document.getElementById("email");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  fetch(`/api/sessions/sendRestorePassEmail/${email.value}`, {
    method: "POST",
  })
    .then((res) => res.json())
    .then((json) => {
      console.log(json);
      form.reset();
      window.location.href = "/login";
    });
});
