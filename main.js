window.addEventListener("DOMContentLoaded", () => {
    loadPage("home")
})

window.loadPage = function(page){

    const content = document.getElementById("content")

    if(!content) return

    if(page === "home"){
        content.innerHTML = `
        <h2>Welcome</h2>
        <p>Affiliate Knowledge Hub</p>
        `
    }

    if(page === "contacts"){
        content.innerHTML = `
        <h2>Contacts</h2>
        <p>Affiliate contact directory.</p>
        `
    }

    if(page === "updates"){
        content.innerHTML = `
        <h2>Updates</h2>
        <p>Company updates will appear here.</p>
        `
    }

    if(page === "guidelines"){
        content.innerHTML = `
        <h2>Guidelines</h2>
        <p>Internal guidelines and policies.</p>
        `
    }

    if(page === "payments"){
        content.innerHTML = `
        <h2>Payments</h2>
        <p>Payment processes and schedules.</p>
        `
    }

    if(page === "retention"){
        content.innerHTML = `
        <h2>Retention</h2>
        <p>Retention resources.</p>
        `
    }

    if(page === "evertrust"){
        content.innerHTML = `
        <h2>Evertrust</h2>
        <p>Evertrust information.</p>
        `
    }

    if(page === "tools"){
        content.innerHTML = `
        <h2>Tools</h2>
        <button onclick="openWheel()">Spin Wheel Tool</button>
        `
    }

}

window.openWheel = function(){
    window.location.href = "wheel.html"
}
