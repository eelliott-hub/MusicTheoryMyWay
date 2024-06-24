document.addEventListener('DOMContentLoaded', function() {
    
    // Variables for site navigation
    let siteSection = "HOME"; // HOME, LEARN, TEST, SETTINGS, TUTORIAL, GLOSSARY
    let grade = 1;
    let topic = "test topic";
    let gradeTopic = "Grade " + grade + ": " + topic;
    let progressBar; // Boolean
    // localStorage.setItem('existingUser', "true"); Toggle to test existingUser

    // Variables for settings UPDATE WHEN SETTINGS PAGE IS SET UP
    let navButtonView = "both";
    localStorage.setItem('navButtonView', "text");
    
    // Function to update page content. Eventually move out to separate functions when pages get more complex.
    function updatePageContent(){
        if(siteSection === "HOME") {
            
            progressBar = false;
            if(localStorage.getItem('existingUser') === "true"){ // TODO: decide when to update this - when a setting has been changed or the first question has been answered?
                document.getElementById("page-title").innerHTML = "Welcome back to Music Theory My Way!";
                document.getElementById("main-text").innerHTML = "Click on the music notes to continue learning.";
            }
            else{
                document.getElementById("page-title").innerHTML = "Welcome to Music Theory My Way!";
                document.getElementById("main-text").innerHTML = "It looks like you are new to this site. <br><br>Take the tutorial to learn your way around.";
            }
        }
        else if(siteSection === "LEARN"){
            document.getElementById("page-title").innerHTML = gradeTopic;
            progressBar = false;
            document.getElementById("main-text").innerHTML = "";
        }
        else if(siteSection === "TEST"){
            document.getElementById("page-title").innerHTML = "Quiz";
            progressBar = true;
            document.getElementById("main-text").innerHTML = "";
        }
        else if(siteSection === "SETTINGS"){
            document.getElementById("page-title").innerHTML = "Settings";
            progressBar = false;
            document.getElementById("main-text").innerHTML = "";
        }
        else if(siteSection === "TUTORIAL"){
            document.getElementById("page-title").innerHTML = "Tutorial";
            progressBar = false;
            document.getElementById("main-text").innerHTML = "";
        }
        else if(siteSection === "GLOSSARY"){
            document.getElementById("page-title").innerHTML = "Glossary";
            progressBar = false;
            document.getElementById("main-text").innerHTML = "";
        }
    }

    // Function to switch pages via the navigation buttons
    function changeSiteSection(newSiteSection) {
        siteSection = newSiteSection;
        updatePageContent();
    }

    // Event listeners for the navigation buttons
    document.getElementById("home-button").addEventListener('click', function(){
        changeSiteSection("HOME");
    });
    document.getElementById("learn-button").addEventListener('click', function(){
        changeSiteSection("LEARN");
    });
    document.getElementById("test-button").addEventListener('click', function(){
        changeSiteSection("TEST");
    });
    document.getElementById("settings-button").addEventListener('click', function(){
        changeSiteSection("SETTINGS");
    });
    document.getElementById("tutorial-button").addEventListener('click', function(){
        changeSiteSection("TUTORIAL");
    });
    document.getElementById("glossary-button").addEventListener('click', function(){
        changeSiteSection("GLOSSARY");
    });


    // Functions to set the navigation buttons

    function updateNavButtons(variant) {
         if(variant === "text"){
            navButtonText("home", "Home");
            navButtonText("learn", "Learn");
            navButtonText("test", "Test");
            navButtonText("settings", "Settings");
            navButtonText("tutorial", "Tutorial");
            navButtonText("glossary", "Glossary");
        }
        else if(variant === "images"){
            navButtonImage("home");
            navButtonImage("learn");
            navButtonImage("test");
            navButtonImage("settings");
            navButtonImage("tutorial");
            navButtonImage("glossary");
        } 
        else {
            navButtonImageText("home", "Home");
            navButtonImageText("learn", "Learn");
            navButtonImageText("test", "Test");
            navButtonImageText("settings", "Settings");
            navButtonImageText("tutorial", "Tutorial");
            navButtonImageText("glossary", "Glossary");
        }
    }

        // Text only
        function navButtonText(buttonName, buttonText){
            let button = document.getElementById(buttonName+"-button");
            button.innerHTML = "";
            button.innerHTML = buttonText;
            button.style.fontSize = "20pt";
            button.style.textAlign = "center";
            button.style.padding = "20px 0 20px 0";
            button.style.fontWeight = "bold";
        }

        // Images only
        function navButtonImage(buttonName) {
            let button = document.getElementById(buttonName+"-button");
            button.innerHTML = "";
            let img = document.createElement('img');
            img.src = "/images/navigation/"+buttonName+".png";
            img.alt = buttonName + " button";
            img.width = 50;
            img.style.display = "block";
            img.style.margin = "0 auto";
            button.appendChild(img);
        }

        // Text and images
        function navButtonImageText(buttonName, buttonText){
            let button = document.getElementById(buttonName+"-button");
            button.innerHTML = "";
            let container = document.createElement('div');
            container.style.display = "flex";
            container.style.alignItems = "center";
            let img = document.createElement('img');
            img.src = "/images/navigation/"+buttonName+".png";
            img.alt = buttonName + " button";
            img.width = 40;
            img.style.marginRight = "10px";
            let text = document.createElement('span');
            text.innerHTML = buttonText;
            text.style.fontSize = "18pt";
            container.appendChild(img);
            container.appendChild(text);
            button.appendChild(container);
        }

    updatePageContent();
    updateNavButtons(navButtonView);

});