// Get the modal
let modal = document.getElementById("add-funds-modal");
let body = document.getElementById("body");

// Get the button that opens the modal
let btn = document.getElementById("add-funds-link");

// Get the <span> element that closes the modal
let span = document.getElementsByClassName("close")[0];

btn.addEventListener("click", function() {
  modal.style.display = "block";
  body.className = "blur";
});

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
  body.style.filter = "none";

}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
    body.className = "";
  }
}
