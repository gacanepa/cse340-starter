const form = document.querySelector("#inventory-form");
form.addEventListener("change", function () {
  const updateBtn = document.querySelector("button")
  updateBtn.removeAttribute("disabled")
});
