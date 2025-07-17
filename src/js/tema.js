let darkMode = localStorage.getItem('darkMode')
const trocaTema = document.getElementById('troca-tema')

const enalbeDarMode = () => {
    document.body.classList.add('darkMode')
    localStorage.setItem('darkMode', 'active')
}

const disblaDarkMode = () => {
    document.body.classList.remove('darkMode')
    localStorage.setItem('darkMode', null)
}

if(darkMode === "active") enalbeDarMode()

trocaTema.addEventListener("click", () => {
    darkMode = localStorage.getItem('darkMode')
    darkMode !== "active" ? enalbeDarMode() : disblaDarkMode()
})