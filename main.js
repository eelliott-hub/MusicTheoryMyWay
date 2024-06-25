document.addEventListener('DOMContentLoaded', function() {
    
    // Variables for site navigation
    let siteSection = "HOME"; // HOME, LEARN, QUIZ, SETTINGS, TUTORIAL, GLOSSARY
    let grade = 1;
    let topic = "test topic";
    let gradeTopic = "Grade " + grade + ": " + topic;
    //localStorage.setItem('existingUser', "false"); // Toggle to test existingUser and eventually remove when existingUser is set up properly (when a setting has been changed or question answered)
    
    // TODO NEXT
        // Replace existingUser with a series of variables for completion of tutorial, changing settings and starting learning
        // Change home page to always just have one button (tutorial, settings, learning)
        // Progress page (under "Learn") and start working up content and question formats

    // Tutorial variables
    let tutorialPages = [];

    // Settings variables
    const settingsPageTitles = [
        "Background colour",
        "Font",
        "Font size and spacing",
        "Navigation buttons" 
    ];

    ////// Functions for overall nagivation //////

    // Function to update page content
    function updatePageContent(){

        if(siteSection === "HOME") {
            emptyMainText();
            emptyFooter();
            if(localStorage.getItem('existingUser') === "true"){
                renderHomePageExistingUser();
                addHomePageEventListenerExistingUser();
            }
            else{
                localStorage.setItem('navButtonView', "text");
                updateNavButtons("text");
                renderHomePageNewUser();
                addHomePageEventListenersNewUser();
            }
        }
        else if(siteSection === "LEARN"){
            document.getElementById("page-title").innerHTML = gradeTopic;
            emptyMainText();
            emptyFooter();
        }
        else if(siteSection === "QUIZ"){
            document.getElementById("page-title").innerHTML = "Quiz";
            emptyMainText();
            emptyFooter();
        }
        else if(siteSection === "SETTINGS"){
            emptyMainText();
            emptyFooter();
            currentSettingsIndex = 0;
            renderSettingsPage(currentSettingsIndex);
        }
        else if(siteSection === "TUTORIAL"){
            loadTutorialData();
        }
        else if(siteSection === "GLOSSARY"){
            document.getElementById("page-title").innerHTML = "Glossary";
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
        img.src = "./images/navigation/" + buttonName + ".png";
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
        img.src = "./images/navigation/" + buttonName + ".png";
        img.alt = buttonName + " button";
        img.width = 40;
        img.style.marginRight = "20px";
        let text = document.createElement('span');
        text.innerHTML = buttonText;
        text.style.fontSize = "18pt";
        text.style.fontWeight = "normal";
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
        img.src = "./images/navigation/" + buttonName + ".png";
        img.alt = "Big " + buttonName + " button";
        img.width = 100;
        
        let text = document.createElement('span');
        text.innerHTML = buttonText;

        homePageButton.appendChild(img);
        homePageButton.appendChild(text);

        return homePageButton;
    }

    ////// Settings functions //////

    function renderSettingsPage(index){

        if(index >= 0 && index < settingsPageTitles.length){
            document.getElementById("page-title").innerHTML = "Settings";
            emptyMainText();
            emptyFooter();
            
            let mainContainer = document.getElementById("main-container");
            let settingsContainer = document.createElement('div');
            settingsContainer.setAttribute('id', "settingsContainer");

            let settingsSubheadingContainer = document.createElement('div');
            settingsSubheadingContainer.setAttribute('id', "settingsSubheadingContainer");

            let settingsSubheading = document.createElement('h2');
            settingsSubheading.setAttribute('id', 'settingsSubheading');
            settingsSubheading.innerHTML = settingsPageTitles[index];

            settingsSubheadingContainer.appendChild(settingsSubheading);
            settingsContainer.appendChild(settingsSubheadingContainer);

            mainContainer.appendChild(settingsContainer);
            renderNextBackArrows();

            // TODO: duplication of code here - sort out if time
            document.getElementById("nextButtonImageContainer").addEventListener('click', function() {
                currentSettingsIndex++;
                if (currentSettingsIndex >= settingsPageTitles.length) {
                    changeSiteSection("HOME");
                } else {
                    renderSettingsPage(currentSettingsIndex);
                }
            });

            document.getElementById("backButtonImageContainer").addEventListener('click', function() {
                currentSettingsIndex--;
                if (currentSettingsIndex < 0) {
                    changeSiteSection("HOME");
                } else {
                    renderSettingsPage(currentSettingsIndex);
                }
            });

            if(index === 0){
                renderBackgroundColourSettings();
            }
            else if(index === 1){
                renderFontTypefaceSettings();
            }
            else if(index === 2){

            }
            else if(index === 3){
                renderNavigationButtonSettings();
            }
        }

        else {
            console.error('Page index out of range:', index);
        }
       
    }

    function renderBackgroundColourSettings(){
        fetch('backgroundColours.json')
            .then(response => response.json())
            .then(colourData => {
                colours = colourData;
                renderColourOptions(colours);
            })
            .catch(error => console.error("Error loading colours:", error)); 
    }

    function renderColourOptions(colourData){
        let colourContainer = document.createElement('div');
        colourContainer.setAttribute('id', "colourContainer");

        colourData.forEach(colour => {
            let colourBlock = document.createElement('div');
            colourBlock.setAttribute('class', "colourBlock");
            colourBlock.style.backgroundColor = colour.colourCode;
            colourBlock.innerHTML = colour.colourText;

            colourBlock.addEventListener('click', function(){
                changeBackgroundColour(colour.colourCode);
            });
            colourContainer.appendChild(colourBlock);
        })

        settingsContainer.appendChild(colourContainer);
    }

    function changeBackgroundColour(newBackgroundColour) {
        console.log('Changing background colour to:', newBackgroundColour);
        document.getElementById('header').style.backgroundColor = newBackgroundColour;
        document.getElementById('main').style.backgroundColor = newBackgroundColour;
        document.getElementById('footer').style.backgroundColor = newBackgroundColour;
        localStorage.setItem('backgroundColour', newBackgroundColour);
        saveExistingUser();
    }

    function renderFontTypefaceSettings(){
        fetch('fontTypefaces.json')
        .then(response => response.json())
        .then(typefaceData => {
            typefaces = typefaceData;
            renderFontTypefaceOptions(typefaces);
        })
        .catch(error => console.error("Error loading typefaces:", error)); 
    }

    function renderFontTypefaceOptions(typefaceData){
        let typefaceContainer = document.createElement('div');
        typefaceContainer.setAttribute('id', "typefaceContainer");

        typefaceData.forEach(typeface => {
            let typefaceBlock = document.createElement('div');
            typefaceBlock.setAttribute('class', "typefaceBlock");
            typefaceBlock.style.fontFamily = typeface.fontFamily;
            typefaceBlock.innerHTML = typeface.fontText;

            typefaceBlock.addEventListener('click', function(){
                changeTypeface(typeface.fontFamily);
            });
            typefaceContainer.appendChild(typefaceBlock);
        })

        settingsContainer.appendChild(typefaceContainer);
    }

    function changeTypeface(newTypeface){
        console.log('Changing font typeface to:', newTypeface);
        document.getElementById('nav').style.fontFamily = newTypeface;
        document.getElementById('header').style.fontFamily = newTypeface;
        document.getElementById('main').style.fontFamily = newTypeface;
        document.getElementById('footer').style.fontFamily = newTypeface;
        localStorage.setItem('fontTypeface', newTypeface);
        saveExistingUser();
    }

    function renderNavigationButtonSettings(){

        let navigationOptionsContainer = document.createElement('div');
        navigationOptionsContainer.setAttribute('id', "navigationOptionsContainer");

        // Split these out into separate functions?? 

        let navOption1 = document.createElement('div');
        navOption1.setAttribute('class', "navOptionContainer");
        navOption1.setAttribute('class', "nav-button");
        navOption1.innerHTML = "Learn";
        navOption1.style.fontSize = "20pt";
        navOption1.style.textAlign = "center";
        navOption1.style.padding = "20px 0";
        navOption1.style.fontWeight = "bold";
        navOption1.style.backgroundColor = "#6ff36f";

        navOption1.addEventListener('click', function(){
            localStorage.setItem('navButtonsView', "text");
            saveExistingUser();
            updateNavButtons("text");
        });

        navigationOptionsContainer.appendChild(navOption1);

        let navOption2 = document.createElement('div');
        navOption2.setAttribute('class', "navOptionContainer");
        navOption2.setAttribute('class', "nav-button");

        let img2 = document.createElement('img');
        img2.src = "./images/navigation/learn.png";
        img2.alt = "Learn button";
        img2.width = 50;
        img2.style.display = "block";
        img2.style.margin = "0 auto";
        navOption2.style.backgroundColor = "#6ff36f";
        navOption2.appendChild(img2);

        navOption2.addEventListener('click', function(){
            localStorage.setItem('navButtonsView', "images");
            saveExistingUser();
            updateNavButtons("images");
        });

        navigationOptionsContainer.appendChild(navOption2);

        let navOption3 = document.createElement('div');
        navOption3.setAttribute('class', "navOptionContainer");
        navOption3.setAttribute('class', "nav-button");

        let container = document.createElement('div');
        container.style.display = "flex";
        container.style.alignItems = "center";
        let img3 = document.createElement('img');
        img3.src = "./images/navigation/learn.png";
        img3.alt = "Learn button";
        img3.width = 40;
        img3.style.marginRight = "20px";
        let text = document.createElement('span');
        text.innerHTML = "Learn";
        text.style.fontSize = "18pt";
        navOption3.style.backgroundColor = "#6ff36f";
        container.appendChild(img3);
        container.appendChild(text);
        navOption3.appendChild(container);

        navOption3.addEventListener('click', function(){
            localStorage.setItem('navButtonsView', "both");
            saveExistingUser();
            updateNavButtons("both");
        });

        navigationOptionsContainer.appendChild(navOption3);

        settingsContainer.appendChild(navigationOptionsContainer);

    }

    // Apply saved settings
    function applySavedSettings() {
        let savedBackgroundColour = localStorage.getItem('backgroundColour');
        if (savedBackgroundColour) {
            console.log('Applying saved background colour:', savedBackgroundColour);
            document.getElementById('header').style.backgroundColor = savedBackgroundColour;
            document.getElementById('main').style.backgroundColor = savedBackgroundColour;
            document.getElementById('footer').style.backgroundColor = savedBackgroundColour;
        }
        let savedTypeface = localStorage.getItem('fontTypeface');
        if(savedTypeface) {
            console.log('Applying saved font typeface:', savedTypeface);
            document.getElementById('nav').style.fontFamily = savedTypeface;
            document.getElementById('header').style.fontFamily = savedTypeface;
            document.getElementById('main').style.fontFamily = savedTypeface;
            document.getElementById('footer').style.fontFamily = savedTypeface;
        }
        let savedNavButtonsView = localStorage.getItem('navButtonsView');
        if(savedNavButtonsView){
            console.log('Applying saved navigation buttons:', savedNavButtonsView);
            updateNavButtons(savedNavButtonsView);
        }
    }

    ////// Tutorial functions //////

    // Function to load tutorial data
    function loadTutorialData() {
        fetch('tutorialData.json')
            .then(response => response.json())
            .then(tutorialData => {
                tutorialPages = tutorialData;
                currentTutorialIndex = 0; // Reset index when entering tutorial
                renderTutorialPage(currentTutorialIndex);                   
            })
            .catch(error => console.error("Error loading JSON: ", error));
    }

    // Function to render tutorial page
    function renderTutorialPage(index) {
        if (index >= 0 && index < tutorialPages.length) {
            const page = tutorialPages[index];
            document.getElementById("page-title").innerHTML = "Tutorial";
            emptyMainText();
            emptyFooter();
    
            let mainContainer = document.getElementById("main-container");
            let tutorialContainer = document.createElement('div');
            tutorialContainer.setAttribute('id', "tutorialContainer");

            let tutorialImageContainer = document.createElement('div');
            tutorialImageContainer.setAttribute('id', 'tutorialImageContainer');
            tutorialImageContainer.style.backgroundColor = page.colour;

            let tutorialImage = document.createElement('img');
            tutorialImage.setAttribute('id', 'tutorialImage');

            tutorialImageContainer.appendChild(tutorialImage);

            let tutorialTextContainer = document.createElement('div');
            tutorialTextContainer.setAttribute('id', 'tutorialTextContainer');

            let tutorialSubheading = document.createElement('h2');
            tutorialSubheading.setAttribute('id', 'tutorialSubheading');

            let tutorialText = document.createElement('p');
            tutorialText.setAttribute('id', 'tutorialText');

            tutorialTextContainer.appendChild(tutorialSubheading);
            tutorialTextContainer.appendChild(tutorialText);

            tutorialContainer.appendChild(tutorialImageContainer);
            tutorialContainer.appendChild(tutorialTextContainer);
            mainContainer.appendChild(tutorialContainer);

            document.getElementById('tutorialSubheading').innerHTML = page.subheading;
            document.getElementById('tutorialText').innerHTML = page.text;
            document.getElementById('tutorialImage').src = page.image;
            document.getElementById('tutorialImage').alt = page.altText;

            renderNextBackArrows();

            // TODO: duplication of code here - sort out if time
            document.getElementById("nextButtonImageContainer").addEventListener('click', function() {
                currentTutorialIndex++;
                if (currentTutorialIndex >= tutorialPages.length) {
                    changeSiteSection("HOME");
                } else {
                    renderTutorialPage(currentTutorialIndex);
                }
            });

            document.getElementById("backButtonImageContainer").addEventListener('click', function() {
                currentTutorialIndex--;
                if (currentTutorialIndex < 0) {
                    changeSiteSection("HOME");
                } else {
                    renderTutorialPage(currentTutorialIndex);
                }
            });

        } 
        
        else {
            console.error('Page index out of range:', index);
        }
    }

    ////// Misc helper functions //////

    // Function to render the next button
    function renderNextBackArrows() {
        let footer = document.getElementById("footer");
        footer.style.display = "flex";
        footer.style.justifyContent = "space-between";
        
        let backButtonImageContainer = document.createElement('div');
        backButtonImageContainer.setAttribute('id', "backButtonImageContainer");
        let backButtonImage = document.createElement('img');
        backButtonImage.setAttribute('id', "backButtonImage");
        backButtonImage.src = "/images/leftArrow.png";
        backButtonImage.width = 80;
        backButtonImageContainer.appendChild(backButtonImage);
        footer.appendChild(backButtonImageContainer);

        let nextButtonImageContainer = document.createElement('div');
        nextButtonImageContainer.setAttribute('id', "nextButtonImageContainer");
        let nextButtonImage = document.createElement('img');
        nextButtonImage.setAttribute('id', "nextButtonImage");
        nextButtonImage.src = "/images/rightArrow.png";
        nextButtonImage.width = 80;
        nextButtonImageContainer.appendChild(nextButtonImage);
        footer.appendChild(nextButtonImageContainer);
    }

    // Empty the main element
    function emptyMainText() {
        document.getElementById("main-container").innerHTML = "";
    }

    // Empty the footer
    function emptyFooter(){
        document.getElementById("footer").innerHTML = "";
    }

    // Make existing user
    function saveExistingUser(){
        localStorage.setItem('existingUser', "true");
    }

    ////// Render the page content //////
    applySavedSettings();
    updatePageContent();

});
