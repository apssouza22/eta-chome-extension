// Start observing mutation of element. On change, the
//   the callback is called with Boolean visibility as
//   argument:
function createBtn(){
    // create a new div element
    const newDiv = document.createElement("button");
    newDiv.textContent = "run automate test"
    newDiv.classList.add("btn-run-test")
    newDiv.style.position = 'absolute';
    newDiv.style.right = '0';
    newDiv.style.zIndex = '100';
    newDiv.style.top = '0';
    newDiv.addEventListener("click", function(e) {
        // select train segment
        document.querySelector("#root > div > div:nth-child(1) > div > div > div > div > button:nth-child(2)").click()
        // select From
        document.querySelector("#root > div > div > div > div > div > div:nth-child(3) > div > div > button:nth-child(1)").click()
        // select To
        document.querySelector("#root > div > div > div > div > div > div:nth-child(3) > div > div > button:nth-child(2)").click()
    })
    document.querySelector("body").appendChild(newDiv)

}
function respondToMutation(element, callback) {
    // create an observer instance
    var observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            console.log(mutation.type)
            callback(mutation.type);
        });
    });

    // configuration of the observer:
    var config = {attributes: true, childList: true, characterData: true};

    // pass in the target node, as well as the observer options
    observer.observe(element, config);
}

modalHandle = "from"
stationFrom = ""
respondToMutation(document.querySelector("#modals-container"), function (i) {
    console.log(modalHandle)
    if (modalHandle === "from") {
        console.log("Selecting station FROM")
        let selector = document.querySelector("#modals-container > div > div li");
        stationFrom = selector.textContent
        selector.click()
        modalHandle = "closeFrom"
        return
    }

    if (modalHandle === "to") {
        console.log("Selecting station TO")
        let element = document.querySelector("#modals-container > div > div li");
        console.log(stationFrom, " ", element.textContent)
        if (stationFrom === element.textContent) {
            element = document.querySelector("#modals-container > div > div li:last-child")
        }
        console.log(stationFrom, " ", element.textContent)
        element.click()
        modalHandle = "closeTo"
        setTimeout(function () {
            // select date
            document.querySelector("#root > div > div > div > div > div > div:nth-child(4) > div > div > button:nth-child(1)").click()
        }, 1000)
    }

    if (modalHandle === "date") {
        console.log("Selecting date")
        document.querySelector(".CalendarDay[aria-disabled='false']:last-child").click()
        document.querySelector("#modals-container > div > div > div > button").click()
        modalHandle = "closeDate"
    }

    if (modalHandle === "fare") {
        console.log("Selecting fare")
        document.querySelector("#modals-container > div > div > div > div > div > div > button").click()
        modalHandle = "closeFare"
        loadRtpInterval = setInterval(function () {
            let getPreferenceBtn = document.querySelector("#root > div > div:nth-child(1) > div > div > div > div > div > div > div > div > a");
            if (getPreferenceBtn){
                clearInterval(loadRtpInterval)
                console.log("Open Preference modal")
                getPreferenceBtn.click()
                modalHandle = "preference"
            }
        }, 1000)
    }
    if (modalHandle === "preference") {
        console.log("Select Preference")
        document.querySelector("#modals-container > div > div > div > div > button").click()
        modalHandle = "closePreference"
    }
    if (modalHandle === "closePreference") {
        console.log("checkout selected")
        document.querySelector("#root button[data-tracking-id='rtp-checkout-button']").click()
        loadTravelInfoInterval = setInterval(function () {
            let continueBtn = document.querySelector("#root button[data-tracking-id='traveler-info-continue-button']");
            if (continueBtn){
                clearInterval(loadTravelInfoInterval)
                console.log("Press continue button")
                continueBtn.click()
                modalHandle = "continue"
            }
        }, 1000)

        loadPaymentInterval = setInterval(function () {
            let bookNowBtn = document.querySelector("#root button[data-tracking-id='book-trip-button']");
            if (bookNowBtn){
                console.log("Press Book now button")
                bookNowBtn.click()
                clearInterval(loadPaymentInterval)
                modalHandle = "book"
            }
        }, 1000)
        modalHandle = "checkout"
    }

    if (modalHandle === "closePreference") {
        console.log("Closing Preference modal")
        modalHandle = "checkout"
    }
    if (modalHandle === "closeFrom") {
        console.log("Closing From modal")
        modalHandle = "to"
    }

    if (modalHandle === "closeTo") {
        console.log("Closing To modal")
        modalHandle = "date"
    }
    if (modalHandle === "closeDate") {
        console.log("Closing Date modal")
        setTimeout(function () {
            document.querySelector("#root > div > div > div > div > div > div:nth-child(6) button").click()
            loadJourneysInterval = setInterval(function () {
                // Waiting the journeys to be loaded
                if(document.querySelector("#root > div > div:nth-child(1) > div > div > div > div:nth-child(2) div").children.length > 3){
                    clearInterval(loadJourneysInterval)
                    document.querySelector("#root > div > div:nth-child(1) > div > div > div > div > div > div:nth-child(3) > div").click()
                    modalHandle = "fare"
                }
            }, 1000)
        }, 1000)
        modalHandle = ""
    }
})

createBtn()
