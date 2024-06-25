document.addEventListener('DOMContentLoaded', function() {
    
    // Variables for site navigation
    let siteSection = "HOME"; // HOME, LEARN, QUIZ, SETTINGS, TUTORIAL, GLOSSARY
    let grade = 1;
    let topic = "test topic";
    let gradeTopic = "Grade " + grade + ": " + topic;
    let progressBar; // Boolean
    localStorage.setItem('existingUser', "false"); // Toggle to test existingUser and eventually remove when existingUser is set up properly (when a setting has been changed or question answered)
    let currentTutorialIndex = 0;
    let pages = [];

    // Variables for settings TODO: UPDATE WHEN SETTINGS PAGE IS SET UP
    let navButtonView = "both";
    localStorage.setItem('navButtonView', "text");

    ////// Functions for overall nagivation //////

    // Function to update page content
    function updatePageContent(){
        if(siteSection === "HOME") {
            emptyMainText();
            emptyFooter();
            progressBar = false;
            if(localStorage.getItem('existingUser') === "true"){
                renderHomePageExistingUser();
                addHomePageEventListenerExistingUser();
            }
            else{
                renderHomePageNewUser();
                addHomePageEventListenersNewUser();
            }
        }
        else if(siteSection === "LEARN"){
            document.getElementById("page-title").innerHTML = gradeTopic;
            progressBar = false;
            emptyMainText();
            emptyFooter();
        }
        else if(siteSection === "QUIZ"){
            document.getElementById("page-title").innerHTML = "Quiz";
            progressBar = true;
            emptyMainText();
            emptyFooter();
        }
        else if(siteSection === "SETTINGS"){
            document.getElementById("page-title").innerHTML = "Settings";
            progressBar = false;
            emptyMainText();
            emptyFooter();
        }
        else if(siteSection === "TUTORIAL"){
            loadTutorialData();
        }
        else if(siteSection === "GLOSSARY"){
            document.getElementById("page-title").innerHTML = "Glossary";
            progressBar = false;
            emptyMainText();
            emptyFooter();
        }
    }

    ////// Navigation button functions //////

    // Function to render the nav buttons based on settings
    function updateNavButtons(variant) {
         if (variant === "text") {
            navButtonText("home", "Home");
            navButtonText("learn", "Learn");
            navButtonText("quiz", "Quiz");
            navButtonText("settings", "Settings");
            navButtonText("tutorial", "Tutorial");
            navButtonText("glossary", "Glossary");
        } else if (variant === "images") {
            navButtonImage("home");
            navButtonImage("learn");
            navButtonImage("quiz");
            navButtonImage("settings");
            navButtonImage("tutorial");
            navButtonImage("glossary");
        } else {
            navButtonImageText("home", "Home");
            navButtonImageText("learn", "Learn");
            navButtonImageText("quiz", "Quiz");
            navButtonImageText("settings", "Settings");
            navButtonImageText("tutorial", "Tutorial");
            navButtonImageText("glossary", "Glossary");
        }
    }

    // Text only
    function navButtonText(buttonName, buttonText) {
        let button = document.getElementById(buttonName+"-button");
        button.innerHTML = "";
        button.innerHTML = buttonText;
        button.style.fontSize = "20pt";
        button.style.textAlign = "center";
        button.style.padding = "20px 0";
        button.style.fontWeight = "bold";
    }

    // Images only
    function navButtonImage(buttonName) {
        let button = document.getElementById(buttonName+"-button");
        button.innerHTML = "";
        let img = document.createElement('img');
        img.src = "/images/navigation/" + buttonName + ".png";
        img.alt = buttonName + " button";
        img.width = 50;
        img.style.display = "block";
        img.style.margin = "0 auto";
        button.appendChild(img);
    }

    // Text and images
    function navButtonImageText(buttonName, buttonText) {
        let button = document.getElementById(buttonName+"-button");
        button.innerHTML = "";
        let container = document.createElement('div');
        container.style.display = "flex";
        container.style.alignItems = "center";
        let img = document.createElement('img');
        img.src = "/images/navigation/" + buttonName + ".png";
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

    // Switch pages via the navigation buttons
    function changeSiteSection(newSiteSection) {
        siteSection = newSiteSection;
        updatePageContent();
    }

    ////// Navigation button event listeners //////
    document.getElementById("home-button").addEventListener('click', function(){
        changeSiteSection("HOME");
    });
    document.getElementById("learn-button").addEventListener('click', function(){
        changeSiteSection("LEARN");
    });
    document.getElementById("quiz-button").addEventListener('click', function(){
        changeSiteSection("QUIZ");
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

    ////// Home page functions //////

    function renderHomePageNewUser() {
        document.getElementById("page-title").innerHTML = "Welcome to Music Theory My Way!";
        let introText = "It looks like you are new to this site. Take the tutorial to learn your way around.";
        let div = document.createElement('div');
        div.innerHTML = introText;
        let mainContainer = document.getElementById("main-container");
        mainContainer.appendChild(div);

        let newUserContainer = document.createElement('div');
        newUserContainer.setAttribute('class', "newUserContainer");

        let tutorialText = "Take the tutorial";
        let newUserTutorialButton = createHomePageButton("newUserTutorialButton", "tutorial", tutorialText);
        newUserContainer.appendChild(newUserTutorialButton);

        let learnText = "Start learning now";
        let newUserLearnButton = createHomePageButton("newUserLearnButton", "learn", learnText);
        newUserContainer.appendChild(newUserLearnButton);

        mainContainer.appendChild(newUserContainer);
    }

    function addHomePageEventListenersNewUser() {
        let tutorialButtonNew = document.getElementById("newUserTutorialButton");
        if (tutorialButtonNew) {
            tutorialButtonNew.addEventListener('click', function() {
                changeSiteSection("TUTORIAL");
            });
        }

        let learnButtonNew = document.getElementById("newUserLearnButton");
        if (learnButtonNew) {
            learnButtonNew.addEventListener('click', function() {
                changeSiteSection("LEARN");
            });
        }
    }

    function renderHomePageExistingUser() {
        document.getElementById("page-title").innerHTML = "Welcome back to Music Theory My Way!";
        let introText = "Click on the music notes to continue learning.";
        let div = document.createElement('div');
        div.innerHTML = introText;
        let mainContainer = document.getElementById("main-container");
        mainContainer.appendChild(div);

        let existingUserContainer = document.createElement('div');
        existingUserContainer.setAttribute('class', "existingUserContainer");

        let learnText = "Continue learning";
        let existingUserLearnButton = createHomePageButton("existingUserLearnButton", "learn", learnText);
        existingUserContainer.appendChild(existingUserLearnButton);

        mainContainer.appendChild(existingUserContainer);
    }

    function addHomePageEventListenerExistingUser() {
        let learnButtonExisting = document.getElementById("existingUserLearnButton");
        if (learnButtonExisting) {
            learnButtonExisting.addEventListener('click', function() {
                changeSiteSection("LEARN");
            });
        }
    }

    // Big buttons on home page
    function createHomePageButton(buttonId, buttonName, buttonText) {
        let homePageButton = document.createElement('div');
        homePageButton.setAttribute('class', 'bigHomeButton');
        homePageButton.setAttribute('id', buttonId);

        let img = document.createElement('img');
        img.src = "/images/navigation/" + buttonName + ".png";
        img.alt = "Big " + buttonName + " button";
        img.width = 100;
        
        let text = document.createElement('span');
        text.innerHTML = buttonText;

        homePageButton.appendChild(img);
        homePageButton.appendChild(text);

        return homePageButton;
    }

    ////// Tutorial functions //////

    // Function to load tutorial data
    function loadTutorialData() {
        fetch('tutorialData.json')
            .then(response => response.json())
            .then(tutorialData => {
                pages = tutorialData;
                currentTutorialIndex = 0; // Reset index when entering tutorial
                renderTutorialPage(currentTutorialIndex);                   
            })
            .catch(error => console.error("Error loading JSON: ", error));
    }

    // Function to render tutorial page
    function renderTutorialPage(index) {
        if (index >= 0 && index < pages.length) {
            const page = pages[index];
            document.getElementById("page-title").innerHTML = "Tutorial";
            progressBar = false;
            emptyMainText();
            emptyFooter();
    
            let mainContainer = document.getElementById("main-container");
            let tutorialContainer = document.createElement('div');
            tutorialContainer.setAttribute('class', "tutorialContainer");

            let tutorialImageBox = document.createElement('div');
            tutorialImageBox.setAttribute('id', 'tutorialImageBox');
            tutorialImageBox.style.backgroundColor = page.colour;

            let tutorialImage = document.createElement('img');
            tutorialImage.setAttribute('id', 'tutorialImage');

            tutorialImageBox.appendChild(tutorialImage);

            let tutorialTextBox = document.createElement('div');
            tutorialTextBox.setAttribute('id', 'tutorialTextBox');

            let tutorialSubheading = document.createElement('h2');
            tutorialSubheading.setAttribute('id', 'tutorialSubheading');

            let tutorialText = document.createElement('p');
            tutorialText.setAttribute('id', 'tutorialText');

            tutorialTextBox.appendChild(tutorialSubheading);
            tutorialTextBox.appendChild(tutorialText);

            tutorialContainer.appendChild(tutorialImageBox);
            tutorialContainer.appendChild(tutorialTextBox);
            mainContainer.appendChild(tutorialContainer);

            document.getElementById('tutorialSubheading').innerHTML = page.subheading;
            document.getElementById('tutorialText').innerHTML = page.text;
            document.getElementById('tutorialImage').src = page.image;
            document.getElementById('tutorialImage').alt = page.altText;

            renderNextButton();
            document.getElementById("nextButtonImageBox").addEventListener('click', function() {
                currentTutorialIndex++;
                if (currentTutorialIndex >= pages.length) {
                    changeSiteSection("HOME");
                } else {
                    renderTutorialPage(currentTutorialIndex);
                }
            });

        } else {
            console.error('Page index out of range:', index);
        }
    }

    ////// Misc helper functions //////

    // Function to render the next button
    function renderNextButton() {
        let footer = document.getElementById("footer");
        footer.style.display = "flex";
        footer.style.justifyContent = "flex-end";
        let nextButtonImageBox = document.createElement('div');
        nextButtonImageBox.setAttribute('id', "nextButtonImageBox");
        let nextButtonImage = document.createElement('img');
        nextButtonImage.setAttribute('id', "nextButtonImage");
        nextButtonImage.src = "/images/rightArrow.png";
        nextButtonImage.width = 80;
        nextButtonImageBox.appendChild(nextButtonImage);
        footer.appendChild(nextButtonImageBox);        
    }

    // Empty the main element
    function emptyMainText() {
        document.getElementById("main-container").innerHTML = "";
    }

    function emptyFooter(){
        document.getElementById("footer").innerHTML = "";
    }

    ////// Render the page content //////
    updatePageContent();
    updateNavButtons(navButtonView);

});
