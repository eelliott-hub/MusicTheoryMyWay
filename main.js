document.addEventListener('DOMContentLoaded', function() {
    
    // Variables for site navigation
    let siteSection = "HOME"; // HOME, LEARN, CONTENT, QUIZ, SETTINGS, TUTORIAL, GLOSSARY
    const availableGrades = [1, 2, 3, 4, 5];
    let tutorialPages = [];
    let currentTutorialIndex = 0;
    let topicContent = [];
    let currentQuestionIndex = 0;
    let currentQuizIndex = 0;

    // Default settings
    const defaultBackgroundColour = "#f5f5f5";
    const defaultTypeface = "Verdana, sans-serif";
    const defaultNavButtons = "both";
   
    // Variables for sizes
    const arrowImageWidth = 80;
    const imagesOnlyNavButtonImageWidth = 50;
    const bothNavButtonImageWidth = 40;
    const homePageButtonImageWidth = 100;

    // Number of questions in quiz
    const quizNumber = 10;



    // TODO NEXT to make this an MVP
        // Storing progress within topics and grades - need to store number of right answers to questions
        // Progress bar?
        // Logic of other kinds of questions
        // Make a random selection of correct and incorrect messages, or totally slimline it and make have just tick/green or cross/red?
        // Increment grade when all questions completed
        // Capture quiz scores and show when quiz is finished

        // Improve question sections:
            // Modular Functions: Functions like createQuestionContainer, createQuestionImagesContainer, createQuestionImageContainer, and createQuestionTextContainer modularize the code, making it easier to read and maintain.
            // Event Delegation: The event listener could be added to the parent container (questionImagesContainer). This is more efficient and makes it easier to handle events for dynamically added or removed elements.
        // Forward arrow event handlers are all very similar - break out into a function with arguments
        // Add some more console messages and error handling

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
        "Font size and spacing (in progress)",
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
            const currentGrade = sessionStorage.getItem('currentGrade');
            renderGradeHomePage(currentGrade);
        }
        else if(siteSection === "CONTENT"){
            const topicId = getCurrentTopicId();
            loadContent(topicId);
        }
        else if(siteSection === "QUIZ"){
            renderQuiz();
        }
        else if(siteSection === "SETTINGS"){
            currentSettingsIndex = 0;
            renderSettingsPage(currentSettingsIndex);
        }
        else if(siteSection === "TUTORIAL"){
            loadTutorialData();
        }
        else if(siteSection === "GLOSSARY"){
            loadGlossary();
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
        const button = document.getElementById(buttonName+"-button");
        button.innerHTML = "";
        button.innerHTML = buttonText;
        button.style.fontSize = "20pt";
        button.style.textAlign = "center";
        button.style.padding = "20px 0";
        button.style.fontWeight = "bold";
    }

    // Images only
    function navButtonImage(buttonName) {
        const button = document.getElementById(buttonName+"-button");
        button.innerHTML = "";
        const img = document.createElement('img');
        img.src = "./images/navigation/" + buttonName + ".png";
        img.alt = buttonName + " button";
        img.width = imagesOnlyNavButtonImageWidth;
        img.style.display = "block";
        img.style.margin = "0 auto";
        button.appendChild(img);
    }

    // Text and images
    function navButtonImageText(buttonName, buttonText) {
        const button = document.getElementById(buttonName+"-button");
        button.innerHTML = "";
        const container = document.createElement('div');
        container.style.display = "flex";
        container.style.alignItems = "center";
        const img = document.createElement('img');
        img.src = "./images/navigation/" + buttonName + ".png";
        img.alt = buttonName + " button";
        img.width = bothNavButtonImageWidth;
        img.style.marginRight = "5px";
        const text = document.createElement('span');
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
        const pageTitle = "Welcome to Music Theory My Way!";
        const introText = "It looks like you are new to this site. Take the tutorial to learn your way around.";
        const buttonNav = "tutorial";
        const buttonText = "Take the tutorial";
        const siteSectionTo = "TUTORIAL";
        const buttonColour = "#ffff00";
        renderHomePage(pageTitle, introText, buttonNav, buttonText, siteSectionTo, buttonColour);
    }

    function renderHomePageSettings(){
        const pageTitle = "Welcome back to Music Theory My Way!";
        const introText = "Adjust the settings to suit your learning preferences.";
        const buttonNav = "settings";
        const buttonText = "Go to settings";
        const siteSectionTo = "SETTINGS";
        const buttonColour = "#ffa500";
        renderHomePage(pageTitle, introText, buttonNav, buttonText, siteSectionTo, buttonColour);
    }

    function renderHomePageStartLearn(){
        const pageTitle = "Welcome back to Music Theory My Way!";
        const introText = "";
        const buttonNav = "learn";
        const buttonText = "Start learning now";
        const siteSectionTo = "LEARN";
        const buttonColour = "#6ff36f";
        renderHomePage(pageTitle, introText, buttonNav, buttonText, siteSectionTo, buttonColour);
    }

    function renderHomePageContinueLearn(){
        const pageTitle = "Welcome back to Music Theory My Way!";
        const introText = "Click the music notes to continue learning.";
        const buttonNav = "learn";
        const buttonText = "Contibue learning now";
        const siteSectionTo = "LEARN";
        const buttonColour = "#6ff36f";
        renderHomePage(pageTitle, introText, buttonNav, buttonText, siteSectionTo, buttonColour);
    }

    function renderHomePage(pageTitle, introText, buttonNav, buttonText, siteSectionTo, buttonColour) {
        document.getElementById("page-title").innerHTML = pageTitle;
        const div = document.createElement('div');
        div.setAttribute('class', "homePageContainer");
        div.innerHTML = introText;
        const mainContainer = document.getElementById("main-container");
        mainContainer.appendChild(div);

        const homePageContainer = document.createElement('div');
        homePageContainer.setAttribute('class', "homePageContainer");

        const homePageButton = createHomePageButton("homePageButton", buttonNav, buttonText, buttonColour);
        homePageContainer.appendChild(homePageButton);

        mainContainer.appendChild(homePageContainer);

        addHomePageEventListener(siteSectionTo, "homePageButton");
    }

    function addHomePageEventListener(siteSectionTo, elementId) {
        const homePageButton = document.getElementById(elementId);
        if (homePageButton) {
            homePageButton.addEventListener('click', function() {
                changeSiteSection(siteSectionTo);
            });
        }
    }

    // Big button on home page
    function createHomePageButton(buttonId, buttonName, buttonText, buttonColour) {
        const homePageButton = document.createElement('div');
        homePageButton.setAttribute('class', 'bigHomeButton');
        homePageButton.setAttribute('id', buttonId);
        homePageButton.style.backgroundColor = buttonColour;

        const img = document.createElement('img');
        img.src = "./images/navigation/" + buttonName + ".png";
        img.alt = "Big " + buttonName + " button";
        img.width = homePageButtonImageWidth;
        
        const text = document.createElement('span');
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
            
            const mainContainer = document.getElementById("main-container");
            const settingsContainer = document.createElement('div');
            settingsContainer.setAttribute('id', "settingsContainer");

            const settingsSubheadingContainer = document.createElement('div');
            settingsSubheadingContainer.setAttribute('id', "settingsSubheadingContainer");

            const settingsSubheading = document.createElement('h2');
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
                // TO DO
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
            .then(colours => {
                renderColourOptions(colours);
            })
            .catch(error => console.error("Error loading colours:", error)); 
    }

    function renderColourOptions(colourData){
        const colourContainer = document.createElement('div');
        colourContainer.setAttribute('id', "colourContainer");

        colourData.forEach(colour => {
            const colourBlock = document.createElement('div');
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
        .then(typefaces => {
            renderFontTypefaceOptions(typefaces);
        })
        .catch(error => console.error("Error loading typefaces:", error)); 
    }

    function renderFontTypefaceOptions(typefaceData){
        const typefaceContainer = document.createElement('div');
        typefaceContainer.setAttribute('id', "typefaceContainer");

        typefaceData.forEach(typeface => {
            const typefaceBlock = document.createElement('div');
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

        const navigationOptionsContainer = document.createElement('div');
        navigationOptionsContainer.setAttribute('id', "navigationOptionsContainer");

        // Split these out into separate functions?? 

        const navOption1 = document.createElement('div');
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

        const navOption2 = document.createElement('div');
        navOption2.setAttribute('class', "navOptionContainer");
        navOption2.setAttribute('class', "nav-button");

        const img2 = document.createElement('img');
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

        const navOption3 = document.createElement('div');
        navOption3.setAttribute('class', "navOptionContainer");
        navOption3.setAttribute('class', "nav-button");

        const container = document.createElement('div');
        container.style.display = "flex";
        container.style.alignItems = "center";
        const img3 = document.createElement('img');
        img3.src = "./images/navigation/learn.png";
        img3.alt = "Learn button";
        img3.width = bothNavButtonImageWidth;
        img3.style.marginRight = "5px";
        const text = document.createElement('span');
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
        const savedBackgroundColour = localStorage.getItem('backgroundColour');
        if (savedBackgroundColour) {
            console.log('Applying saved background colour:', savedBackgroundColour);
            setBackgroundColour(savedBackgroundColour);
        }
        else{
            console.log('Applying default background colour:', defaultBackgroundColour);
            setBackgroundColour(defaultBackgroundColour);
        }
        const savedTypeface = localStorage.getItem('fontTypeface');
        if(savedTypeface) {
            console.log('Applying saved font typeface:', savedTypeface);
            setTypeface(savedTypeface);
        }
        else{
            console.log('Applying default font typeface:', defaultTypeface);
            setTypeface(defaultTypeface);
        }
        const savedNavButtonsView = localStorage.getItem('navButtonsView');
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
    
            const mainContainer = document.getElementById("main-container");
            const tutorialContainer = document.createElement('div');
            tutorialContainer.setAttribute('id', "tutorialContainer");

            const tutorialImageContainer = document.createElement('div');
            tutorialImageContainer.setAttribute('id', 'tutorialImageContainer');
            tutorialImageContainer.style.backgroundColor = page.colour;

            const tutorialImage = document.createElement('img');
            tutorialImage.setAttribute('id', 'tutorialImage');

            tutorialImageContainer.appendChild(tutorialImage);

            const tutorialTextContainer = document.createElement('div');
            tutorialTextContainer.setAttribute('id', 'tutorialTextContainer');

            const tutorialSubheading = document.createElement('h2');
            tutorialSubheading.setAttribute('id', 'tutorialSubheading');

            const tutorialText = document.createElement('p');
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
        const mainContainer = document.getElementById("main-container");
        const progressContainer = document.createElement('div');
        progressContainer.setAttribute('id', "progressContainer");

        for(let i = 0; i < availableGrades.length; i++){
            const gradeBlock = document.createElement('div');
            const thisGrade = availableGrades[i];
            gradeBlock.innerHTML = "Grade " + thisGrade;
           
            const highestGradeCompleted = getHighestGradeCompleted(); 
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
            .then(gradeTopics => {
                renderGradeTopics(grade, gradeTopics);                
            })
            .catch(error => console.error("Error loading grade "+grade+" topics: ", error));
    }

    function renderGradeTopics(grade, gradeTopics){
        const mainContainer = document.getElementById("main-container");
        const gradeTopicsContainer = document.createElement('div');
        gradeTopicsContainer.setAttribute('id', "gradeTopicsContainer");

        for(i = 0; i < gradeTopics.length; i++){
            const topicBlock = document.createElement('div');
            const thisTopic = gradeTopics[i];
            topicBlock.innerHTML = thisTopic.name;
            
            const highestTopicCompleted = getHighestTopicCompleted(grade);
            if(i === 0){ renderAvailableTopicBlock(topicBlock, i, thisTopic.id); }
            else if(i <= (highestTopicCompleted+1)){ renderAvailableTopicBlock(topicBlock, i, thisTopic.id); }
            else{ renderUnavailableTopicBlock(topicBlock); }

            gradeTopicsContainer.appendChild(topicBlock);
        }
        mainContainer.appendChild(gradeTopicsContainer);

        renderBackArrow();
        document.getElementById("backButtonImageContainer").addEventListener('click', function() {
            changeSiteSection("LEARN");
        });
    }

    function renderAvailableTopicBlock(topicBlock, topicIndex, topicId) {
        topicBlock.setAttribute('class', "availableTopicBlock");
        topicBlock.addEventListener('click', function(){
            setCurrentTopic(topicIndex, topicId);
            changeSiteSection("CONTENT");
        });
    }

    function renderUnavailableTopicBlock(topicBlock) {
        topicBlock.setAttribute('class', "unavailableTopicBlock");
    }

    ////// Content and questions //////

    function loadContent(topicId) {
        const grade = getCurrentGrade();
        fetch(`content/${grade}-${topicId}.json`)
        .then(response => response.json())
        .then(topicData => {
            topicContent = topicData;
            currentQuestionIndex = 0; // Reset index when entering topic content
            renderContentPage(topicContent, currentQuestionIndex);                   
        })
        .catch(error => console.error("Error loading topic data: ", error));
    }

    function renderContentPage(topicContent, index) {
        if (index >= 0 && index < topicContent.length) {
            const item = topicContent[index];

            emptyMainText();
            emptyFooter();
        
            if(item.contentType === "information"){
                renderInformation(item);
            }

            else if(item.contentType === "question") {
                renderQuestion(item);
            }
        } 
        
        else {
            console.error('Page index out of range:', index);
        }
    }

    function renderInformation(item){
        document.getElementById("page-title").innerHTML = item.pageTitle;
        const mainContainer = document.getElementById("main-container");
        const informationContainer = document.createElement('div');
        informationContainer.setAttribute('id', "informationContainer");
        mainContainer.appendChild(informationContainer);

        const informationImagesContainer = document.createElement('div');
        informationImagesContainer.setAttribute('id', "informationImagesContainer");
        const numImages = item.images.length;
        informationImagesContainer.style.gridTemplateColumns = "repeat("+numImages+", 1fr)";
        informationContainer.appendChild(informationImagesContainer);

        for (i = 0; i < numImages; i++){
            const informationImageContainer = document.createElement('div');
            informationImageContainer.setAttribute('class', "informationImageContainer");
            const image = document.createElement('img');
            const source = item.images[i];
            image.src = source;
            image.setAttribute('class', "informationImage");
            informationImageContainer.appendChild(image);
            informationImagesContainer.appendChild(informationImageContainer);
        }

        const informationTextContainer = document.createElement('div');
        informationTextContainer.setAttribute('id', "informationTextContainer");
        informationContainer.appendChild(informationTextContainer);
        const informationText = item.text;
        informationTextContainer.innerHTML = informationText;

        renderNextArrow();
        document.getElementById("nextButtonImageContainer").addEventListener('click', function() {
            finishContent(topicContent);
        });
    }

    function renderQuestion(item) {
        document.getElementById("page-title").innerHTML = "";
        const mainContainer = document.getElementById("main-container");
        const questionContainer = document.createElement('div');
        questionContainer.setAttribute('id', "questionContainer");
        mainContainer.appendChild(questionContainer);
    
        const questionImagesContainer = document.createElement('div');
        questionImagesContainer.setAttribute('id', "questionImagesContainer");
        const numImages = item.images.length;
        questionImagesContainer.style.gridTemplateColumns = "repeat(" + numImages + ", 1fr)";
        questionContainer.appendChild(questionImagesContainer);
    
        let answerSelected = false; // Flag to track if answer has been selected
    
        // Function to handle click on an answer option
        function handleAnswerClick(index) {
            if (!answerSelected) {
                answerSelected = true; 
    
                for (let i = 0; i < numImages; i++) {
                    const answerContainer = document.getElementById(i);
                    answerContainer.removeEventListener('click', answerClickHandlers[i]);
                    answerContainer.style.pointerEvents = 'none'; // Disable pointer events
                }
    
                // Determine if selected answer is correct
                checkAnswer(item, index);
            }
        }
    
        // Array to store event handler references
        const answerClickHandlers = [];
    
        // Create answer options
        for (let i = 0; i < numImages; i++) {
            const questionImageContainer = document.createElement('div');
            questionImageContainer.setAttribute('class', "questionImageContainer");
            questionImageContainer.setAttribute('id', i);
            const image = document.createElement('img');
            const source = item.images[i];
            image.src = source;
            image.setAttribute('class', "questionImage");
            questionImageContainer.appendChild(image);
            questionImagesContainer.appendChild(questionImageContainer);
    
            // Create event handler for each answer option
            const answerClickHandler = function() {
                handleAnswerClick(i);
            };
    
            answerClickHandlers.push(answerClickHandler);
    
            // Add click event listener to answer option
            questionImageContainer.addEventListener('click', answerClickHandler);
        }
    
        const questionTextContainer = document.createElement('div');
        questionTextContainer.setAttribute('id', "questionTextContainer");
        questionContainer.appendChild(questionTextContainer);
        const questionText = item.text;
        questionTextContainer.innerHTML = questionText;
    
        function checkAnswer(question, chosenAnswerIndex) {
            const correctAnswerIndex = question.correctAnswer;
    
            if (correctAnswerIndex === chosenAnswerIndex) {
                handleCorrectAnswer(chosenAnswerIndex);
            } 
            else {
                handleIncorrectAnswer(chosenAnswerIndex);
            }
        }

        function handleCorrectAnswer(chosenAnswerIndex){
            const correctSelected = document.getElementById(chosenAnswerIndex);
            correctSelected.style.borderColor = "#328032";
            correctSelected.style.borderWidth = "4px";
            const answerText = "Correct!";
            questionTextContainer.innerHTML = answerText;

            renderNextArrow();
            document.getElementById("nextButtonImageContainer").addEventListener('click', function() {
                finishContent(topicContent);
            });
        }

        function handleIncorrectAnswer(chosenAnswerIndex){
            const incorrectSelected = document.getElementById(chosenAnswerIndex);
            incorrectSelected.style.borderColor = "#ed3b4d";
            incorrectSelected.style.borderWidth = "4px";
            const answerText = "Not quite! Would you like to try again?";
            questionTextContainer.innerHTML = answerText;

            const incorrectAnswerContainer = document.createElement('div');
            incorrectAnswerContainer.setAttribute('id', 'incorrectAnswerContainer');

            const tryAgainContainer = document.createElement('div');
            tryAgainContainer.setAttribute('id', "tryAgainContainer");
            tryAgainContainer.innerHTML = "Try again";

            tryAgainContainer.addEventListener('click', function(){
                renderContentPage(topicContent, currentQuestionIndex);
            });

            const helpContainer = document.createElement('div');
            helpContainer.setAttribute('id', "helpContainer");
            helpContainer.innerHTML = "See the correct answer";

            helpContainer.addEventListener('click', function(){
                showCorrectAnswer(item);
            });

            incorrectAnswerContainer.appendChild(tryAgainContainer);
            incorrectAnswerContainer.appendChild(helpContainer);

            questionContainer.appendChild(incorrectAnswerContainer);
        }

        function showCorrectAnswer(){
            // Highlight the correct answer in green
            const correctAnswerIndex = item.correctAnswer;
            const correctSelected = document.getElementById(correctAnswerIndex);
            correctSelected.style.borderColor = "#328032";
            correctSelected.style.borderWidth = "4px";

            // Clear the border from the incorrect answer if there was one
            for (let i = 0; i < item.images.length; i++) {
                if (i !== correctAnswerIndex) {
                    const incorrectSelected = document.getElementById(i);
                    incorrectSelected.style.borderColor = "";
                    incorrectSelected.style.borderWidth = "";
                }
            }

            // Add explanatory text
            questionTextContainer.innerHTML = item.explanation;

            // Remove other options
            incorrectAnswerContainer.remove();
            
            // Add next button
            renderNextArrow();
            document.getElementById("nextButtonImageContainer").addEventListener('click', function() {
                finishContent(topicContent);
            });
        }
    }

    function finishContent(topicContent){
        currentQuestionIndex++;
        if (currentQuestionIndex >= topicContent.length) {
            if(getCurrentTopicIndex() > getHighestTopicCompleted(getCurrentGrade())){
                incrementHighestTopicCompleted(getCurrentGrade());
            }
            changeSiteSection("GRADEHOMEPAGE");               
        } 
        else {
            renderContentPage(topicContent, currentQuestionIndex);
        }
    }

    ////// Quiz //////

    async function renderQuiz(){
        console.log("Rendering quiz...");
        document.getElementById("page-title").innerHTML = "Quiz";
        const highestGradeCompleted = getHighestGradeCompleted();
        const maxQuizGrade = highestGradeCompleted + 1;
        const highestTopicCompleted = getHighestTopicCompleted(maxQuizGrade);
        console.log("Max quiz grade:", maxQuizGrade);
        console.log("Highest topic completed:", highestTopicCompleted);


        if(maxQuizGrade === 1 && highestTopicCompleted === -1){
            console.log("No quiz available yet.");
            emptyMainText();
            emptyFooter();  
            renderNoQuiz();
        }

        else {
            generateQuizData(maxQuizGrade, highestTopicCompleted)
                .then(quizQuestions => {
                    console.log("Quiz questions:", quizQuestions);
                    console.log("Number of quiz questions:", quizQuestions.length);
                    currentQuizIndex = 0;
                    renderQuizPage(quizQuestions, currentQuizIndex);
                })
                .catch(error => console.error("Error generating quiz data:", error));
        }
    }

    function renderNoQuiz(){
        document.getElementById("page-title").innerHTML = "No quiz available yet!";
        const div = document.createElement('div');
        div.setAttribute('class', "noQuizContainer");
        div.innerHTML = "It doesn't look like you've started learning yet.";
        const mainContainer = document.getElementById("main-container");
        mainContainer.appendChild(div);

        const noQuizContainer = document.createElement('div');
        noQuizContainer.setAttribute('class', "noQuizContainer");

        const noQuizButton = createHomePageButton("noQuizButton", "learn", "Click to start learning", "#6ff36f");
        noQuizContainer.appendChild(noQuizButton);

        mainContainer.appendChild(noQuizContainer);

        addHomePageEventListener("LEARN", "noQuizButton");
    }
    
    function renderQuizPage(quizQuestions, index){
        if (index >= 0 && index < quizQuestions.length) {
            const item = quizQuestions[index];
    
            emptyMainText();
            emptyFooter();
            renderQuizQuestion(item, quizQuestions);
    
        } else {
            console.error('Page index out of range:', index);
        }
    }
    
    async function generateQuizData(maxQuizGrade, highestTopicCompleted) {
        console.log("Generating quiz data for max grade:", maxQuizGrade, "and highest topic completed:", highestTopicCompleted);
    
        let quizQuestions = [];
    
        try {
            // Loop through grades up to the maxQuizGrade
            for (let grade = 1; grade <= maxQuizGrade; grade++) {
                let gradeTopics = await loadTopicsForGrade(grade);
                console.log(`Grade ${grade} topics:`, gradeTopics);
    
                for (let i = 0; i < gradeTopics.length; i++) {
                    let topicId = gradeTopics[i].id;
                    console.log(`Loading questions for grade ${grade} and topic ${topicId}...`);
    
                    if (grade < maxQuizGrade || (grade === maxQuizGrade && i <= highestTopicCompleted)) {
                        let questions = await loadQuestions(grade, topicId);
                        console.log(`Questions for ${topicId}:`, questions);
                        quizQuestions = quizQuestions.concat(questions);
                    }
                }
            }
    
            quizQuestions = shuffleArray(quizQuestions);
            console.log("Shuffled quiz questions:", quizQuestions);
        } catch (error) {
            console.error("Error generating quiz data:", error);
        }
    
        return quizQuestions.slice(0, quizNumber-1);
    }
    
    async function loadTopicsForGrade(grade) {
        try {
            let response = await fetch(`content/${grade}-topics.json`);
            let data = await response.json();
            return data;
        } catch (error) {
            console.error("Error loading topic data: ", error);
            return [];
        }
    }
    
    async function loadQuestions(grade, topicId) {
        try {
            console.log(`Loading questions for grade ${grade} and topic ${topicId}...`);
    
            let response = await fetch(`content/${grade}-${topicId}.json`);
            let data = await response.json();
            let questions = data.filter(item => item.contentType === 'question');
            console.log(`Questions loaded:`, questions);
    
            return questions;
        } catch (error) {
            console.error(`Error loading questions for grade ${grade} and topic ${topicId}: `, error);
            return [];
        }
    }
    
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function renderQuizQuestion(item, quizQuestions){
        const mainContainer = document.getElementById("main-container");
        const quizContainer = document.createElement('div');
        quizContainer.setAttribute('id', "quizContainer");
        mainContainer.appendChild(quizContainer);
    
        const quizImagesContainer = document.createElement('div');
        quizImagesContainer.setAttribute('id', "quizImagesContainer");
        const numImages = item.images.length;
        quizImagesContainer.style.gridTemplateColumns = "repeat(" + numImages + ", 1fr)";
        quizContainer.appendChild(quizImagesContainer);
    
        let answerSelected = false; // Flag to track if answer has been selected
    
        // Function to handle click on an answer option
        function handleQuizAnswerClick(index) {

            if (!answerSelected) {
                answerSelected = true; 
    
                for (let i = 0; i < numImages; i++) {
                    const quizAnswerContainer = document.getElementById(i);
                    quizAnswerContainer.removeEventListener('click', quizAnswerClickHandlers[i]);
                    quizAnswerContainer.style.pointerEvents = 'none'; // Disable pointer events
                }
    
                // Determine if selected answer is correct
                checkQuizAnswer(item, index);
            }
        }
    
        // Array to store event handler references
        const quizAnswerClickHandlers = [];
    
        // Create answer options
        for (let i = 0; i < numImages; i++) {
            const quizImageContainer = document.createElement('div');
            quizImageContainer.setAttribute('class', "quizImageContainer");
            quizImageContainer.setAttribute('id', i);
            const quizImage = document.createElement('img');
            const source = item.images[i];
            quizImage.src = source;
            quizImage.setAttribute('class', "quizImage");
            quizImageContainer.appendChild(quizImage);
            quizImagesContainer.appendChild(quizImageContainer);
    
            // Create event handler for each answer option
            const quizAnswerClickHandler = function() {
                handleQuizAnswerClick(i);
            };
    
            quizAnswerClickHandlers.push(quizAnswerClickHandler);
    
            // Add click event listener to answer option
            quizImageContainer.addEventListener('click', quizAnswerClickHandler);
        }
    
        const quizTextContainer = document.createElement('div');
        quizTextContainer.setAttribute('id', "quizTextContainer");
        quizContainer.appendChild(quizTextContainer);
        const quizText = item.text;
        quizTextContainer.innerHTML = quizText;
    
        function checkQuizAnswer(question, chosenAnswerIndex) {
            const correctAnswerIndex = question.correctAnswer;
    
            if (correctAnswerIndex === chosenAnswerIndex) {
                handleCorrectQuizAnswer(chosenAnswerIndex);
            } 
            else {
                handleIncorrectQuizAnswer(chosenAnswerIndex);
            }
        }

        function handleCorrectQuizAnswer(chosenAnswerIndex){
            console.log("Handling correct quiz answer...");
            const correctSelected = document.getElementById(chosenAnswerIndex);
            correctSelected.style.borderColor = "#328032";
            correctSelected.style.borderWidth = "4px";
            const answerText = "Correct!";
            quizTextContainer.innerHTML = answerText;

            renderNextArrow();
            finishQuiz(quizQuestions);
        }

        function handleIncorrectQuizAnswer(chosenAnswerIndex){
            console.log("Handling incorrect quiz answer...");
            const incorrectSelected = document.getElementById(chosenAnswerIndex);
            incorrectSelected.style.borderColor = "#ed3b4d";
            incorrectSelected.style.borderWidth = "4px";
            const answerText = "Not quite! Would you like to try again?";
            quizTextContainer.innerHTML = answerText;

            const incorrectAnswerContainer = document.createElement('div');
            incorrectAnswerContainer.setAttribute('id', 'incorrectAnswerContainer');

            const tryAgainContainer = document.createElement('div');
            tryAgainContainer.setAttribute('id', "tryAgainContainer");
            tryAgainContainer.innerHTML = "Try again";

            tryAgainContainer.addEventListener('click', function(){
                renderQuizPage(quizQuestions, currentQuizIndex);
            });

            const helpContainer = document.createElement('div');
            helpContainer.setAttribute('id', "helpContainer");
            helpContainer.innerHTML = "See the correct answer";

            helpContainer.addEventListener('click', function(){
                showCorrectAnswer(item);
            });

            incorrectAnswerContainer.appendChild(tryAgainContainer);
            incorrectAnswerContainer.appendChild(helpContainer);

            quizContainer.appendChild(incorrectAnswerContainer);
        }

        function showCorrectAnswer(){
            // Highlight the correct answer in green
            const correctAnswerIndex = item.correctAnswer;
            const correctSelected = document.getElementById(correctAnswerIndex);
            correctSelected.style.borderColor = "#328032";
            correctSelected.style.borderWidth = "4px";

            // Clear the border from the incorrect answer if there was one
            for (let i = 0; i < item.images.length; i++) {
                if (i !== correctAnswerIndex) {
                    const incorrectSelected = document.getElementById(i);
                    incorrectSelected.style.borderColor = "";
                    incorrectSelected.style.borderWidth = "";
                }
            }

            // Add explanatory text
            quizTextContainer.innerHTML = item.explanation;

            // Remove other options
            incorrectAnswerContainer.remove();
            
            // Add next button
            renderNextArrow();
            finishQuiz(quizQuestions);
        }

        function finishQuiz(quizQuestions){
            document.getElementById("nextButtonImageContainer").addEventListener('click', function() {
                currentQuizIndex++;
                if (currentQuizIndex >= quizQuestions.length) {
                    changeSiteSection("HOME");
                } else {
                    renderQuizPage(quizQuestions, currentQuizIndex);
                }
            });
        }
    }
    

    ////// Glossary //////
    
    function loadGlossary(){
        document.getElementById("page-title").innerHTML = "Glossary";

        fetch("glossary.json")
        .then(response => response.json())
        .then(data => {
            generateGlossary(data);
        })
        .catch(error => {
            console.error('Error fetching the glossary data:', error);
        });
    }

    function generateGlossary(data) {
        
        const glossaryContainer = document.createElement('div');
        glossaryContainer.setAttribute('id', 'glossaryContainer');

        data.forEach(item => {
            const glossaryRow = document.createElement('div');
            glossaryRow.className = 'glossary-row';

            const termDiv = document.createElement('div');
            termDiv.setAttribute('class', "termDiv");
            termDiv.textContent = item.term;
            glossaryRow.appendChild(termDiv);

            const imageDiv = document.createElement('div');
            if (item.image !== "null") {
                const image = document.createElement('img');
                image.src = item.image;
                image.alt = item.term;
                imageDiv.appendChild(image);
            } else {
                imageDiv.innerHTML = '&nbsp;'; // Render an empty space
            }
            glossaryRow.appendChild(imageDiv);

            const definitionDiv = document.createElement('div');
            definitionDiv.innerHTML = item.definition;
            glossaryRow.appendChild(definitionDiv);

            glossaryContainer.appendChild(glossaryRow);

            const hr = document.createElement('hr');
            glossaryContainer.appendChild(hr);
        });

        const mainContainer = document.getElementById("main-container");
        mainContainer.appendChild(glossaryContainer);
    }


    ////// Misc helper functions //////

    /// Functions to render the forward and back arrows ///
    function renderNextBackArrows() {
        const footer = document.getElementById("footer");
        footer.style.display = "flex";
        footer.style.justifyContent = "space-between";
        createBackArrow();
        createNextArrow();
    }

    function renderNextArrow(){
        const footer = document.getElementById("footer");
        footer.style.display = "flex";
        footer.style.justifyContent = "flex-end";
        createNextArrow();
    }

    function renderBackArrow(){
        const footer = document.getElementById("footer");
        footer.style.display = "flex";
        footer.style.justifyContent = "flex-start";
        createBackArrow();
    }

    function createBackArrow() {
        const backButtonImageContainer = document.createElement('div');
        backButtonImageContainer.setAttribute('id', "backButtonImageContainer");
        const backButtonImage = document.createElement('img');
        backButtonImage.setAttribute('id', "backButtonImage");
        backButtonImage.src = "/images/leftArrow.png";
        backButtonImage.width = arrowImageWidth;
        backButtonImageContainer.appendChild(backButtonImage);
        footer.appendChild(backButtonImageContainer);
    }

    function createNextArrow(){
        const nextButtonImageContainer = document.createElement('div');
        nextButtonImageContainer.setAttribute('id', "nextButtonImageContainer");
        const nextButtonImage = document.createElement('img');
        nextButtonImage.setAttribute('id', "nextButtonImage");
        nextButtonImage.src = "/images/rightArrow.png";
        nextButtonImage.width = arrowImageWidth;
        nextButtonImageContainer.appendChild(nextButtonImage);
        footer.appendChild(nextButtonImageContainer);
    }

    /// Functions to clear elements before rending new ones ///

    // Clear the main element
    function emptyMainText() {
        document.getElementById("main-container").innerHTML = "";
    }

    // Clear the footer
    function emptyFooter(){
        document.getElementById("footer").innerHTML = "";
    }

    /// Functions related to storing progress in local and session storage ///
        // Grades are actual grade numbers, so start from 1
        // Topics are indexes, so start from 0

    // Set the highest grade completed
    function setHighestGradeCompleted(grade){
        localStorage.setItem('highestGradeCompleted', grade);
    }

    // Get the highest grade completed from local storage
    function getHighestGradeCompleted(){
        const highestGradeCompleted = localStorage.getItem('highestGradeCompleted');
        if(highestGradeCompleted === null){
            return 0;
        }
        else{
            return parseInt(localStorage.getItem('highestGradeCompleted'));
        }    
    }

    // Store the current grade in the session storage
    function setCurrentGrade(grade){
        sessionStorage.setItem('currentGrade', grade);
    }

    // Get the current grade from session storage
    function getCurrentGrade(){
        return sessionStorage.getItem('currentGrade');
    }

    // Set the index of the highest topic completed in local storage
    function setHighestTopicCompleted(grade, index){
        localStorage.setItem('highestTopicCompletedGrade'+grade, index);
    }

    // Get the index of the highest topic completed from local storage
    function getHighestTopicCompleted(grade){
        const highestTopicCompleted = localStorage.getItem('highestTopicCompletedGrade'+grade);
        if (highestTopicCompleted === null){
            return -1;
        }
        else {
            return parseInt(highestTopicCompleted);
        }
    }

    // Increment the highest topic completed
    function incrementHighestTopicCompleted(grade) {
        let highestTopicCompleted = getHighestTopicCompleted(grade);
        if(getCurrentTopicIndex() > getHighestTopicCompleted()){
            highestTopicCompleted++;
        }
        setHighestTopicCompleted(grade, highestTopicCompleted);
    }

    // Set the current topic in session storage
    function setCurrentTopic(topicIndex, topicId) {
        sessionStorage.setItem('currentTopicIndex', topicIndex);
        sessionStorage.setItem('currentTopicId', topicId);
    }

    // Get the current topic id from session storage
    function getCurrentTopicId(){
        return sessionStorage.getItem('currentTopicId');
    }

    // Get the current topic index from session storage
    function getCurrentTopicIndex(){
        return parseInt(sessionStorage.getItem('currentTopicIndex'));
    }

    ////// Render the page content //////
    applySavedSettings();
    updatePageContent();

});
