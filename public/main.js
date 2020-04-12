const contactButton = document.getElementById("contactShihab")
const closeIcon = document.getElementById("icon-close")
const popupHolder = document.getElementById("popup-contact-shihab")
const docBody = document.getElementsByTagName("BODY")[0]

contactButton.addEventListener("click", function() {
    popupHolder.classList.remove("js-initial-position")
    docBody.classList.add("js-overflow-y-0")       
})

closeIcon.addEventListener("click", function() {
    popupHolder.classList.add("js-initial-position")
    docBody.classList.remove("js-overflow-y-0")
})