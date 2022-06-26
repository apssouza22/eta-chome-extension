// Start observing mutation of element. On change, the
//   the callback is called with Boolean visibility as
//   argument:

respondToMutation(document.querySelector("#modals-container"), function (i) {
    console.log(modalHandle)
    if (modalHandle === "from") {
        console.log("Selecting station FROM")
        let selector = document.querySelector("#modals-container > div > div li");
        stationFrom = selector.textContent
        selector.click()
        modalHandle = "to"
        setTimeout(function () {
            document.querySelector("#root > div > div > div > div > div > div:nth-child(3) > div > div > button:nth-child(2)").click()
        }, 500)
        return
    }

    if (modalHandle === "fare") {
        console.log("Selecting fare")
        document.querySelector("#modals-container > div > div > div > div > div > div > button").click()
        modalHandle = "closeFare"
        waitPreferencePage();
    }
    if (modalHandle === "preference") {
        console.log("Select Preference")
        document.querySelector("#modals-container > div > div > div > div > button").click()
        modalHandle = "closePreference"
    }
    if (modalHandle === "closePreference") {
        console.log("checkout btn clicked")
        document.querySelector("#root button[data-tracking-id='rtp-checkout-button']").click()
        waitTravelInfoPage();
        waitPaymentPage();
        modalHandle = "checkout"
    }

    if (modalHandle === "closeTo") {
        console.log("Closing To modal")
        modalHandle = "date"
    }
    if (modalHandle === "closeDate") {
        console.log("Closing Date modal")
        setTimeout(function () {
            document.querySelector("#root > div > div > div > div > div > div:nth-child(6) button").click()
            waitJourneysPage();
        }, 1000)
        modalHandle = ""
    }
})

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

function waitJourneysPage() {
    let loadJourneysInterval = setInterval(function () {
        // Waiting the journeys to be loaded
        if (document.querySelector("#root > div > div:nth-child(1) > div > div > div > div:nth-child(2) div").children.length > 3) {
            clearInterval(loadJourneysInterval)
            // Select journey
            document.querySelector("#root > div > div:nth-child(1) > div > div > div > div > div > div:nth-child(3) > div").click()
            modalHandle = "fare"
        }
    }, 1000)
}

function waitPreferencePage() {
    let loadRtpInterval = setInterval(function () {
        let getPreferenceBtn = document.querySelector("#root > div > div:nth-child(1) > div > div > div > div > div > div > div > div > a");
        if (getPreferenceBtn) {
            clearInterval(loadRtpInterval)
            console.log("Open Preference modal")
            getPreferenceBtn.click()
            modalHandle = "preference"
        }
    }, 1000)
}

function waitTravelInfoPage() {
    let loadTravelInfoInterval = setInterval(function () {
        let continueBtn = document.querySelector("#root button[data-tracking-id='traveler-info-continue-button']");
        if (continueBtn) {
            clearInterval(loadTravelInfoInterval)
            console.log("Press continue button")
            continueBtn.click()
            modalHandle = "continue"
        }
    }, 1000)
}

function waitPaymentPage() {
    let loadPaymentInterval = setInterval(function () {
        let bookNowBtn = document.querySelector("#root button[data-tracking-id='book-trip-button']");
        if (bookNowBtn) {
            console.log("Press Book now button")
            clearInterval(loadPaymentInterval)
            setTimeout(function () {
                bookNowBtn.click()
            }, 500)
            modalHandle = "book"
        }
    }, 1000)
}

function waitDepartCalendar() {
    let interval = setInterval(function () {
        let calendarDayEl = document.querySelector(".CalendarDay[aria-disabled='false']:last-child");
        if (modalHandle === "date" && calendarDayEl) {
            console.log("Selecting date")
            clearInterval(interval)
            calendarDayEl.click()
            document.querySelector("#modals-container > div > div > div > button").click()
            modalHandle = "closeDate"
        }
    }, 1000)
}

function waitModalStationTo() {
    let interval = setInterval(function () {
        let element = document.querySelector("#modals-container > div > div li");
        if (modalHandle === "to" && element) {
            console.log("Selecting station TO")
            clearInterval(interval)
            console.log(stationFrom, " ", element.textContent)
            if (stationFrom === element.textContent) {
                element = document.querySelector("#modals-container > div > div li:last-child")
            }
            console.log(stationFrom, " - ", element.textContent)
            element.click()
            modalHandle = "closeTo"
            setTimeout(function () {
                // click date btn
                document.querySelector("#root > div > div > div > div > div > div:nth-child(4) > div > div > button:nth-child(1)").click()
            }, 1000)
        }
    }, 1000)
}

function startTests(e) {
    waitDepartCalendar();
    waitModalStationTo();
    // select train segment
    document.querySelector("#root > div > div:nth-child(1) > div > div > div > div > button:nth-child(2)").click()
    // select From
    document.querySelector("#root > div > div > div > div > div > div:nth-child(3) > div > div > button:nth-child(1)").click()
}

(() => {
    chrome.runtime.onMessage.addListener((obj, sender, response) => {
        console.log("received message: " + JSON.stringify(obj))
        const { type, value, videoId } = obj;
        if (type ==="Play"){
            startTests()
        }
        if (type ==="Stop"){
            modalHandle = ""
        }
    })
})();