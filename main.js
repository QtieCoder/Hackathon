let color = "#e8453c";

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({ color });
    console.log('Default background color set to %cpink', `color: ${color}`);

});

//on popup.js file
// When the button is clicked, inject setPageBackgroundColor into current page
// let changeColor = document.getElementById('changeColor');
  
// chrome.storage.sync.get("color", ({color}) => {
//   changeColor.style.backgroundColor = color;
// });

// changeColor.addEventListener("click", async () => {
//     let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

//     chrome.scripting.executeScript({
//         target: { tabId: tab.id },
//         function: setPageBackgroundColor,
//     });
// });


// The body of this function will be executed as a content script inside the
// current page
function setPageBackgroundColor() {
    chrome.storage.sync.get("color", ({color}) => {
        document.body.style.backgroundColor = color;
    });
}

//on options file 
let page = document.getElementById("buttonDiv");
let selectedClassName = "current";
const presetButtonColors = ["#f4f5f0","#e8453c", "#e08b0b", "#f9f62d", "#3aa757", "#6dedb3", "#65d9db", "#63b7f7", "#4688f1", "#e38de0", "#b66ded","#000000"];


//Reacts to a button click by marking the selected button and saving the selection
function handleButtonClick(event) {
    //Remove from the previously selected color
    let current = event.target.parentElement.querySelector(`.${selectedClassName}`);
    if (current && current !== event.target) {
        current.classList.remove(selectedClassName);
    }
    
    //mark the button as seleceted
    let color = event.target.dataset.color;
    event.target.classList.add(selectedClassName);
    chrome.storage.sync.set({ color });
}

// Add a button to the page for each supplied color
function constructOptions(buttonColors) {
    chrome.storage.sync.get("color", (data) => {
        let currentColor = data.color;
        // For each color we were provided
        for (let buttonColor of buttonColors) {
            //create a button with that color// …create a button with that color
            let button = document.createElement("button");
            button.dataset.color = buttonColor;
            button.style.backgroundColor = buttonColor;
            //mark the currently selected color
            if (buttonColor === currentColor) {
                button.classList.add(selectedClassName);
            }
            //register a listener for when that button is clicked
            button.addEventListener("click", handleButtonClick);
            page.appendChild(button);
            button.addEventListener("click", async () => {
                let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            
                chrome.scripting.executeScript({
                    target: { tabId: tab.id },
                    function: setPageBackgroundColor,
                });
            });
        }
  });
}


//Initialize the page by constructing the color options
constructOptions(presetButtonColors);