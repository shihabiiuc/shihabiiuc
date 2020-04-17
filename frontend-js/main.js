import Search from "./modules/search"
import AboutContactMe from "./modules/about-contact-me"

if(document.querySelector(".header-search-icon")) {
    new Search()
}

if(document.querySelector(".contactShihab")) {new AboutContactMe()}