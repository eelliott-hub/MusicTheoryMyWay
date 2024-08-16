document.addEventListener('DOMContentLoaded', function() {

    // Variables for site navigation
    let siteSection = "HOME"; // HOME, LEARN, CONTENT, QUIZ, SETTINGS, TOUR, GLOSSARY, ABOUT
    const availableGrades = [1, 2, 3, 4, 5];
    let tourPages = [];
    let currentTourIndex = 0;
    let currentSettingsIndex = 0;
    let topicContent = [];
    let currentQuestionIndex = 0;
    let currentQuizIndex = -1;
    let quizResult = 0;
    let quizResultsData = [];
    let quizAll;

    // Default settings
    const defaultBackgroundColour = "#f5f5f5";
    const defaultTypeface = "Verdana, sans-serif";
    const defaultFontSize = "24px";
    const defaultCharSpacing = "0.2px";
    const defaultNavButtons = "both";
    const highestAvailableTopic = 2;

    // Variables for sizes
    const arrowImageWidth = 80;
    const imagesOnlyNavButtonImageWidth = 50;
    const bothNavButtonImageWidth = 40;
    const homePageButtonImageWidth = 100;
    const maxFontSize = 34;
    const minFontSize = 14;
    const maxCharSpacing = 6.0;
    const minCharSpacing = 0.2;

    // Number of questions in quiz
    const quizNumber = 10;

    // Text to speech set-up variable
    let speechSynthesis = window.speechSynthesis;

    // Sounds
    let rightSound = new Audio('./Sounds/right-answer.wav');
    let wrongSound = new Audio('./Sounds/wrong-answer.wav');
    

    // Uncomment temporarily to clear elements of local storage
        // localStorage.clear();
        // localStorage.removeItem("tourCompleted");
        // localStorage.removeItem("settingsChanged");
        // localStorage.removeItem("currentTopicId");
        // localStorage.removeItem("currentGrade");

    // Set to make grade 2 available
        // localStorage.setItem('highestGradeCompleted', "1");
    

    // Settings variables
    const settingsPageTitles = [
        "Background colour",
        "Font",
        "Font size and spacing",
        "Navigation buttons",
        "Sound effects"
    ];

    ////// Main function to update page content //////
    function updatePageContent(){
        if (speechSynthesis.speaking) {
            speechSynthesis.cancel();
        }
        emptyMainText();
        emptyFooter();
        highlightCurrentNav();
        if(siteSection != "CONTENT"){
            removeProgressBar();
        }

        if(siteSection === "HOME") {
            if (!localStorage.getItem('tourCompleted', "true")) { renderHomePageTour(); }
            else if (!localStorage.getItem('settingsChanged', "true")) { renderHomePageSettings(); }
            else if (!localStorage.getItem('learningStarted', "true")) { renderHomePageStartLearn(); }
            else { renderHomePageContinueLearn(); }
        }
        else if(siteSection === "LEARN"){
            const currentTopicId = sessionStorage.getItem('currentTopicId');
            console.log("Current Topic Id: " + currentTopicId);
            if(!currentTopicId){
                renderProgressPage();
            }
            else {
                siteSection = "CONTENT";
                loadContent(currentTopicId);
            }
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
        else if(siteSection === "TOUR"){
            loadTourData();
        }
        else if(siteSection === "GLOSSARY"){
            loadGlossary();
        }
        else if(siteSection === "ABOUT"){
            renderAboutPage();
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
            navButtonText("tour", "Tour");
            navButtonText("glossary", "Glossary");
            navButtonText("about", "About");
        } else if (variant === "images") {
            navButtonImage("home");
            navButtonImage("learn");
            navButtonImage("quiz");
            navButtonImage("settings");
            navButtonImage("tour");
            navButtonImage("glossary");
            navButtonImage("about");
        } else {
            navButtonImageText("home", "Home");
            navButtonImageText("learn", "Learn");
            navButtonImageText("quiz", "Quiz");
            navButtonImageText("settings", "Settings");
            navButtonImageText("tour", "Tour");
            navButtonImageText("glossary", "Glossary");
            navButtonImageText("about", "About");
        }
    }

    // Text only
    function navButtonText(buttonName, buttonText) {
        const button = document.getElementById(buttonName+"-button");
        button.innerHTML = "";
        button.innerHTML = buttonText;
        button.style.fontSize = "24px";
        button.style.textAlign = "center";
        button.style.padding = "20px 0";
        button.style.fontWeight = "bold";
    }

    // Images only
    function navButtonImage(buttonName) {
        const button = document.getElementById(buttonName+"-button");
        button.innerHTML = "";
        const img = document.createElement('img');
        img.src = "images/navigation/" + buttonName + ".png";
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
        img.src = "images/navigation/" + buttonName + ".png";
        img.alt = buttonName + " button";
        img.width = bothNavButtonImageWidth;
        img.style.marginRight = "5px";
        const text = document.createElement('span');
        text.innerHTML = buttonText;
        text.style.fontSize = "24px";
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
    addNavigationEventListener("home-button", "HOME");
    addNavigationEventListener("learn-button", "LEARN");
    addNavigationEventListener("quiz-button", "QUIZ");
    addNavigationEventListener("settings-button", "SETTINGS");
    addNavigationEventListener("tour-button", "TOUR");
    addNavigationEventListener("glossary-button", "GLOSSARY");
    addNavigationEventListener("about-button", "ABOUT");

    function addNavigationEventListener(buttonName, sectionToGoTo){
        document.getElementById(buttonName).addEventListener('click', function(){
            changeSiteSection(sectionToGoTo);
        });
        document.getElementById(buttonName).addEventListener('keydown', function(event){
            if (event.key === 'Enter') {
                changeSiteSection(sectionToGoTo);
            }
        });
    }

    ////// Home page functions //////

    // TODO change to JSON file instead?
    function renderHomePageTour(){
        const pageTitle = "Welcome to Music Theory My Way!";
        const introText = "Music Theory My Way is designed to be dyslexia-friendly and customisable to suit your learning preferences, and provides information and quizzes about music theory topics up to Grade 5.<br><br>It looks like you are new to this site. Take the tour to learn your way around.";
        const buttonNav = "tour";
        const buttonText = "Take the tour";
        const siteSectionTo = "TOUR";
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
        const introText = "Click the music notes to start learning.";
        const buttonNav = "learn";
        const buttonText = "Start learning now";
        const siteSectionTo = "LEARN";
        const buttonColour = "#6ff36f";
        renderHomePage(pageTitle, introText, buttonNav, buttonText, siteSectionTo, buttonColour);
    }

    function renderHomePageContinueLearn(){
        const pageTitle = "Welcome back to Music Theory My Way!";
        const introText = "";
        const buttonNav = "learn";
        const buttonText = "Continue learning now";
        const siteSectionTo = "LEARN";
        const buttonColour = "#6ff36f";
        renderHomePage(pageTitle, introText, buttonNav, buttonText, siteSectionTo, buttonColour);
    }

    function renderHomePage(pageTitle, introText, buttonNav, buttonText, siteSectionTo, buttonColour) {
        document.getElementById("page-title").innerHTML = pageTitle;
        const div = document.createElement('div');
        div.setAttribute('class', "homePageTextContainer");
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
            homePageButton.addEventListener('keydown', function(event) {
                if (event.key === 'Enter') {
                    changeSiteSection(siteSectionTo);
                }
            });
        }
    }

    // Big button on home page
    function createHomePageButton(buttonId, buttonName, buttonText, buttonColour) {
        const homePageButton = document.createElement('div');
        homePageButton.setAttribute('class', 'bigHomeButton');
        homePageButton.setAttribute('id', buttonId);
        homePageButton.setAttribute('role', "button");
        homePageButton.style.backgroundColor = buttonColour;
        homePageButton.tabIndex = 0;

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

    function renderSettingsPage(index){

        if(index >= 0 && index < settingsPageTitles.length){
            emptyMainText();
            emptyFooter();
            document.getElementById("page-title").innerHTML = "Settings";

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

            document.getElementById("nextButtonImageContainer").addEventListener('keydown', function(event) {
                if (event.key === 'Enter') {
                    currentSettingsIndex++;
                    if (currentSettingsIndex >= settingsPageTitles.length) {
                        changeSiteSection("HOME");
                    } else {
                        renderSettingsPage(currentSettingsIndex);
                    }
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

            document.getElementById("backButtonImageContainer").addEventListener('keydown', function(event) {
                if (event.key === 'Enter') {
                    currentSettingsIndex--;
                    if (currentSettingsIndex < 0) {
                        changeSiteSection("HOME");
                    } else {
                        renderSettingsPage(currentSettingsIndex);
                    }
                }
            });

            if(index === 0){
                renderBackgroundColourSettings();
            }
            else if(index === 1){
                renderFontTypefaceSettings();
            }
            else if(index === 2){
                renderOtherFontSettings();
            }
            else if(index === 3){
                renderNavigationButtonSettings();
            }
            else if(index === 4){
                renderSoundEffectSettings();
            }
        }

        else {
            console.error('Page index out of range:', index);
        }
    }

    function renderBackgroundColourSettings(){
        fetch('backgroundColours.json')
            .then((response) => response.json())
            .then((colours) => {
                renderColourOptions(colours);
            })
            .catch((error) => console.error("Error loading colours:", error));
    }

    function renderColourOptions(colourData){

        const backgroundColourText = document.createElement('div');
        backgroundColourText.setAttribute('id', "backgroundColourText");
        backgroundColourText.innerHTML = "Click on your chosen colour to change the background colour for text and musical notes.<br>";
        const settingsContainer = document.getElementById("settingsContainer");
        settingsContainer.appendChild(backgroundColourText);

        // Add speech controls
        const settingsSubheading = document.getElementById("settingsSubheading");
        const textToRead = settingsSubheading.innerHTML + " . " + backgroundColourText.innerHTML;
        addSettingsSpeechControls("backgroundColour", textToRead);

         // Add individual colours
        const colourContainer = document.createElement('div');
        colourContainer.setAttribute('id', "colourContainer");

        colourData.forEach((colour) => {
            const colourBlock = document.createElement('div');
            colourBlock.setAttribute('class', "colourBlock");
            colourBlock.setAttribute('id', colour.colourText);
            colourBlock.setAttribute('role', "button");
            colourBlock.style.backgroundColor = colour.colourCode;
            colourBlock.innerHTML = colour.colourText;
            colourBlock.tabIndex = 0;
            colourBlock.addEventListener('click', function(){
                changeBackgroundColour(colour.colourCode);
                localStorage.setItem('settingsChanged', "true");
            });
            colourBlock.addEventListener('keydown', function(event){
                if (event.key === 'Enter') {
                    changeBackgroundColour(colour.colourCode);
                    localStorage.setItem('settingsChanged', "true");
                }
            });
            colourContainer.appendChild(colourBlock);
            if(localStorage.getItem('backgroundColour') === colour.colourCode){
                colourBlock.classList.add('chosen');
            }
            else{
                colourBlock.classList.remove('chosen');
            }
        });
        settingsContainer.appendChild(colourContainer);
    }

    function changeBackgroundColour(newBackgroundColour) {
        console.log('Changing background colour to:', newBackgroundColour);
        setBackgroundColour(newBackgroundColour);
        localStorage.setItem('backgroundColour', newBackgroundColour);

        var colourBlocks = document.getElementsByClassName('colourBlock');
        for (var i = 0; i < colourBlocks.length; i++) {
            if(localStorage.getItem('backgroundColour') === "#f5f5f5" && colourBlocks[i].innerHTML === "White"){
                colourBlocks[i].classList.add('chosen');
            }
            else if(localStorage.getItem('backgroundColour') === "#f7f4cf" && colourBlocks[i].innerHTML === "Cream"){
                colourBlocks[i].classList.add('chosen'); 
            }
            else if(localStorage.getItem('backgroundColour') === "#c8fac9" && colourBlocks[i].innerHTML === "Green"){
                colourBlocks[i].classList.add('chosen');
            }
            else if(localStorage.getItem('backgroundColour') === "#f7e4cd" && colourBlocks[i].innerHTML === "Peach"){
                colourBlocks[i].classList.add('chosen'); 
            }
            else if(localStorage.getItem('backgroundColour') === "#bccaf7" && colourBlocks[i].innerHTML === "Blue"){
                colourBlocks[i].classList.add('chosen');
            }
            else if(localStorage.getItem('backgroundColour') === "#ded5da" && colourBlocks[i].innerHTML === "Grey"){
                colourBlocks[i].classList.add('chosen'); 
            }
            else{
                colourBlocks[i].classList.remove('chosen');
            }
        }
    }

    function setBackgroundColour(backgroundColour){
        document.getElementById('nav').style.backgroundColor = backgroundColour;
        document.getElementById('header').style.backgroundColor = backgroundColour;
        document.getElementById('main').style.backgroundColor = backgroundColour;
        document.getElementById('footer').style.backgroundColor = backgroundColour;
    }

    function renderFontTypefaceSettings(){
        fetch('fontTypefaces.json')
        .then((response) => response.json())
        .then((typefaces) => {
            renderFontTypefaceOptions(typefaces);
        })
        .catch((error) => console.error("Error loading typefaces:", error));
    }

    function renderFontTypefaceOptions(typefaceData){
        const typefaceText = document.createElement('div');
        typefaceText.setAttribute('id', "typefaceText");
        typefaceText.innerHTML = "Click below to choose your prefered font.<br>";
        const settingsContainer = document.getElementById("settingsContainer");
        settingsContainer.appendChild(typefaceText);

        // Add speech controls
        const settingsSubheading = document.getElementById("settingsSubheading");
        const textToRead = settingsSubheading.innerHTML + " . " + typefaceText.innerHTML;
        addSettingsSpeechControls("typeface", textToRead);

         // Add individual typefaces
        const typefaceContainer = document.createElement('div');
        typefaceContainer.setAttribute('id', "typefaceContainer");

        typefaceData.forEach((typeface) => {
            const typefaceBlock = document.createElement('div');
            typefaceBlock.setAttribute('class', "typefaceBlock");
            typefaceBlock.setAttribute('role', "button");
            typefaceBlock.style.fontFamily = typeface.fontFamily;
            typefaceBlock.innerHTML = typeface.fontText;
            typefaceBlock.tabIndex = 0;

            typefaceBlock.addEventListener('click', function(){
                changeTypeface(typeface.fontFamily);
                localStorage.setItem('settingsChanged', "true");
            });
            typefaceBlock.addEventListener('keydown', function(event){
                if (event.key === 'Enter') {
                    changeTypeface(typeface.fontFamily);
                    localStorage.setItem('settingsChanged', "true");
                }
            });
            typefaceContainer.appendChild(typefaceBlock);
            if(localStorage.getItem('fontTypeface') === typeface.fontFamily){
                typefaceBlock.classList.add('chosen');
            }
            else{
                typefaceBlock.classList.remove('chosen');
            }
        });
        settingsContainer.appendChild(typefaceContainer);
    }

    function changeTypeface(newTypeface){
        console.log('Changing font typeface to:', newTypeface);
        setTypeface(newTypeface);
        localStorage.setItem('fontTypeface', newTypeface);
        var typefaceBlocks = document.getElementsByClassName('typefaceBlock');
        for (var i = 0; i < typefaceBlocks.length; i++) {
            if(localStorage.getItem('fontTypeface') === "OpenSans, sans-serif" && typefaceBlocks[i].innerHTML === "Open Sans"){
                typefaceBlocks[i].classList.add('chosen');
            }
            else if(localStorage.getItem('fontTypeface') === "Helvetica, sans-serif" && typefaceBlocks[i].innerHTML === "Helvetica"){
                typefaceBlocks[i].classList.add('chosen'); 
            }
            else if(localStorage.getItem('fontTypeface') === "Verdana, sans-serif" && typefaceBlocks[i].innerHTML === "Verdana"){
                typefaceBlocks[i].classList.add('chosen');
            }
            else if(localStorage.getItem('fontTypeface') === "'Comic Sans MS', 'Comic Sans', sans-serif" && typefaceBlocks[i].innerHTML === "Comic Sans"){
                typefaceBlocks[i].classList.add('chosen'); 
            }
            else if(localStorage.getItem('fontTypeface') === "'Lucida Console', monospace" && typefaceBlocks[i].innerHTML === "Lucida Console"){
                typefaceBlocks[i].classList.add('chosen');
            }
            else if(localStorage.getItem('fontTypeface') === "OpenDyslexic, sans-serif" && typefaceBlocks[i].innerHTML === "Open Dyslexic"){
                typefaceBlocks[i].classList.add('chosen'); 
            }
            else{
                typefaceBlocks[i].classList.remove('chosen');
            }
        }
    }

    function setTypeface(typeface){
        document.body.style.fontFamily = typeface;
    }

    function renderOtherFontSettings() {

        const otherFontText = document.createElement('div');
        otherFontText.setAttribute('id', "otherFontText");
        otherFontText.innerHTML = "Click the buttons below to increase or decrease your font size and character spacing.<br>";
        const settingsContainer = document.getElementById("settingsContainer");
        settingsContainer.appendChild(otherFontText);

        // Add speech controls
        const settingsSubheading = document.getElementById("settingsSubheading");
        const textToRead = settingsSubheading.innerHTML + " . " + otherFontText.innerHTML;
        addSettingsSpeechControls("otherFont", textToRead);

        const otherFontContainer = document.createElement('div');
        otherFontContainer.setAttribute('id', "otherFontContainer");

        settingsContainer.appendChild(otherFontContainer);

        const decreaseFontSizeButton = document.createElement('div');
        decreaseFontSizeButton.setAttribute('id', "decreaseFontSizeButton");
        decreaseFontSizeButton.setAttribute('class', "fontButton");
        decreaseFontSizeButton.setAttribute('role', "button");
        decreaseFontSizeButton.innerHTML = 'Decrease font size';
        decreaseFontSizeButton.onclick = function() { adjustFontSize('decrease'); };
        decreaseFontSizeButton.onkeydown = function(event) { if (event.key === 'Enter') { adjustFontSize('decrease'); } };
        decreaseFontSizeButton.tabIndex = 0;
        otherFontContainer.appendChild(decreaseFontSizeButton);
        const tooltip1 = createTooltip("Minimum reached!");
        decreaseFontSizeButton.appendChild(tooltip1);

        const increaseFontSizeButton = document.createElement('div');
        increaseFontSizeButton.setAttribute('id', "increaseFontSizeButton");
        increaseFontSizeButton.setAttribute('class', "fontButton");
        increaseFontSizeButton.setAttribute('role', "button");
        increaseFontSizeButton.textContent = 'Increase font size';
        increaseFontSizeButton.onclick = function() { adjustFontSize('increase'); };
        increaseFontSizeButton.onkeydown = function(event) { if (event.key === 'Enter') { adjustFontSize('increase'); } };
        increaseFontSizeButton.tabIndex = 0;
        otherFontContainer.appendChild(increaseFontSizeButton);
        const tooltip2 = createTooltip("Maximum reached!");
        increaseFontSizeButton.appendChild(tooltip2);

        const decreaseSpacingButton = document.createElement('div');
        decreaseSpacingButton.setAttribute('id', "decreaseSpacingButton");
        decreaseSpacingButton.setAttribute('class', "fontButton");
        decreaseSpacingButton.setAttribute('role', "button");
        decreaseSpacingButton.textContent = 'Decrease character spacing';
        decreaseSpacingButton.onclick = function() { adjustCharSpacing('decrease'); };
        decreaseSpacingButton.onkeydown = function(event) { if (event.key === 'Enter') { adjustCharSpacing('decrease'); } };
        decreaseSpacingButton.tabIndex = 0;
        otherFontContainer.appendChild(decreaseSpacingButton);
        const tooltip3 = createTooltip("Minimum reached!");
        decreaseSpacingButton.appendChild(tooltip3);

        const increaseSpacingButton = document.createElement('div');
        increaseSpacingButton.setAttribute('id', "increaseSpacingButton");
        increaseSpacingButton.setAttribute('class', "fontButton");
        increaseSpacingButton.setAttribute('role', "button");
        increaseSpacingButton.textContent = 'Increase character spacing';
        increaseSpacingButton.onclick = function() { adjustCharSpacing('increase'); };
        increaseSpacingButton.onkeydown = function(event) { if (event.key === 'Enter') { adjustCharSpacing('increase'); } };
        increaseSpacingButton.tabIndex = 0;
        otherFontContainer.appendChild(increaseSpacingButton);
        const tooltip4 = createTooltip("Maximum reached!");
        increaseSpacingButton.appendChild(tooltip4);

    }

    function adjustFontSize(action){
        const body = document.body;
        let currentFontSize = parseFloat(window.getComputedStyle(body, null).getPropertyValue('font-size'));
        if(action === "increase"){
           if(currentFontSize < maxFontSize) { 
                increaseFontSizeButton.classList.remove('minMaxReached');
                currentFontSize ++; 
                localStorage.setItem('settingsChanged', "true");
                console.log("Font size increased.");
            }
           else{
                increaseFontSizeButton.classList.add('minMaxReached');
           }
        }
        else {
            if(currentFontSize > minFontSize){ 
                decreaseFontSizeButton.classList.remove('minMaxReached');
                currentFontSize --;
                localStorage.setItem('settingsChanged', "true"); 
                console.log("Font size decreased.");
            }
            else {
                decreaseFontSizeButton.classList.add('minMaxReached');
            }
        }
        assert(currentFontSize <= maxFontSize, "Font size cannot be greater than "+maxFontSize+".");
        assert(currentFontSize >= minFontSize, "Font size cannot be less than "+minFontSize+".");
        setFontSize(currentFontSize + "px");
        localStorage.setItem('fontSize', currentFontSize);
    }

    function setFontSize(size) {
        document.body.style.fontSize = size;
    }

    function adjustCharSpacing(action) {
        const body = document.body;
        let currentCharSpacing = parseFloat(window.getComputedStyle(body, null).getPropertyValue('letter-spacing'));
        if(action === "increase"){
            if(currentCharSpacing < maxCharSpacing) { 
                increaseSpacingButton.classList.remove('minMaxReached');
                currentCharSpacing += 0.2; 
                localStorage.setItem('settingsChanged', "true");
                console.log("Character spacing increased.");
            }
            else {
                increaseSpacingButton.classList.add('minMaxReached');
            }
        }
        else { 
            if(currentCharSpacing > minCharSpacing) { 
                decreaseSpacingButton.classList.remove('minMaxReached');
                currentCharSpacing -= 0.2; 
                localStorage.setItem('settingsChanged', "true");
                console.log("Character spacing decreased.");
            } 
        
            else {
                decreaseSpacingButton.classList.add('minMaxReached');

            }
        }
        assert(currentCharSpacing <= maxCharSpacing, "Character spacing cannot be greater than "+maxCharSpacing+".");
        assert(currentCharSpacing >= minCharSpacing, "Character spacing cannot be less than "+minCharSpacing+".");
        setCharSpacing(currentCharSpacing + "px");
        localStorage.setItem('charSpacing', currentCharSpacing);
    }

    function setCharSpacing(size) {
        document.body.style.letterSpacing = size;
    }

    function renderNavigationButtonSettings(){

        const navigationButtonText = document.createElement('div');
        navigationButtonText.setAttribute('id', "navigationButtonText");
        navigationButtonText.innerHTML = "Choose between text, icons or both from the options below.<br>";
        const settingsContainer = document.getElementById("settingsContainer");
        settingsContainer.appendChild(navigationButtonText);

        // Add speech controls
        const settingsSubheading = document.getElementById("settingsSubheading");
        const textToRead = settingsSubheading.innerHTML + " . " + navigationButtonText.innerHTML;
        addSettingsSpeechControls("navigationButtons", textToRead);

        const navigationOptionsContainer = document.createElement('div');
        navigationOptionsContainer.setAttribute('id', "navigationOptionsContainer");

        const navOption1 = document.createElement('div');
        navOption1.setAttribute('class', "navOptionContainer");
        navOption1.setAttribute('class', "nav-button");
        navOption1.setAttribute('role', "button");
        navOption1.innerHTML = "Learn";
        navOption1.style.fontSize = "24px";
        navOption1.style.textAlign = "center";
        navOption1.style.padding = "20px 0";
        navOption1.style.fontWeight = "bold";
        navOption1.style.backgroundColor = "#6ff36f";
        navOption1.tabIndex = 0;
        if(localStorage.getItem('navButtonsView') === "text"){
            navOption1.classList.add('chosen');
        }
        else{
            navOption1.classList.remove('chosen');
        }

        navOption1.addEventListener('click', function(){
            localStorage.setItem('navButtonsView', "text");
            localStorage.setItem('settingsChanged', "true");
            setNavButtons("text");
            navOption1.classList.add('chosen');
            navOption2.classList.remove('chosen');
            navOption3.classList.remove('chosen');
        });
        navOption1.addEventListener('keydown', function(event){
            if (event.key === 'Enter') {
                localStorage.setItem('navButtonsView', "text");
                localStorage.setItem('settingsChanged', "true");
                setNavButtons("text");
                navOption1.classList.add('chosen');
                navOption2.classList.remove('chosen');
                navOption3.classList.remove('chosen');
            }
        });

        navigationOptionsContainer.appendChild(navOption1);

        const navOption2 = document.createElement('div');
        navOption2.setAttribute('class', "navOptionContainer");
        navOption2.setAttribute('class', "nav-button");
        navOption2.setAttribute('role', "button");
        const img2 = document.createElement('img');
        img2.src = "./images/navigation/learn.png";
        img2.alt = "Learn button";
        img2.width = imagesOnlyNavButtonImageWidth;
        img2.style.display = "block";
        img2.style.margin = "0 auto";
        navOption2.style.backgroundColor = "#6ff36f";
        navOption2.appendChild(img2);
        navOption2.tabIndex = 0;
        if(localStorage.getItem('navButtonsView') === "images"){
            navOption2.classList.add('chosen');
        }
        else{
            navOption2.classList.remove('chosen');
        }

        navOption2.addEventListener('click', function(){
            localStorage.setItem('navButtonsView', "images");
            localStorage.setItem('settingsChanged', "true");
            setNavButtons("images");
            navOption1.classList.remove('chosen');
            navOption2.classList.add('chosen');
            navOption3.classList.remove('chosen');
        });
        navOption2.addEventListener('keydown', function(event){
            if (event.key === 'Enter') {
                localStorage.setItem('navButtonsView', "images");
                localStorage.setItem('settingsChanged', "true");
                setNavButtons("images");
                navOption1.classList.remove('chosen');
                navOption2.classList.add('chosen');
                navOption3.classList.remove('chosen');
            }
        });

        navigationOptionsContainer.appendChild(navOption2);

        const navOption3 = document.createElement('div');
        navOption3.setAttribute('class', "navOptionContainer");
        navOption3.setAttribute('class', "nav-button");
        navOption3.setAttribute('role', "button");
        navOption3.tabIndex = 0;

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
        text.style.fontSize = "24px";
        navOption3.style.backgroundColor = "#6ff36f";
        container.appendChild(img3);
        container.appendChild(text);
        navOption3.appendChild(container);
        if(localStorage.getItem('navButtonsView') === "both"){
            navOption3.classList.add('chosen');
        }
        else{
            navOption3.classList.remove('chosen');
        }

        navOption3.addEventListener('click', function(){
            localStorage.setItem('navButtonsView', "both");
            localStorage.setItem('settingsChanged', "true");
            setNavButtons("both");
            navOption1.classList.remove('chosen');
            navOption2.classList.remove('chosen');
            navOption3.classList.add('chosen');
        });
        navOption3.addEventListener('keydown', function(event){
            if (event.key === 'Enter') {
                localStorage.setItem('navButtonsView', "both");
                localStorage.setItem('settingsChanged', "true");
                setNavButtons("both");
                navOption1.classList.remove('chosen');
                navOption2.classList.remove('chosen');
                navOption3.classList.add('chosen');
            }
        });

        navigationOptionsContainer.appendChild(navOption3);

        settingsContainer.appendChild(navigationOptionsContainer);
    }

    function renderSoundEffectSettings() {
        const soundEffectsText = document.createElement('div');
        soundEffectsText.setAttribute('id', "soundEffectsText");
        soundEffectsText.innerHTML = "Tick the boxes if you want to hear these sound effects when you get a question right or wrong.<br>";
        const settingsContainer = document.getElementById("settingsContainer");
        settingsContainer.appendChild(soundEffectsText);

        // Add speech controls
        const settingsSubheading = document.getElementById("settingsSubheading");
        const textToRead = settingsSubheading.innerHTML + " . " + soundEffectsText.innerHTML;
        addSettingsSpeechControls("soundEffects", textToRead);
        const soundEffectsContainer = document.createElement('div');
        soundEffectsContainer.setAttribute('id', "soundEffectsContainer");
        settingsContainer.appendChild(soundEffectsContainer);

        // Right answer sound settings
        const rightAnswerButton = document.createElement('div');
        rightAnswerButton.setAttribute('id', "rightAnswerButton");
        rightAnswerButton.innerHTML = "Right answer  &#9658;";
        rightAnswerButton.setAttribute('role', "button");
        rightAnswerButton.tabIndex = 0;
        soundEffectsContainer.appendChild(rightAnswerButton);
        
        rightAnswerButton.addEventListener('click', function(){
            rightSound.play();
        });
        rightAnswerButton.addEventListener('keydown', function(event){
            if (event.key === 'Enter') {
                rightSound.play();
            }
        });

        const rightAnswerCheckboxContainer = document.createElement('div');
        rightAnswerCheckboxContainer.setAttribute('id', "rightAnswerCheckboxContainer");
        soundEffectsContainer.appendChild(rightAnswerCheckboxContainer);

        const rightAnswerCheckbox = document.createElement('input');
        rightAnswerCheckbox.setAttribute('type', "checkbox");
        rightAnswerCheckbox.setAttribute('id', 'rightAnswerCheckbox');
        rightAnswerCheckbox.tabIndex = 0;
        rightAnswerCheckboxContainer.appendChild(rightAnswerCheckbox);

        rightAnswerCheckbox.addEventListener('change', function() {
            localStorage.setItem('settingsChanged', "true");
            if (this.checked) {
              setRightAnswerSound("yes");
            } else {
              setRightAnswerSound("no");
            }
          });

        // Wrong answer sound settings
        const wrongAnswerButton = document.createElement('div');
        wrongAnswerButton.setAttribute('id', "wrongAnswerButton");
        wrongAnswerButton.innerHTML = "Wrong answer  &#9658;";
        wrongAnswerButton.setAttribute('role', "button");
        wrongAnswerButton.tabIndex = 0;
        soundEffectsContainer.appendChild(wrongAnswerButton);
        
        wrongAnswerButton.addEventListener('click', function(){
            wrongSound.play();
        });
        wrongAnswerButton.addEventListener('keydown', function(event){
            if (event.key === 'Enter') {
                wrongSound.play();
            }
        });

        const wrongAnswerCheckboxContainer = document.createElement('div');
        wrongAnswerCheckboxContainer.setAttribute('id', "wrongAnswerCheckboxContainer");
        soundEffectsContainer.appendChild(wrongAnswerCheckboxContainer);

        const wrongAnswerCheckbox = document.createElement('input');
        wrongAnswerCheckbox.setAttribute('type', "checkbox");
        wrongAnswerCheckbox.setAttribute('id', 'wrongAnswerCheckbox');
        wrongAnswerCheckbox.tabIndex = 0;
        wrongAnswerCheckboxContainer.appendChild(wrongAnswerCheckbox);

        wrongAnswerCheckbox.addEventListener('change', function() {
            localStorage.setItem('settingsChanged', "true");
            if (this.checked) {
              setWrongAnswerSound("yes");
            } else {
              setWrongAnswerSound("no");
            }
        });

        applySavedSoundEffectSettings();
    }

    function setRightAnswerSound(choice){
        localStorage.setItem('rightAnswerSound', choice);
    }

    function getRightAnswerSound(){
        return localStorage.getItem('rightAnswerSound');
    }

    function setWrongAnswerSound(choice){
        localStorage.setItem('wrongAnswerSound', choice);
    }

    function getWrongAnswerSound() {
        return localStorage.getItem('wrongAnswerSound');
    }

    function addSettingsSpeechControls(settingName, textToRead){
        const settingsContainer = document.getElementById("settingsContainer");
        const speechButtonsContainer = document.createElement('div');
        speechButtonsContainer.setAttribute('class', "speechButtonsContainer");
        speechButtonsContainer.setAttribute('id', settingName+"SpeechButtonsContainer");
        settingsContainer.appendChild(speechButtonsContainer);
        createSpeechButtons(settingName+"SpeechButtonsContainer", settingName+"PlayButton", settingName+"PauseButton", textToRead, "BOTH");
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
        const savedFontSize = localStorage.getItem('fontSize');
        if (savedFontSize) {
            console.log('Applying saved font size: ', savedFontSize);
            setFontSize(savedFontSize+"px");
        }
        else {
            console.log('Applying default font size: 18pt');
            setFontSize(defaultFontSize);
        }
        const savedCharSpacing = localStorage.getItem('charSpacing');
        if (savedCharSpacing) {
            console.log('Applying saved letter spacing: ', savedCharSpacing);
            setCharSpacing(savedCharSpacing+"px");
        }
        else {
            console.log('Applying default letter spacing');
            setCharSpacing(defaultCharSpacing);
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

    function applySavedSoundEffectSettings(){
        const rightBox = document.getElementById("rightAnswerCheckbox");
        const savedRightAnswerSound = localStorage.getItem('rightAnswerSound');
        if(savedRightAnswerSound === "yes"){
            rightBox.checked = true;
        }
        else{
            rightBox.checked = false;
        }

        const wrongBox = document.getElementById("wrongAnswerCheckbox");
        const savedWrongAnswerSound = localStorage.getItem('wrongAnswerSound');
        if(savedWrongAnswerSound === "yes"){
            wrongBox.checked = true;
        }
        else{
            wrongBox.checked = false;
        }
    }

    ////// Tour functions //////

    // Function to load tour data
    function loadTourData() {
        fetch('tourData.json')
            .then((response) => response.json())
            .then((tourData) => {
                tourPages = tourData;
                currentTourIndex = 0; // Reset index when entering tour
                renderTourPage(currentTourIndex);
            })
            .catch((error) => console.error("Error loading tour data: ", error));
    }

    // Function to render tour page
    function renderTourPage(index) {
        if (index >= 0 && index < tourPages.length) {
            const page = tourPages[index];
            emptyMainText();
            emptyFooter();
            document.getElementById("page-title").innerHTML = "Tour";

            const mainContainer = document.getElementById("main-container");
            const tourContainer = document.createElement('div');
            tourContainer.setAttribute('id', "tourContainer");

            const tourImageContainer = document.createElement('div');
            tourImageContainer.setAttribute('id', 'tourImageContainer');
            tourImageContainer.style.backgroundColor = page.colour;

            const tourImage = document.createElement('img');
            tourImage.setAttribute('id', 'tourImage');
            tourImageContainer.appendChild(tourImage);

            const tourTextContainer = document.createElement('div');
            tourTextContainer.setAttribute('id', 'tourTextContainer');
            tourTextContainer.setAttribute('labelledby', "tourSubheading");

            const tourSubheading = document.createElement('h2');
            tourSubheading.setAttribute('id', 'tourSubheading');

            const tourText = document.createElement('p');
            tourText.setAttribute('id', 'tourText');

            tourTextContainer.appendChild(tourSubheading);
            tourTextContainer.appendChild(tourText);

            tourContainer.appendChild(tourImageContainer);
            tourContainer.appendChild(tourTextContainer);
            mainContainer.appendChild(tourContainer);

            document.getElementById('tourSubheading').innerHTML = page.subheading;
            document.getElementById('tourText').innerHTML = page.text;
            if (page.image != "null") {
                document.getElementById('tourImage').src = page.image;
                document.getElementById('tourImage').alt = page.altText;
            }

            // Add speech controls
            const speechButtonsContainer = document.createElement('div');
            speechButtonsContainer.setAttribute('class', "speechButtonsContainer");
            speechButtonsContainer.setAttribute('id', "tourSpeechButtonsContainer");

            tourTextContainer.appendChild(speechButtonsContainer);

            const textToRead = document.getElementById('tourSubheading').innerHTML + ' . ' + document.getElementById('tourText').innerHTML;
            createSpeechButtons("tourSpeechButtonsContainer", "tourPlayButton", "tourPauseButton", textToRead, "BOTH");

            renderNextBackArrows();

            if (index === tourPages.length - 1) {
                localStorage.setItem('tourCompleted', "true");
            }

            // Event listeners for navigation
            document.getElementById("nextButtonImageContainer").addEventListener('click', function() {
                currentTourIndex++;
                if (currentTourIndex >= tourPages.length) {
                    changeSiteSection("HOME");
                } else {
                    if (speechSynthesis.speaking) {
                        speechSynthesis.cancel();
                    }
                    renderTourPage(currentTourIndex);
                }
            });

            document.getElementById("nextButtonImageContainer").addEventListener('keydown', function(event) {
                if (event.key === 'Enter') {
                    currentTourIndex++;
                    if (currentTourIndex >= tourPages.length) {
                        changeSiteSection("HOME");
                    } else {
                        if (speechSynthesis.speaking) {
                            speechSynthesis.cancel();
                        }
                        renderTourPage(currentTourIndex);
                    }
                }
            });

            document.getElementById("backButtonImageContainer").addEventListener('click', function() {
                currentTourIndex--;
                if (currentTourIndex < 0) {
                    changeSiteSection("HOME");
                } else {
                    if (speechSynthesis.speaking) {
                        speechSynthesis.cancel();
                    }
                    renderTourPage(currentTourIndex);
                }
            });

            document.getElementById("backButtonImageContainer").addEventListener('keydown', function(event) {
                if (event.key === 'Enter') {
                    currentTourIndex--;
                    if (currentTourIndex < 0) {
                        changeSiteSection("HOME");
                    } else {
                        if (speechSynthesis.speaking) {
                            speechSynthesis.cancel();
                        }
                        renderTourPage(currentTourIndex);
                    }
                }
            });

        } else {
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
                if(thisGrade < parseInt(highestGradeCompleted)+1){ renderCompletedGradeBlock(gradeBlock, thisGrade); }
                else if(thisGrade <= parseInt(highestGradeCompleted)+1){ renderAvailableGradeBlock(gradeBlock, thisGrade);}
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
        gradeBlock.setAttribute('role', "button");
        gradeBlock.tabIndex = 0;
        gradeBlock.addEventListener('click', function(){
            setCurrentGrade(gradeNumber);
            changeSiteSection("GRADEHOMEPAGE");
        });
        gradeBlock.addEventListener('keydown', function(event){
            if (event.key === 'Enter') {
                setCurrentGrade(gradeNumber);
                changeSiteSection("GRADEHOMEPAGE");
            }
        });
        const tooltip = createTooltip("Your current grade!");
        gradeBlock.appendChild(tooltip);
    }

    function renderCompletedGradeBlock(gradeBlock, gradeNumber){
        gradeBlock.setAttribute('class', "completedGradeBlock");
        gradeBlock.setAttribute('role', "button");
        gradeBlock.tabIndex = 0;
        gradeBlock.addEventListener('click', function(){
            setCurrentGrade(gradeNumber);
            changeSiteSection("GRADEHOMEPAGE");
        });
        gradeBlock.addEventListener('keydown', function(event){
            if (event.key === 'Enter') {
                setCurrentGrade(gradeNumber);
                changeSiteSection("GRADEHOMEPAGE");
            }
        });
        const tooltip = createTooltip("Revise!");
        gradeBlock.appendChild(tooltip);
    }

    function renderUnavailableGradeBlock(gradeBlock){
        gradeBlock.setAttribute('class', "unavailableGradeBlock");
        const tooltip = createTooltip("Not available yet!");
        gradeBlock.appendChild(tooltip);
    }

    // Page showing topics within the grade

    function renderGradeHomePage(grade){
        document.getElementById("page-title").innerHTML = "Grade " + getCurrentGrade() + ": Choose your topic";
        fetch("./content/"+grade+"-topics.json")
            .then((response) => response.json())
            .then((gradeTopics) => {
                renderGradeTopics(grade, gradeTopics);
            })
            .catch((error) => console.error("Error loading grade "+grade+" topics: ", error));
    }

    function renderGradeTopics(grade, gradeTopics){
        const mainContainer = document.getElementById("main-container");
        const gradeTopicsContainer = document.createElement('div');
        gradeTopicsContainer.setAttribute('id', "gradeTopicsContainer");

        for(i = 0; i < gradeTopics.length; i++){
            const topicBlock = document.createElement('div');
            const thisTopic = gradeTopics[i];
            topicBlock.innerHTML = (i+1) + ". " + thisTopic.name;

            const highestTopicCompleted = getHighestTopicCompleted(grade);
            if(i === 0){
                if(highestTopicCompleted >= 0){ renderCompletedTopicBlock(topicBlock, i, thisTopic.id, thisTopic.name); }
                else{ renderAvailableTopicBlock(topicBlock, i, thisTopic.id, thisTopic.name); }
            }
            else if(i < (highestTopicCompleted+1)){ renderCompletedTopicBlock(topicBlock, i, thisTopic.id, thisTopic.name); }
            else if(i === (highestTopicCompleted+1) && i <= highestAvailableTopic){ renderAvailableTopicBlock(topicBlock, i, thisTopic.id, thisTopic.name); }
            else{ renderUnavailableTopicBlock(topicBlock); }

            gradeTopicsContainer.appendChild(topicBlock);
        }
        mainContainer.appendChild(gradeTopicsContainer);

        renderBackArrow();
        document.getElementById("backButtonImageContainer").addEventListener('click', function() {
            changeSiteSection("LEARN");
        });
        document.getElementById("backButtonImageContainer").addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                changeSiteSection("LEARN");
            }
        });
    }

    function renderAvailableTopicBlock(topicBlock, topicIndex, topicId, topicName) {
        topicBlock.setAttribute('class', "availableTopicBlock");
        topicBlock.setAttribute('role', "button");
        topicBlock.tabIndex = 0;
        topicBlock.addEventListener('click', function(){
            setCurrentTopic(topicIndex, topicId, topicName);
            changeSiteSection("CONTENT");
        });
        topicBlock.addEventListener('keydown', function(event){
            if (event.key === 'Enter') {
                setCurrentTopic(topicIndex, topicId);
                changeSiteSection("CONTENT");
            }
        });
        const tooltip = createTooltip("New topic!");
        topicBlock.appendChild(tooltip);
    }

    function renderCompletedTopicBlock(topicBlock, topicIndex, topicId, topicName){
        topicBlock.innerHTML += "   &#x2714;";
        topicBlock.setAttribute('class', "completedTopicBlock");
        topicBlock.setAttribute('role', "button");
        topicBlock.tabIndex = 0;
        topicBlock.addEventListener('click', function(){
            setCurrentTopic(topicIndex, topicId, topicName);
            changeSiteSection("CONTENT");
        });
        topicBlock.addEventListener('keydown', function(event){
            if (event.key === 'Enter') {
                setCurrentTopic(topicIndex, topicId, topicName);
                changeSiteSection("CONTENT");
            }
        });
        const tooltip = createTooltip("Revise!");
        topicBlock.appendChild(tooltip);
    }

    function renderUnavailableTopicBlock(topicBlock) {
        topicBlock.setAttribute('class', "unavailableTopicBlock");
        const tooltip = createTooltip("Not available yet!");
        topicBlock.appendChild(tooltip);
    }

    function createTooltip(tooltipText) {
        const tooltip = document.createElement('span');
        tooltip.setAttribute('class', "tooltip");
        tooltip.innerHTML = tooltipText;
        return tooltip;
    }

    ////// Content and questions //////

    function loadContent(topicId) {
        const grade = getCurrentGrade();
        fetch(`content/${grade}-${topicId}.json`)
        .then((response) => response.json())
        .then((topicData) => {
            topicContent = topicData;
            currentQuestionIndex = parseInt(sessionStorage.getItem('currentQuestionIndex'));
            if(!currentQuestionIndex){
                currentQuestionIndex = 0;
            }
            renderContentPage(topicContent, currentQuestionIndex);
        })
        .catch((error) => console.error("Error loading topic data: ", error));
        if(document.getElementById("page-title").innerHTML === "Grade " + getCurrentGrade() + ": Choose your topic"){
            document.getElementById("page-title").innerHTML = "Topic in production. Please click the back arrow.";
            createBackArrow();
            document.getElementById("backButtonImageContainer").addEventListener('click', function() {
                changeSiteSection("LEARN");
            });
            document.getElementById("backButtonImageContainer").addEventListener('keydown', function(event) {
                if (event.key === 'Enter') {
                    changeSiteSection("LEARN");
                }
            });
        }
    }

    function renderContentPage(topicContent, index) {
        if (index >= 0 && index < topicContent.length) {
            const item = topicContent[index];

            emptyMainText();
            emptyFooter();

            const progressBar = document.getElementById("progressBar");

            if(!progressBar){
                const progress = document.createElement('div');
                progress.setAttribute('id', "progress");
        
                const progressBar = document.createElement('div');
                progressBar.setAttribute('id', "progressBar");
        
                const header = document.getElementById("header-container");
                header.appendChild(progressBar);
                progressBar.appendChild(progress);
                
            }

            const progressPcnt = ((index+1)/topicContent.length)*100;
            progress.style.width = progressPcnt + "%";

            if(item.contentType === "information"){    
                renderInformation(item);
            }

            else if(item.contentType === "question") {
                renderQuestion(item);
            }
            else if(item.contentType === "rhythm") {
                renderRhythm(item);
            }
        }

        else {
            console.error('Page index out of range:', index);
        }
    }

    function renderInformation(item){
        document.getElementById("page-title").innerHTML = getCurrentTopicName() + ": " + item.pageTitle;
    
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
        informationTextContainer.innerHTML = informationText+"<br>";

        // Add speech controls
        const speechButtonsContainer = document.createElement('div');
        speechButtonsContainer.setAttribute('class', "speechButtonsContainer");
        speechButtonsContainer.setAttribute('id', "informationSpeechButtonsContainer");
        informationTextContainer.appendChild(speechButtonsContainer);
        const textToRead = informationTextContainer.innerHTML;
        createSpeechButtons("informationSpeechButtonsContainer", "informationPlayButton", "informationPauseButton", textToRead, "BOTH");

        renderNextBackArrows();
        document.getElementById("nextButtonImageContainer").addEventListener('click', function() {
            finishContent(topicContent);
        });
        document.getElementById("nextButtonImageContainer").addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                finishContent(topicContent);
            }
        });
        document.getElementById("backButtonImageContainer").addEventListener('click', function() {
            contentGoBack(topicContent);
        });
        document.getElementById("backButtonImageContainer").addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                contentGoBack(topicContent);
            }
        });
    }

    function renderQuestion(item) {
        document.getElementById("page-title").innerHTML =getCurrentTopicName() + ": Test your knowledge";
        const mainContainer = document.getElementById("main-container");
        const questionContainer = document.createElement('div');
        questionContainer.setAttribute('id', "questionContainer");
        mainContainer.appendChild(questionContainer);

        const questionImagesContainer = document.createElement('div');
        questionImagesContainer.setAttribute('id', "questionImagesContainer");
        const numImages = item.images.length;
        questionImagesContainer.style.gridTemplateColumns = "repeat(" + numImages + ", 1fr)";
        questionContainer.appendChild(questionImagesContainer);

        renderBackArrow();
        document.getElementById("backButtonImageContainer").addEventListener('click', function() {
            contentGoBack(topicContent);
        });
        document.getElementById("backButtonImageContainer").addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                contentGoBack(topicContent);
            }
        });
    
        let answerSelected = false; // Flag to track if answer has been selected

        // Function to handle click on an answer option
        function handleAnswerClick(index) {
            if (!answerSelected) {
                answerSelected = true;

                for (let i = 0; i < numImages; i++) {
                    const answerContainer = document.getElementById(i);
                    answerContainer.removeAttribute('role');
                    answerContainer.removeEventListener('click', answerClickHandlers[i]);
                    answerContainer.removeEventListener('keydown', answerKeydownHandlers[i]);
                    answerContainer.style.pointerEvents = 'none'; // Disable pointer events
                    answerContainer.tabIndex = -1;
                }

                // Determine if selected answer is correct
                checkAnswer(item, index);
            }
        }

        // Arrays to store event handler references
        const answerClickHandlers = [];
        const answerKeydownHandlers = [];

        // Create answer options
        for (let i = 0; i < numImages; i++) {
            const questionImageContainer = document.createElement('div');
            questionImageContainer.setAttribute('class', "questionImageContainer");
            questionImageContainer.setAttribute('id', i);
            questionImageContainer.setAttribute('role', "button");
            questionImageContainer.tabIndex = 0;
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

            const answerKeydownHandler = function(event) {
                if(event.key === 'Enter'){
                    handleAnswerClick(i);
                }
            };

            answerClickHandlers.push(answerClickHandler);
            answerKeydownHandlers.push(answerKeydownHandler);

            // Add click and keydown event listeners to answer option
            questionImageContainer.addEventListener('click', answerClickHandler);
            questionImageContainer.addEventListener('keydown', answerKeydownHandler);
        }

        const questionTextContainer = document.createElement('div');
        questionTextContainer.setAttribute('id', "questionTextContainer");
        questionContainer.appendChild(questionTextContainer);
        const questionText = item.text;
        questionTextContainer.innerHTML = questionText+"<br>";

        // Add speech controls
        const speechButtonsContainer = document.createElement('div');
        speechButtonsContainer.setAttribute('class', "speechButtonsContainer");
        speechButtonsContainer.setAttribute('id', "questionSpeechButtonsContainer");
        questionTextContainer.appendChild(speechButtonsContainer);
        const textToRead = questionTextContainer.innerHTML;
        createSpeechButtons("questionSpeechButtonsContainer", "questionPlayButton", "questionPauseButton", textToRead, "PLAY");

        function checkAnswer(question, chosenAnswerIndex) {
            const correctAnswerIndex = question.correctAnswer;
            const feedback = question.feedback[chosenAnswerIndex];
            
            if (correctAnswerIndex === chosenAnswerIndex) {
                handleCorrectAnswer(chosenAnswerIndex, feedback);
            }
            else {
                handleIncorrectAnswer(chosenAnswerIndex, feedback);
            }
        }

        function handleCorrectAnswer(chosenAnswerIndex, feedback){
            if(getRightAnswerSound() === "yes"){
                rightSound.play();
            }
            const correctSelected = document.getElementById(chosenAnswerIndex);
            correctSelected.style.borderColor = "#328032";
            correctSelected.style.borderWidth = "4px";
            const answerText = "Correct! " + feedback;
            questionTextContainer.innerHTML = answerText + "<br>";

            // Add speech controls
            const speechButtonsContainer = document.createElement('div');
            speechButtonsContainer.setAttribute('class', "speechButtonsContainer");
            speechButtonsContainer.setAttribute('id', "feedbackSpeechButtonsContainer");
            questionTextContainer.appendChild(speechButtonsContainer);
            const textToRead = questionTextContainer.innerHTML;
            createSpeechButtons("feedbackSpeechButtonsContainer", "feedbackPlayButton", "feedbackPauseButton", textToRead, "PLAY");

            const backButton = document.getElementById("backButtonImageContainer");
            backButton.remove();

            renderNextBackArrows();
            document.getElementById("nextButtonImageContainer").addEventListener('click', function() {
                finishContent(topicContent);
            });
            document.getElementById("nextButtonImageContainer").addEventListener('keydown', function(event) {
                if (event.key === 'Enter') {
                    finishContent(topicContent);
                }
            });
            document.getElementById("backButtonImageContainer").addEventListener('click', function() {
                contentGoBack(topicContent);
            });
            document.getElementById("backButtonImageContainer").addEventListener('keydown', function(event) {
                if (event.key === 'Enter') {
                    contentGoBack(topicContent);
                }
            });
        }

        function handleIncorrectAnswer(chosenAnswerIndex, feedback){
            if(getWrongAnswerSound() === "yes"){
                wrongSound.play();
            }
            const incorrectSelected = document.getElementById(chosenAnswerIndex);
            incorrectSelected.style.borderColor = "#ed3b4d";
            incorrectSelected.style.borderWidth = "4px";
            const answerText = "Not quite! " + feedback + " <br><br>";
            questionTextContainer.innerHTML = answerText;

             // Add speech controls
             const speechButtonsContainer = document.createElement('div');
             speechButtonsContainer.setAttribute('class', "speechButtonsContainer");
             speechButtonsContainer.setAttribute('id', "feedbackSpeechButtonsContainer");
             questionTextContainer.appendChild(speechButtonsContainer);
             const textToRead = questionTextContainer.innerHTML;
             createSpeechButtons("feedbackSpeechButtonsContainer", "feedbackPlayButton", "feedbackPauseButton", textToRead, "PLAY");

            const incorrectAnswerContainer = document.createElement('div');
            incorrectAnswerContainer.setAttribute('id', 'incorrectAnswerContainer');

            const tryAgainContainer = document.createElement('div');
            tryAgainContainer.setAttribute('id', "tryAgainContainer");
            tryAgainContainer.innerHTML = "Try again";
            tryAgainContainer.tabIndex = 0;

            tryAgainContainer.addEventListener('click', function(){
                renderContentPage(topicContent, currentQuestionIndex);
            });
            tryAgainContainer.addEventListener('keydown', function(event){
                if (event.key === 'Enter') {
                    renderContentPage(topicContent, currentQuestionIndex);
                }
            });

            const helpContainer = document.createElement('div');
            helpContainer.setAttribute('id', "helpContainer");
            helpContainer.innerHTML = "See the correct answer";
            helpContainer.tabIndex = 0;

            helpContainer.addEventListener('click', function(){
                showCorrectAnswer(item);
            });
            helpContainer.addEventListener('keydown', function(event){
                if (event.key === 'Enter') {
                    showCorrectAnswer(item);
                }
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
            questionTextContainer.innerHTML = item.explanation + "<br><br>";

            // Add speech controls
            const speechButtonsContainer = document.createElement('div');
            speechButtonsContainer.setAttribute('class', "speechButtonsContainer");
            speechButtonsContainer.setAttribute('id', "correctAnswerSpeechButtonsContainer");
            questionTextContainer.appendChild(speechButtonsContainer);
            const textToRead = questionTextContainer.innerHTML;
            createSpeechButtons("correctAnswerSpeechButtonsContainer", "correctAnswerPlayButton", "correctAnswerPauseButton", textToRead, "PLAY");

            // Remove other options
            incorrectAnswerContainer.remove();

            // Add next button
            backButtonImageContainer.remove();
            renderNextBackArrows();
            document.getElementById("nextButtonImageContainer").addEventListener('click', function() {
                finishContent(topicContent);
            });
            document.getElementById("nextButtonImageContainer").addEventListener('keydown', function(event) {
                if (event.key === 'Enter') {
                    finishContent(topicContent);
                }
            });
            document.getElementById("backButtonImageContainer").addEventListener('click', function() {
                contentGoBack(topicContent);
            });
            document.getElementById("backButtonImageContainer").addEventListener('keydown', function(event) {
                if (event.key === 'Enter') {
                    contentGoBack(topicContent);
                }
            });
        }
    }

    function renderRhythm(item){
        renderInformation(item);

        // Add audio
        const audioContainer = document.createElement('div');
        audioContainer.setAttribute('id', "audioContainer");
        informationTextContainer.appendChild(audioContainer);
        audioContainer.innerHTML = "<br>Does your rhythm sound like this?";

        const rhythmButtonContainer = document.createElement('div');
        rhythmButtonContainer.setAttribute('id', "rhythmButtonContainer");
        audioContainer.appendChild(rhythmButtonContainer);

        const rhythmButton = document.createElement('div');
        rhythmButton.setAttribute('id', "rhythmButton");
        rhythmButton.innerHTML = "Check your rhythm  &#9658;";
        rhythmButton.setAttribute('role', "button");
        rhythmButton.tabIndex = 0;
        rhythmButtonContainer.appendChild(rhythmButton);

        let rhythmSound = new Audio(item.audioFile);
        
        rhythmButton.addEventListener('click', function(){
            rhythmSound.play();
        });
        rhythmButton.addEventListener('keydown', function(event){
            if (event.key === 'Enter') {
                rhythmSound.play();
            }
        });
    }

    function finishContent(topicContent){
        currentQuestionIndex++;
        sessionStorage.setItem('currentQuestionIndex', currentQuestionIndex);
        if (currentQuestionIndex >= topicContent.length) {
            if(getCurrentTopicIndex() > getHighestTopicCompleted(getCurrentGrade())){
                incrementHighestTopicCompleted(getCurrentGrade());
                localStorage.setItem('learningStarted', "true");
            }
            sessionStorage.removeItem('currentTopicId');
            sessionStorage.removeItem('currentQuestionIndex');
            changeSiteSection("GRADEHOMEPAGE");
        }
        else {
            renderContentPage(topicContent, currentQuestionIndex);
        }
    }

    function contentGoBack(){
        currentQuestionIndex--;
        sessionStorage.setItem('currentQuestionIndex', currentQuestionIndex);
        if(currentQuestionIndex < 0){
            sessionStorage.removeItem('currentTopicId');
            sessionStorage.removeItem('currentQuestionIndex');
            changeSiteSection("LEARN");
        }
        else{
            renderContentPage(topicContent, currentQuestionIndex);
        }
    }

    ////// Quiz //////

    async function renderQuiz(){
        quizResult = 0;
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
            emptyMainText();
            emptyFooter();
            renderQuizPreamble(maxQuizGrade, highestTopicCompleted);
        }
    }

    function renderNoQuiz(){
        document.getElementById("page-title").innerHTML = "No quiz available yet!";
        const div = document.createElement('div');
        div.setAttribute('class', "noQuizTextContainer");
        div.innerHTML = "It doesn't look like you've covered any of the topics yet.";
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
        emptyMainText();
        emptyFooter();

    if (index >= 0 && index < quizQuestions.length) {
            const item = quizQuestions[index];
            renderQuizQuestion(item, quizQuestions, index);

        } else {
            console.error('Page index out of range:', index);
        }
    }

    function renderQuizPreamble(maxQuizGrade, highestTopicCompleted){
        let quizTopics = [];
        document.getElementById("page-title").innerHTML = "Quiz time!";
        const quizPreambleContainer = document.createElement('div');
        quizPreambleContainer.setAttribute('id', "quizPreambleContainer");
        const quizIntroText = document.createElement('div');
        quizIntroText.setAttribute('id', "quizIntroText");
        quizIntroText.innerHTML = "Take a quiz of 10 questions to revise what you've learnt.<br><br>Cover all available topics or pick which topic(s) to revise.<br><br>";
        quizPreambleContainer.appendChild(quizIntroText);
        const mainContainer = document.getElementById("main-container");
        mainContainer.appendChild(quizPreambleContainer);

        createAllTopicsOption();

        const quizTopicSelectContainer = document.createElement('div');
        quizTopicSelectContainer.setAttribute('id', "quizTopicSelectContainer");
        quizPreambleContainer.appendChild(quizTopicSelectContainer);

        quizTopics = createTopicCheckboxes(quizTopics);

        const quizGoText = document.createElement('div');
        quizGoText.setAttribute('id', "quizGoText");
        quizGoText.innerHTML = "<br>Warning: If you navigate away from the quiz before you get to the end you will need to start again from question 1!<br><br>Click the green arrow to start the quiz.<br><br>Good luck!<br>";
        quizPreambleContainer.appendChild(quizGoText);

        // Add speech controls
        const speechButtonsContainer = document.createElement('div');
        speechButtonsContainer.setAttribute('class', "speechButtonsContainer");
        speechButtonsContainer.setAttribute('id', "quizPreambleSpeechButtonsContainer");

        quizPreambleContainer.appendChild(speechButtonsContainer);

        const textToRead = quizPreambleContainer.innerHTML;
        createSpeechButtons("quizPreambleSpeechButtonsContainer", "quizPreamblePlayButton", "quizPreamblePauseButton", textToRead, "BOTH");

        renderNextArrow();
        document.getElementById("nextButtonImageContainer").addEventListener('click', function() {
            generateQuizData(maxQuizGrade, highestTopicCompleted, quizTopics)
                .then((quizQuestions) => {
                    console.log("Number of quiz questions:", quizQuestions.length);
                        currentQuizIndex = 0;
                    renderQuizPage(quizQuestions, currentQuizIndex);
                })
                .catch((error) => console.error("Error generating quiz data:", error));
        });

        document.getElementById("nextButtonImageContainer").addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                generateQuizData(maxQuizGrade, highestTopicCompleted, quizTopics)
                    .then((quizQuestions) => {
                        console.log("Number of quiz questions:", quizQuestions.length);
                            currentQuizIndex = 0;
                        renderQuizPage(quizQuestions, currentQuizIndex);
                    })
                    .catch((error) => console.error("Error generating quiz data:", error));
            }
        });
    }

    function createAllTopicsOption(){
        quizAll = 0;
        const quizAllContainer = document.createElement('div');
        quizAllContainer.setAttribute('id', "quizAllContainer");
        const quizPreambleContainer = document.getElementById("quizPreambleContainer");
        quizPreambleContainer.appendChild(quizAllContainer);

        const quizAllLabel = document.createElement('div');
        quizAllLabel.setAttribute('id', "quizAllLabel");
        quizAllLabel.innerHTML = "All available topics"
        quizAllContainer.appendChild(quizAllLabel);

        const quizAllCheckbox = document.createElement('input');
        quizAllCheckbox.setAttribute('type', "checkbox");
        quizAllCheckbox.setAttribute('value', quizAll);
        quizAllCheckbox.setAttribute('id', "quizAllCheckbox");
        quizAllContainer.appendChild(quizAllCheckbox);

        quizAllCheckbox.addEventListener('change', function() {
            if (this.checked) {
                quizAll = 1;
                const checkboxes = document.querySelectorAll('.topicCheckbox');
                for (let i = 0; i < checkboxes.length; i++) {
                    checkboxes[i].checked = false;
                }
                console.log("All quiz topics selected");
            } else {
              quizAll = 0;
              console.log("All quiz topics unselected");
            }
        });
    }

    function createTopicCheckboxes(quizTopics) {
        for(let i = 0; i < availableGrades.length; i++){
            const grade = availableGrades[i];
            const gradeDetails = document.createElement('details');
            gradeDetails.setAttribute('id', "grade"+grade+"Details");
            gradeDetails.setAttribute('class', "gradeDetails");
            if(i === 0){
                gradeDetails.open = true;
            }
            const summary = document.createElement('summary');
            summary.textContent = "Grade "+grade;
            gradeDetails.appendChild(summary);
            const quizTopicSelectContainer = document.getElementById("quizTopicSelectContainer");
            quizTopicSelectContainer.appendChild(gradeDetails);
            const highestTopicCompleted = getHighestTopicCompleted(grade);

            const topicList = document.createElement('div');
            topicList.setAttribute('id', "grade"+grade+"TopicList");
            topicList.setAttribute('class', "gradeTopicList");

            fetch("./content/"+grade+"-topics.json")
            .then((response) => response.json())
            .then((gradeTopics) => {
                for(i = 0; i < gradeTopics.length; i++){

                    if(i <= highestTopicCompleted){
                        const aTopic = gradeTopics[i];

                        const topicLabel = document.createElement('div');
                        topicLabel.setAttribute('class', "topicLabel");
                        topicLabel.innerHTML = aTopic.name;
                        topicList.appendChild(topicLabel)

                        const topicCheckbox = document.createElement('input');
                        topicCheckbox.setAttribute('type', "checkbox");
                        topicCheckbox.setAttribute('class', "topicCheckbox");
                        topicCheckbox.setAttribute('id', aTopic.id);
                        topicList.appendChild(topicCheckbox);

                        topicCheckbox.addEventListener('change', function() {
                            if (this.checked) {
                                quizAll = 0;
                                const quizAllCheckbox = document.getElementById("quizAllCheckbox");
                                quizAllCheckbox.checked = false;
                                quizTopics.push(grade+"-"+aTopic.id);
                                console.log("Adding grade " + grade + " " + aTopic.name + " to the quiz topic selection");
                              
                            } else {
                                for(let i = 0; i < quizTopics.length; i++){
                                    if(quizTopics[i] === grade+"-"+aTopic.id){
                                        quizTopics.splice(i, 1);
                                        console.log("Removing " + grade + " " + aTopic.name + " from the quiz topic selection");
                                    }
                                }
                            }
                        });

                    }
                }
            })
            .catch((error) => console.error("Error loading grade "+grade+" topics: ", error));

            gradeDetails.appendChild(topicList);

            return quizTopics;
        }
    }

    

    async function generateQuizData(maxQuizGrade, highestTopicCompleted, quizTopics) {
        console.log("Generating quiz data for max grade:", maxQuizGrade, "and highest topic completed:", highestTopicCompleted);
        
        let quizQuestions = [];

        if(quizAll === 1){

            try {
                // Loop through grades up to the maxQuizGrade
                for (let grade = 1; grade <= maxQuizGrade; grade++) {
                    let gradeTopics = await loadTopicsForGrade(grade);
                    console.log(`Grade ${grade} topics:`, gradeTopics);

                    for (let i = 0; i < gradeTopics.length; i++) {
                        let topicId = grade+"-"+gradeTopics[i].id;
        
                        if (grade < maxQuizGrade || (grade === maxQuizGrade && i <= highestTopicCompleted)) {
                            let questions = await loadQuestions(topicId);
                            quizQuestions = quizQuestions.concat(questions);
                        }
                    }
                }

                quizQuestions = shuffleArray(quizQuestions);
            } catch (error) {
                console.error("Error generating quiz data:", error);
            }   
        }

        else{
            try{
                // Loop through user-selected quiz topics (quizTopics)
                for(let i = 0; i < quizTopics.length; i++){
                    let topicId = quizTopics[i];
                    let questions = await loadQuestions(topicId);
                    quizQuestions = quizQuestions.concat(questions);
                }
            } catch (error) {
                console.error("Error generating quiz data:", error);
            }

        }

        const finalQuizQuestions = quizQuestions.slice(0, quizNumber);
        assert(finalQuizQuestions.length === quizNumber, "The quiz should contain "+quizNumber+" questions.");

        return finalQuizQuestions;
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

    async function loadQuestions(topicId) {
        try {
            console.log(`Loading questions for grade ${topicId}...`);

            let response = await fetch(`content/${topicId}.json`);
            let data = await response.json();
            let questions = data.filter((item) => item.contentType === 'question');

            return questions;
        } catch (error) {
            console.error(`Error loading questions for grade ${topicId}: `, error);
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

    function renderQuizQuestion(item, quizQuestions, index) {
        const questionNumber = index + 1;
        document.getElementById("page-title").innerHTML = questionNumber;
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
        let attempts = sessionStorage.getItem('attempts');
        if(!attempts){
            sessionStorage.setItem('attempts', "0");
        }

        // Function to handle click or keydown on an answer option
        function handleQuizAnswerClick(index) {
            if (!answerSelected) {
                answerSelected = true;

                for (let i = 0; i < numImages; i++) {
                    const quizAnswerContainer = document.getElementById(i);
                    quizAnswerContainer.removeAttribute('role');
                    quizAnswerContainer.removeEventListener('click', quizAnswerClickHandlers[i]);
                    quizAnswerContainer.removeEventListener('keydown', quizAnswerKeydownHandlers[i]);
                    quizAnswerContainer.style.pointerEvents = 'none'; // Disable pointer events
                    quizAnswerContainer.tabIndex = -1;
                }

                attempts = parseInt(sessionStorage.getItem('attempts'));
                attempts++;
                console.log("Attempts at this question: " + attempts);
                sessionStorage.setItem('attempts', attempts);

                // Determine if selected answer is correct
                checkQuizAnswer(item, index);
            }
        }

        // Arrays to store event handler references
        const quizAnswerClickHandlers = [];
        const quizAnswerKeydownHandlers = [];
    
        // Create answer options
        for (let i = 0; i < numImages; i++) {
            const quizImageContainer = document.createElement('div');
            quizImageContainer.setAttribute('class', "quizImageContainer");
            quizImageContainer.setAttribute('id', i);
            quizImageContainer.setAttribute('role', "button");
            quizImageContainer.tabIndex = 0;
            const quizImage = document.createElement('img');
            const source = item.images[i];
            quizImage.src = source;
            quizImage.setAttribute('class', "quizImage");
            quizImageContainer.appendChild(quizImage);
            quizImagesContainer.appendChild(quizImageContainer);

            // Create event handlers for each answer option
            const quizAnswerClickHandler = function () {
                handleQuizAnswerClick(i);
            };

            const quizAnswerKeydownHandler = function (event) {
                if (event.key === 'Enter') {
                    handleQuizAnswerClick(i);
                }
            };

            quizAnswerClickHandlers.push(quizAnswerClickHandler);
            quizAnswerKeydownHandlers.push(quizAnswerKeydownHandler);

            // Add click and keydown event listeners to answer option
            quizImageContainer.addEventListener('click', quizAnswerClickHandler);
            quizImageContainer.addEventListener('keydown', quizAnswerKeydownHandler);
        }

        const quizTextContainer = document.createElement('div');
        quizTextContainer.setAttribute('id', "quizTextContainer");
        quizContainer.appendChild(quizTextContainer);
        const quizText = item.text +"<br><br>";
        quizTextContainer.innerHTML = quizText;

        // Add speech controls
        const speechButtonsContainer = document.createElement('div');
        speechButtonsContainer.setAttribute('class', "speechButtonsContainer");
        speechButtonsContainer.setAttribute('id', "quizQuestionSpeechButtonsContainer");
        quizTextContainer.appendChild(speechButtonsContainer);
        const textToRead = quizTextContainer.innerHTML;
        createSpeechButtons("quizQuestionSpeechButtonsContainer", "quizQuestionPlayButton", "quizQuestionPauseButton", textToRead, "PLAY");

        function checkQuizAnswer(question, chosenAnswerIndex) {
            const correctAnswerIndex = question.correctAnswer;

            if (correctAnswerIndex === chosenAnswerIndex) {
                handleCorrectQuizAnswer(chosenAnswerIndex);
            } else {
                handleIncorrectQuizAnswer(chosenAnswerIndex);
            }
        }
    
        function handleCorrectQuizAnswer(chosenAnswerIndex) {
            if(getRightAnswerSound() === "yes"){
                rightSound.play();
            }
            console.log("Handling correct quiz answer...");
            const correctSelected = document.getElementById(chosenAnswerIndex);
            correctSelected.style.borderColor = "#328032";
            correctSelected.style.borderWidth = "4px";
            const answerText = "Correct!";
            quizTextContainer.innerHTML = answerText;
            attempts = parseInt(sessionStorage.getItem('attempts'));
            if(attempts > 1){ quizResult += 0.5; }
            else { quizResult++; }
            sessionStorage.removeItem('attempts');

            renderNextArrow();
            finishQuiz(quizQuestions);
        }   

        function handleIncorrectQuizAnswer(chosenAnswerIndex){
            if(getWrongAnswerSound() === "yes"){
                wrongSound.play();
            }
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
            tryAgainContainer.tabIndex = 0;

            tryAgainContainer.addEventListener('click', function(){
                renderQuizPage(quizQuestions, currentQuizIndex);
            });

            tryAgainContainer.addEventListener('keydown', function(event){
                if (event.key === 'Enter') {
                    renderQuizPage(quizQuestions, currentQuizIndex);
                }
            });

            const helpContainer = document.createElement('div');
            helpContainer.setAttribute('id', "helpContainer");
            helpContainer.innerHTML = "See the correct answer";
            helpContainer.tabIndex = 0;

            helpContainer.addEventListener('click', function(){
                showCorrectAnswer(item);
            });
            helpContainer.addEventListener('keydown', function(event){
                if (event.key === 'Enter') {
                    showCorrectAnswer(item);
                }
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
            quizTextContainer.innerHTML = item.explanation + "<br><br>";

            // Remove other options
            incorrectAnswerContainer.remove();

            // Remove attempts from sessionStorage
            sessionStorage.removeItem('attempts');

            // Add speech controls
            const speechButtonsContainer = document.createElement('div');
            speechButtonsContainer.setAttribute('class', "speechButtonsContainer");
            speechButtonsContainer.setAttribute('id', "correctAnswerSpeechButtonsContainer");

            quizTextContainer.appendChild(speechButtonsContainer);

            const textToRead = quizTextContainer.innerHTML;
            createSpeechButtons("correctAnswerSpeechButtonsContainer", "correctAnswerPlayButton", "correctAnswerPauseButton", textToRead, "PLAY");

            // Add next button
            renderNextArrow();
            finishQuiz(quizQuestions);
        }

        function finishQuiz(quizQuestions){
            document.getElementById("nextButtonImageContainer").addEventListener('click', function() {
                currentQuizIndex++;
                if (currentQuizIndex >= quizQuestions.length) {
                    renderQuizResult();
                } else {
                    renderQuizPage(quizQuestions, currentQuizIndex);
                }
            });

            document.getElementById("nextButtonImageContainer").addEventListener('keydown', function(event) {
                if (event.key === 'Enter') {
                    currentQuizIndex++;
                    if (currentQuizIndex >= quizQuestions.length) {
                        renderQuizResult();
                    } else {
                        renderQuizPage(quizQuestions, currentQuizIndex);
                    }
                }
            });
        }

        function renderQuizResult(){
            fetch("quizResults.json")
            .then((response) => response.json())
            .then((data) => {
                quizResultsData = data;
                renderQuizResultPage(quizResultsData);
            })
            .catch((error) => console.error("Error loading quiz results data: ", error));
        }

        function renderQuizResultPage(quizResultsData){
            emptyMainText();
            emptyFooter();
            let shortText = "";
            let longText = "";

            // For each quiz result range check the user's score against the min and max values
            // Extract the relevant text and render it to the page with the score out of the quizNumber value
            assert(quizResult <= quizNumber, "The quiz result cannot be greater than "+quizNumber+".");
            assert(quizResult >= 0, "The quiz result cannot be less than 0.");
            for(let i = 0; i < quizResultsData.length; i++){
                if(quizResult >= quizResultsData[i].minScore && quizResult <= quizResultsData[i].maxScore){
                    shortText = quizResultsData[i].shortText;
                    longText = quizResultsData[i].longText;
                }
            }

            document.getElementById("page-title").innerHTML = shortText;

            const quizResultContainer = document.createElement('div');
            quizResultContainer.setAttribute('id', 'quizResultContainer');

            const quizScoreContainer = document.createElement('div');
            quizScoreContainer.setAttribute('id', 'quizScoreContainer');

            quizScoreContainer.innerHTML = quizResult + "/" + quizNumber;
            quizResultContainer.appendChild(quizScoreContainer);

            const quizScoreLongText = document.createElement('div');
            quizScoreLongText.setAttribute('id', 'quizScoreLongText');

            quizScoreLongText.innerHTML = longText;
            quizResultContainer.appendChild(quizScoreLongText);

            const mainContainer = document.getElementById("main-container");
            mainContainer.appendChild(quizResultContainer);

            renderNextArrow();
            document.getElementById("nextButtonImageContainer").addEventListener('click', function() {
                changeSiteSection("HOME");
            });
            document.getElementById("nextButtonImageContainer").addEventListener('keydown', function(event) {
                if (event.key === 'Enter') {
                    changeSiteSection("HOME");
                }
            });
        }
    }

    ////// Glossary //////

    function loadGlossary(){
        document.getElementById("page-title").innerHTML = "Glossary: A&ndash;Z";

        fetch("glossary.json")
        .then((response) => response.json())
        .then((data) => {
            generateGlossary(data);
        })
        .catch((error) => {
            console.error('Error fetching the glossary data:', error);
        });
    }

    function generateGlossary(data) {
        const glossaryContainer = document.createElement('div');
        glossaryContainer.setAttribute('id', 'glossaryContainer');
    
        data.forEach((item) => {
            console.log("Processing glossary item:", item); // Debug: log the current item being processed

            const glossaryRow = document.createElement('div');
            glossaryRow.className = 'glossary-row';
            glossaryContainer.appendChild(glossaryRow);
    
            // Add term
            const termDiv = document.createElement('div');
            termDiv.setAttribute('class', "termDiv");
            termDiv.textContent = item.term;
            if(item.lang) { 
                termDiv.setAttribute('lang', item.lang); 
            }
            glossaryRow.appendChild(termDiv);

            // Add image
            const imageDiv = document.createElement('div');
            imageDiv.setAttribute('class', "imageDiv");
            if (item.image !== "null") {
                const image = document.createElement('img');
                image.src = item.image;
                image.alt = item.term;
                imageDiv.appendChild(image);
            } else {
                imageDiv.innerHTML = '&nbsp;'; // Render an empty space
            }
            glossaryRow.appendChild(imageDiv);

            // Add definition
            const definitionDiv = document.createElement('div');
            definitionDiv.innerHTML = item.definition;
            glossaryRow.appendChild(definitionDiv);

            // Add speech controls
            const speechButtonsContainer = document.createElement('div');
            speechButtonsContainer.setAttribute('class', "speechButtonsContainer");
            const speechButtonsContainerName = (item.id + "SpeechButtonsContainer").trim();
            speechButtonsContainer.setAttribute('id', speechButtonsContainerName);
            glossaryRow.appendChild(speechButtonsContainer);

            // Use setTimeout to ensure DOM updates are complete
            setTimeout(() => {
                const container = document.getElementById(speechButtonsContainerName);
                if (container) {
                    console.log("Speech buttons container successfully added to the DOM:", speechButtonsContainerName);
                    const textToRead = item.term + " . " + item.definition;
                    createSpeechButtons(speechButtonsContainerName, item.id + "PlayButton", item.id + "PauseButton", textToRead, "PLAY");
                } else {
                    console.error("Failed to find speech buttons container in the DOM:", speechButtonsContainerName);
                    console.error("Glossary row structure:", glossaryRow.outerHTML); // Debug: log the entire glossary row structure
                }
            }, 0); // Short delay to ensure DOM updates are processed

            const hr = document.createElement('hr');
            glossaryContainer.appendChild(hr);
        });
    
        const mainContainer = document.getElementById("main-container");
        console.log("Appending glossary to the main container."); // Debug: log before appending glossary
        mainContainer.appendChild(glossaryContainer);
        console.log("Glossary successfully appended to the main container."); // Debug: log after appending glossary
    }

    ////// About page //////

    function renderAboutPage(){
        document.getElementById("page-title").innerHTML = "About Music Theory My Way";
        const aboutContainer = document.createElement('div');
        aboutContainer.setAttribute('id', "aboutContainer");
        aboutContainer.innerHTML = 'Music Theory My Way has been developed as part of the final project for my MSc in Computer Science at the University of Bristol.<br><br>It is a prototype for a dyslexia-friendly website for learning music theory. Some of the features designed for dyslexia are:<ul><li>Customisable appearance</li><li>Text-to-speech options</li><li>Clear and organised layout without clutter</li><li>Straightforward language</li><li>Multisensory content</li><li>Systematic and structured learning</li><li>Repetition and revision of concepts</li></ul>If you change any settings or finish any of the topics your progress will be saved in your own web browser. I cannot see anything you do on the site and I am not collecting any data from you. Your data is not collected by any third parties. Your progress and settings will be retained if you return to the site on the same device and in the same web browser.<br><br>Thank you for your interest!<br>Liz Elliott<br>University of Bristol<br>';

        const mainContainer = document.getElementById("main-container");
        mainContainer.appendChild(aboutContainer);     

        // Add speech controls
        const speechButtonsContainer1 = document.createElement('div');
        speechButtonsContainer1.setAttribute('class', "speechButtonsContainer");
        speechButtonsContainer1.setAttribute('id', "aboutSpeechButtonsContainer");

        aboutContainer.appendChild(speechButtonsContainer1);

        const textToRead1 = aboutContainer.innerHTML;
        createSpeechButtons("aboutSpeechButtonsContainer", "aboutPlayButton", "aboutPauseButton", textToRead1, "BOTH");

        const acknowledgementsContainer = document.createElement('div');
        acknowledgementsContainer.setAttribute('id', "acknowledgementsContainer");
        acknowledgementsContainer.innerHTML = '<br><br><h2>Acknowledgements</h2>The <a href="https://opendyslexic.org/">Open Dyslexic</a> font is made freely available for any use by Abbie Gonzalez. The standalone images of music notes and other symbols on the website use <a href="https://midnightmusic.com/2013/06/the-big-free-music-notation-image-library/">The Big Free Music Notation Image Library by Midnight Music</a>. The other icons on the site were downloaded from Flat Icon, and I specifically acknowledge the following contributors: <ul><li>lutfix (glossary icon)</li><li>Dave Gandy (home and tour icons)</li><li>Freepik (music notes, settings and laptop/tablet icons)</li><li>Tanah Basah (quiz icon)</li><li>Chanut (about icon)</li><li>Handicon (equivalence symbol)</li><li>hqrloveq (forward and back arrows)</ul>The sound effects when you get a quiz question right or wrong are freely availably from <a href="https://mixkit.co/">Mixkit</a>.';

        mainContainer.appendChild(acknowledgementsContainer);

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
        backButtonImage.setAttribute('role', "button");
        backButtonImage.alt = "Green back arrow";
        backButtonImage.src = "images/leftArrow.png";
        backButtonImage.width = arrowImageWidth;
        backButtonImage.tabIndex = 0;
        backButtonImageContainer.appendChild(backButtonImage);
        footer.appendChild(backButtonImageContainer);
    }

    function createNextArrow(){
        const nextButtonImageContainer = document.createElement('div');
        nextButtonImageContainer.setAttribute('id', "nextButtonImageContainer");
        const nextButtonImage = document.createElement('img');
        nextButtonImage.setAttribute('role', "button");
        nextButtonImage.setAttribute('id', "nextButtonImage");
        nextButtonImage.alt = "Green forwards arrow";
        nextButtonImage.src = "images/rightArrow.png";
        nextButtonImage.width = arrowImageWidth;
        nextButtonImage.tabIndex = 0;
        nextButtonImageContainer.appendChild(nextButtonImage);
        footer.appendChild(nextButtonImageContainer);
    }

    /// Speech buttons 

    function createSpeechButtons(speechButtonsContainerName, playButtonName, pauseButtonName, textToRead, buttonTypes) {
        const speechButtonsContainer = document.getElementById(speechButtonsContainerName);
        // Create play button
        const playButton = document.createElement('div');
        playButton.setAttribute('id', playButtonName);
        playButton.setAttribute('class', "speechButton");
        playButton.setAttribute('role', "button");
        playButton.setAttribute('aria-label', "Play");
        playButton.tabIndex = 0;
        playButton.innerHTML = "&#9658; Play";
        speechButtonsContainer.appendChild(playButton);

        // Declare pauseButton variable
        let pauseButton = null;

        // Conditionally create pause button
        if (buttonTypes === "BOTH") {
            pauseButton = document.createElement('div');
            pauseButton.setAttribute('id', pauseButtonName);
            pauseButton.setAttribute('class', "speechButton");
            pauseButton.setAttribute('role', "button");
            pauseButton.setAttribute('aria-label', "Pause");
            pauseButton.tabIndex = 0;
            pauseButton.innerHTML = "&#10074;&#10074; Pause";
            speechButtonsContainer.appendChild(pauseButton);
        }

        textToRead = speechAdjustments(textToRead);

        let utterance = new SpeechSynthesisUtterance(textToRead);
        let isPaused = false;

        // Cancel any ongoing speech synthesis when a new utterance is about to start
        function resetSpeechSynthesis() {
            speechSynthesis.cancel();
            isPaused = false;
        }

        // Function to play text for this specific set of buttons
        function playText() {
            if (isPaused) {
                speechSynthesis.resume();
                isPaused = false;
            } else {
                resetSpeechSynthesis();

                // Reinitialise the utterance to avoid conflict with other buttons
                utterance = new SpeechSynthesisUtterance(textToRead);
                const voices = speechSynthesis.getVoices();
                if (voices.length > 2) {
                    utterance.voice = voices[2];
                }

                // Start speaking the text
                speechSynthesis.speak(utterance);
            }
        }

        // Function to pause the current text
        function pauseText() {
            if (speechSynthesis.speaking && !speechSynthesis.paused) {
                speechSynthesis.pause();
                isPaused = true;
            }
        }

        // Attach event listeners to play button
        playButton.addEventListener('click', playText);
        playButton.addEventListener('keydown', (event) => {
            if (event.key === "Enter") {
                playText();
            }
        });

        // Conditionally attach event listeners to pause button
        if (pauseButton) {
            pauseButton.addEventListener('click', pauseText);
            pauseButton.addEventListener('keydown', (event) => {
                if (event.key === "Enter") {
                    pauseText();
                }
            });
        }

        // Stop all speech synthesis when navigating away
        window.addEventListener('beforeunload', resetSpeechSynthesis);
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

    /// Function to highlight one nav button
    function highlightCurrentNav(){
        // Loop through all nav buttons and set their border to the default
        const buttons = document.getElementsByClassName('nav-button');
        for(let i = 0; i < buttons.length; i++){
            buttons[i].style.borderWidth = "0";
        }

        // Then get the current site section nav button and that set the border to highlight
        if(siteSection === "HOME"){
            addBottomBorder("home-button");
        }
        else if(siteSection === "LEARN"){
            addBottomBorder("learn-button");
        }
        else if(siteSection === "GLOSSARY"){
            addBottomBorder("glossary-button");
        }
        else if(siteSection === "QUIZ"){
            addBottomBorder("quiz-button");
        }
        else if(siteSection === "SETTINGS"){
            addBottomBorder("settings-button");
        }
        else if(siteSection === "TOUR"){
            addBottomBorder("tour-button");
        }
        else if(siteSection === "ABOUT"){
            addBottomBorder("about-button");
        }
    }

    function addBottomBorder(buttonName){
        document.getElementById(buttonName).style.borderColor = "#646363";
        document.getElementById(buttonName).style.borderWidth = "0 0 7px 0"
    }

    /// Functions related to storing progress in local and session storage ///
        // Grades are actual grade numbers, so start from 1
        // Topics are indexes, so start from 0

    // Set the highest grade completed
    function setHighestGradeCompleted(grade){
        assert(grade <= 5, "Highest grade completed cannot be greater than 5.");
        assert(grade > 0, "Highest grade completed cannot be less than 1.");
        localStorage.setItem('highestGradeCompleted', grade);
    }

    // Get the highest grade completed from local storage
    function getHighestGradeCompleted(){
        const highestGradeCompleted = localStorage.getItem('highestGradeCompleted');
        if(highestGradeCompleted === null){
            return 0;
        }
        else{
            assert(highestGradeCompleted <= 5, "Highest grade completed cannot be greater than 5.");
            assert(highestGradeCompleted > 0, "Highest grade completed cannot be less than 1.");
            return parseInt(highestGradeCompleted);
        }
    }

    // Store the current grade in the session storage
    function setCurrentGrade(grade){
        assert(grade <= 5, "Current grade cannot be greater than 5.");
        assert(grade > 0, "Current grade cannot be less than 1.");
        sessionStorage.setItem('currentGrade', grade);
    }

    // Get the current grade from session storage
    function getCurrentGrade(){
        const currentGrade = sessionStorage.getItem('currentGrade');
        assert(currentGrade <= 5, "Current grade cannot be greater than 5.");
        assert(currentGrade > 0, "Current grade cannot be less than 1.");
        return currentGrade;
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
    function setCurrentTopic(topicIndex, topicId, topicName) {
        sessionStorage.setItem('currentTopicIndex', topicIndex);
        sessionStorage.setItem('currentTopicId', topicId);
        sessionStorage.setItem('currentTopicName', topicName);
    }

    // Get the current topic id from session storage
    function getCurrentTopicId(){
        return sessionStorage.getItem('currentTopicId');
    }

    // Get the current topic index from session storage
    function getCurrentTopicIndex(){
        return parseInt(sessionStorage.getItem('currentTopicIndex'));
    }

    function getCurrentTopicName(){
        return sessionStorage.getItem('currentTopicName');
    }

    // Remove the progress bar when a topic has finished
    function removeProgressBar(){
        const progress = document.getElementById("progress");
        if(progress){
            progress.remove();
        }
        const progressBar = document.getElementById("progressBar");
        if(progressBar){
            progressBar.remove();
        }
    }

    // Fixing some odd pronunciation
    function speechAdjustments(textIn){
        textOut = textIn.replaceAll("semibreve", "semibreeve");
        textOut = textOut.replaceAll("Semibreve", "Semibreeve");
        textOut = textOut.replaceAll("crotchets", "crotchits");
        textOut = textOut.replaceAll("Crotchets", "Crotchits");
        textOut = textOut.replaceAll("<emph>", "");
        textOut = textOut.replaceAll("</emph>", "");
        return textOut;
    }

    // Assert test
    function assert(condition, message) {
        if (condition) {
            console.log('%c PASS: ' + message, 'color: green');
            return true;
        } else {
            console.error('%c FAIL: ' + message, 'color: red');
            return false;
        }
    }

    ////// Render the page content //////
    applySavedSettings();
    updatePageContent();

});
