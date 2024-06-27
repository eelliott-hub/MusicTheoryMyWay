document.addEventListener('DOMContentLoaded', function() {
    
    // Variables for site navigation
    let siteSection = "HOME"; // HOME, LEARN, CONTENT, QUIZ, SETTINGS, TUTORIAL, GLOSSARY
    let availableGrades = [1, 2, 3, 4, 5];

    // Default settings
    let defaultBackgroundColour = "#f5f5f5";
    let defaultTypeface = "Verdana, sans-serif";
    let defaultNavButtons = "both";
   
    // Variables for sizes
    let arrowImageWidth = 80;
    let imagesOnlyNavButtonImageWidth = 50;
    let bothNavButtonImageWidth = 40;
    let homePageButtonImageWidth = 100;



    // TODO NEXT
        // Progress page for the grades, with topics on
        // Create a question type and some questions, with the logic around correct answers and storing progress
        // Progress bar?


    // Uncomment temporarily to clear elements of local storage
    // localStorage.clear();
    // localStorage.removeItem("tutorialCompleted");
    // localStorage.removeItem("settingsChanged");

    // Set to make grade 2 available
    // localStorage.setItem('highestGradeCompleted', "1");
    

    // Settings variables - consider storing externally?
    const settingsPageTitles = [
        "Background colour",
        "Font",
        "Font size and spacing",
        "Navigation buttons" 
    ];

    ////// Main function to update page content //////
    function updatePageContent(){
        emptyMainText();
        emptyFooter();

        if(siteSection === "HOME") {
            if (!localStorage.getItem('tutorialCompleted', "true")) { renderHomePageTutorial(); }
            else if (!localStorage.getItem('settingsChanged', "true")) { renderHomePageSettings(); }
            else if (!localStorage.getItem('learningStarted', "true")) { renderHomePageStartLearn(); }
            else { renderHomePageContinueLearn(); }
        }
        else if(siteSection === "LEARN"){
            renderProgressPage();
        }
        else if(siteSection === "GRADEHOMEPAGE"){
            let currentGrade = sessionStorage.getItem('currentGrade');
            renderGradeHomePage(currentGrade);
        }
        else if(siteSection === "CONTENT"){
            document.getElementById("page-title").innerHTML = "";
        }
        else if(siteSection === "QUIZ"){
            document.getElementById("page-title").innerHTML = "Quiz";
        }
        else if(siteSection === "SETTINGS"){
            currentSettingsIndex = 0;
            renderSettingsPage(currentSettingsIndex);
        }
        else if(siteSection === "TUTORIAL"){
            loadTutorialData();
        }
        else if(siteSection === "GLOSSARY"){
            document.getElementById("page-title").innerHTML = "Glossary";
        }
    }

    ////// Navigation button functions //////

    // Function to render the nav buttons based on settings
    function setNavButtons(variant) {
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
        img.width = imagesOnlyNavButtonImageWidth;
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
        img.width = bothNavButtonImageWidth;
        img.style.marginRight = "5px";
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

    // TODO change to JSON file instead?
    function renderHomePageTutorial(){
        let pageTitle = "Welcome to Music Theory My Way!";
        let introText = "It looks like you are new to this site. Take the tutorial to learn your way around.";
        let buttonNav = "tutorial";
        let buttonText = "Take the tutorial";
        let siteSectionTo = "TUTORIAL";
        let buttonColour = "#ffff00";
        renderHomePage(pageTitle, introText, buttonNav, buttonText, siteSectionTo, buttonColour);
    }

    function renderHomePageSettings(){
        let pageTitle = "Welcome back to Music Theory My Way!";
        let introText = "Adjust the settings to suit your learning preferences.";
        let buttonNav = "settings";
        let buttonText = "Go to settings";
        let siteSectionTo = "SETTINGS";
        let buttonColour = "#ffa500";
        renderHomePage(pageTitle, introText, buttonNav, buttonText, siteSectionTo, buttonColour);
    }

    function renderHomePageStartLearn(){
        let pageTitle = "Welcome back to Music Theory My Way!";
        let introText = "";
        let buttonNav = "learn";
        let buttonText = "Start learning now";
        let siteSectionTo = "LEARN";
        let buttonColour = "#6ff36f";
        renderHomePage(pageTitle, introText, buttonNav, buttonText, siteSectionTo, buttonColour);
    }

    function renderHomePageContinueLearn(){
        let pageTitle = "Welcome back to Music Theory My Way!";
        let introText = "Click the music notes to continue learning.";
        let buttonNav = "learn";
        let buttonText = "Contibue learning now";
        let siteSectionTo = "LEARN";
        let buttonColour = "#6ff36f";
        renderHomePage(pageTitle, introText, buttonNav, buttonText, siteSectionTo, buttonColour);
    }

    function renderHomePage(pageTitle, introText, buttonNav, buttonText, siteSectionTo, buttonColour) {
        document.getElementById("page-title").innerHTML = pageTitle;
        let div = document.createElement('div');
        div.setAttribute('class', "homePageContainer");
        div.innerHTML = introText;
        let mainContainer = document.getElementById("main-container");
        mainContainer.appendChild(div);

        let homePageContainer = document.createElement('div');
        homePageContainer.setAttribute('class', "homePageContainer");

        let homePageButton = createHomePageButton("homePageButton", buttonNav, buttonText, buttonColour);
        homePageContainer.appendChild(homePageButton);

        mainContainer.appendChild(homePageContainer);

        addHomePageEventListener(siteSectionTo);
    }

    function addHomePageEventListener(siteSectionTo) {
        let homePageButton = document.getElementById("homePageButton");
        if (homePageButton) {
            homePageButton.addEventListener('click', function() {
                changeSiteSection(siteSectionTo);
            });
        }
    }

    // Big button on home page
    function createHomePageButton(buttonId, buttonName, buttonText, buttonColour) {
        let homePageButton = document.createElement('div');
        homePageButton.setAttribute('class', 'bigHomeButton');
        homePageButton.setAttribute('id', buttonId);
        homePageButton.style.backgroundColor = buttonColour;

        let img = document.createElement('img');
        img.src = "./images/navigation/" + buttonName + ".png";
        img.alt = "Big " + buttonName + " button";
        img.width = homePageButtonImageWidth;
        
        let text = document.createElement('span');
        text.innerHTML = buttonText;

        homePageButton.appendChild(img);
        homePageButton.appendChild(text);

        return homePageButton;
    }

    ////// Settings functions //////

    // TODO if time, split this function into smaller ones
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
                localStorage.setItem('settingsChanged', "true");
            });
            colourContainer.appendChild(colourBlock);
        })
        settingsContainer.appendChild(colourContainer);
    }

    function changeBackgroundColour(newBackgroundColour) {
        console.log('Changing background colour to:', newBackgroundColour);
        setBackgroundColour(newBackgroundColour);
        localStorage.setItem('backgroundColour', newBackgroundColour);
    }

    function setBackgroundColour(backgroundColour){
        document.getElementById('nav').style.backgroundColor = backgroundColour;
        document.getElementById('header').style.backgroundColor = backgroundColour;
        document.getElementById('main').style.backgroundColor = backgroundColour;
        document.getElementById('footer').style.backgroundColor = backgroundColour;
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
                localStorage.setItem('settingsChanged', "true");
            });
            typefaceContainer.appendChild(typefaceBlock);
        })

        settingsContainer.appendChild(typefaceContainer);
    }

    function changeTypeface(newTypeface){
        console.log('Changing font typeface to:', newTypeface);
        setTypeface(newTypeface);
        localStorage.setItem('fontTypeface', newTypeface);
    }

    function setTypeface(typeface){
        document.getElementById('nav').style.fontFamily = typeface;
        document.getElementById('header').style.fontFamily = typeface;
        document.getElementById('main').style.fontFamily = typeface;
        document.getElementById('footer').style.fontFamily = typeface;
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
            localStorage.setItem('settingsChanged', "true");
            setNavButtons("text");
        });

        navigationOptionsContainer.appendChild(navOption1);

        let navOption2 = document.createElement('div');
        navOption2.setAttribute('class', "navOptionContainer");
        navOption2.setAttribute('class', "nav-button");

        let img2 = document.createElement('img');
        img2.src = "./images/navigation/learn.png";
        img2.alt = "Learn button";
        img2.width = imagesOnlyNavButtonImageWidth;
        img2.style.display = "block";
        img2.style.margin = "0 auto";
        navOption2.style.backgroundColor = "#6ff36f";
        navOption2.appendChild(img2);

        navOption2.addEventListener('click', function(){
            localStorage.setItem('navButtonsView', "images");
            localStorage.setItem('settingsChanged', "true");
            setNavButtons("images");
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
        img3.width = bothNavButtonImageWidth;
        img3.style.marginRight = "5px";
        let text = document.createElement('span');
        text.innerHTML = "Learn";
        text.style.fontSize = "18pt";
        navOption3.style.backgroundColor = "#6ff36f";
        container.appendChild(img3);
        container.appendChild(text);
        navOption3.appendChild(container);

        navOption3.addEventListener('click', function(){
            localStorage.setItem('navButtonsView', "both");
            localStorage.setItem('settingsChanged', "true");
            setNavButtons("both");
        });

        navigationOptionsContainer.appendChild(navOption3);

        settingsContainer.appendChild(navigationOptionsContainer);

    }

    // Apply saved settings
    function applySavedSettings() {
        let savedBackgroundColour = localStorage.getItem('backgroundColour');
        if (savedBackgroundColour) {
            console.log('Applying saved background colour:', savedBackgroundColour);
            setBackgroundColour(savedBackgroundColour);
        }
        else{
            console.log('Applying default background colour:', defaultBackgroundColour);
            setBackgroundColour(defaultBackgroundColour);
        }
        let savedTypeface = localStorage.getItem('fontTypeface');
        if(savedTypeface) {
            console.log('Applying saved font typeface:', savedTypeface);
            setTypeface(savedTypeface);
        }
        else{
            console.log('Applying default font typeface:', defaultTypeface);
            setTypeface(defaultTypeface);
        }
        let savedNavButtonsView = localStorage.getItem('navButtonsView');
        if(savedNavButtonsView){
            console.log('Applying saved navigation buttons:', savedNavButtonsView);
            setNavButtons(savedNavButtonsView);
        }
        else{
            console.log('Applying default navigation buttons:', defaultNavButtons);
            setNavButtons(defaultNavButtons);
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
            .catch(error => console.error("Error loading tutorial data: ", error));
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

            if(index === tutorialPages.length - 1){
                localStorage.setItem('tutorialCompleted', "true");
            }

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

    ////// Progress functions //////

    // Page showing the available grades
    function renderProgressPage(){
        document.getElementById("page-title").innerHTML = "Choose the grade you want to work on";
        let mainContainer = document.getElementById("main-container");
        let progressContainer = document.createElement('div');
        progressContainer.setAttribute('id', "progressContainer");

        for(i = 0; i < availableGrades.length; i++){
            let gradeBlock = document.createElement('div');
            let thisGrade = availableGrades[i];
            gradeBlock.innerHTML = "Grade " + thisGrade;
           
            let highestGradeCompleted = localStorage.getItem('highestGradeCompleted');
            if(highestGradeCompleted){
                if(thisGrade <= parseInt(highestGradeCompleted)+1){ renderAvailableGradeBlock(gradeBlock, thisGrade); }
                else{ renderUnavailableGradeBlock(gradeBlock); }
            }
            else{
                if(thisGrade === 1){ renderAvailableGradeBlock(gradeBlock, thisGrade); }
                else{ renderUnavailableGradeBlock(gradeBlock); }
            }
            progressContainer.appendChild(gradeBlock);
        }
        mainContainer.appendChild(progressContainer);
    }

    // Store the current grade in the session storage
    function setCurrentGrade(grade){
        sessionStorage.setItem('currentGrade', grade);
    }

    function renderAvailableGradeBlock(gradeBlock, gradeNumber){
        gradeBlock.setAttribute('class', "availableGradeBlock");
        gradeBlock.addEventListener('click', function(){
            setCurrentGrade(gradeNumber);
            changeSiteSection("GRADEHOMEPAGE");
        });
    }

    function renderUnavailableGradeBlock(gradeBlock){
        gradeBlock.setAttribute('class', "unavailableGradeBlock");
    }

    // Page showing topics within the grade
    function renderGradeHomePage(grade){
        document.getElementById("page-title").innerHTML = "Choose your topic";
        fetch("./content/"+grade+"-topics.json")
            .then(response => response.json())
            .then(gradeData => {
                gradeTopics = gradeData;
                renderGradeTopics(grade, gradeTopics);                
            })
            .catch(error => console.error("Error loading grade "+grade+" topics: ", error));
    }

    function renderGradeTopics(grade, gradeTopics){
        let mainContainer = document.getElementById("main-container");
        let gradeTopicsContainer = document.createElement('div');
        gradeTopicsContainer.setAttribute('id', "gradeTopicsContainer");

        for(i = 0; i < gradeTopics.length; i++){
            let topicBlock = document.createElement('div');
            let thisTopic = gradeTopics[i];
            topicBlock.innerHTML = thisTopic.name;
           
            let highestTopicCompleted = localStorage.getItem('highestTopicCompletedGrade'+grade);
            if(highestTopicCompleted){
                if(thisTopic <= parseInt(highestTopicCompleted)+1){ renderAvailableTopicBlock(topicBlock, thisGrade); }
                else{ renderUnavailableTopicBlock(topicBlock); }
            }
            else{
                if(i === 0){ renderAvailableTopicBlock(topicBlock, i); }
                else{ renderUnavailableTopicBlock(topicBlock); }
            }
            gradeTopicsContainer.appendChild(topicBlock);
        }
        mainContainer.appendChild(gradeTopicsContainer);
        renderBackArrow();

        document.getElementById("backButtonImageContainer").addEventListener('click', function() {
            changeSiteSection("LEARN");
        });
    }

    function setCurrentTopic(topicIndex) {
        sessionStorage.setItem('currentTopic', topicIndex);
    }

    function renderAvailableTopicBlock(topicBlock, topicIndex) {
        topicBlock.setAttribute('class', "availableTopicBlock");
        topicBlock.addEventListener('click', function(){
            setCurrentTopic(topicIndex);
            changeSiteSection("CONTENT");
        });
    }

    function renderUnavailableTopicBlock(topicBlock) {
        topicBlock.setAttribute('class', "unavailableTopicBlock");
    }

    ////// Content and questions //////
    

    ////// Misc helper functions //////

    // Function to render the forward and back arrows
    function renderNextBackArrows() {
        let footer = document.getElementById("footer");
        footer.style.display = "flex";
        footer.style.justifyContent = "space-between";
        createBackArrow();
        createNextArrow();
    }

    function renderNextArrow(){
        let footer = document.getElementById("footer");
        footer.style.display = "flex";
        footer.style.justifyContent = "flex-end";
        createNextArrow();
    }

    function renderBackArrow(){
        let footer = document.getElementById("footer");
        footer.style.display = "flex";
        footer.style.justifyContent = "flex-start";
        createBackArrow();
    }

    function createBackArrow() {
        let backButtonImageContainer = document.createElement('div');
        backButtonImageContainer.setAttribute('id', "backButtonImageContainer");
        let backButtonImage = document.createElement('img');
        backButtonImage.setAttribute('id', "backButtonImage");
        backButtonImage.src = "/images/leftArrow.png";
        backButtonImage.width = arrowImageWidth;
        backButtonImageContainer.appendChild(backButtonImage);
        footer.appendChild(backButtonImageContainer);
    }

    function createNextArrow(){
        let nextButtonImageContainer = document.createElement('div');
        nextButtonImageContainer.setAttribute('id', "nextButtonImageContainer");
        let nextButtonImage = document.createElement('img');
        nextButtonImage.setAttribute('id', "nextButtonImage");
        nextButtonImage.src = "/images/rightArrow.png";
        nextButtonImage.width = arrowImageWidth;
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

    ////// Render the page content //////
    applySavedSettings();
    updatePageContent();

});
