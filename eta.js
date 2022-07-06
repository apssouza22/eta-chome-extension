nextStep = "from"
stationFrom = ""

function waitModalStationFrom() {
    let interval = setInterval(function () {
        let element = document.querySelector("#modals-container > div > div li");
        if (nextStep === "from" && element) {
            clearInterval(interval)
            console.log("Selecting station FROM")
            let selector = document.querySelector("#modals-container > div > div li");
            stationFrom = selector.textContent
            selector.click()
            nextStep = "to"
            setTimeout(function () {
                console.log("Click To button")
                document.querySelector("#root > div > div > div > div > div > div:nth-child(3) > div > div > button:nth-child(2)").click()
                waitModalStationTo();
            }, 500)
        }
    })
}

function waitJourneysPage() {
    let loadJourneysInterval = setInterval(function () {
        // Waiting the journeys to be loaded
        if (document.querySelector("#root > div > div:nth-child(1) > div > div > div > div:nth-child(2) div").children.length > 3) {
            clearInterval(loadJourneysInterval)
            console.log("Selecting journey")
            document.querySelector("#root > div > div:nth-child(1) > div > div > div > div > div > div:nth-child(3) > div").click()

            setTimeout(function () {
                console.log("Selecting fare")
                document.querySelector("#modals-container > div > div > div > div > div > div > button").click()
            }, 1000)

            waitPreferencePage();
        }
    }, 1000)
}

function triggerCheckoutButton() {
    setTimeout(function () {
        console.log("checkout btn clicked")
        document.querySelector("#root button[data-tracking-id='rtp-checkout-button']").click()
    }, 1000)
    waitTravelInfoPage();
    waitPaymentPage();
    nextStep = "checkout"
}

function waitPreferencePage() {
    let loadRtpInterval = setInterval(function () {
        let getPreferenceBtn = document.querySelector("#root > div > div:nth-child(1) > div > div > div > div > div > div > div > div > a");
        if (getPreferenceBtn) {
            clearInterval(loadRtpInterval)
            console.log("Open Preference modal")
            getPreferenceBtn?.click()
            nextStep = "preference"

            setTimeout(function () {
                console.log("Select Preference")
                document.querySelector("#modals-container > div > div > div > div > button")?.click()
                triggerCheckoutButton();
            }, 1000)
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
            nextStep = "continue"
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
            }, 1000)
            nextStep = "book"
        }
    }, 1000)
}

function waitDepartCalendar() {
    let interval = setInterval(function () {
        let calendarDayEl = document.querySelector(".CalendarDay[aria-disabled='false']:last-child");
        if (nextStep === "date" && calendarDayEl) {
            console.log("Selecting date")
            clearInterval(interval)
            calendarDayEl.click()
            document.querySelector("#modals-container > div > div > div > button").click()
            setTimeout(function () {
                document.querySelector("#root > div > div > div > div > div > div:nth-child(6) button").click()
                waitJourneysPage();
            }, 1000)
            nextStep = ""
        }
    }, 1000)
}

function waitModalStationTo() {
    let interval = setInterval(function () {
        let element = document.querySelector("#modals-container > div > div li");
        if (nextStep === "to" && element) {
            console.log("Selecting station TO")
            clearInterval(interval)
            console.log(stationFrom, " ", element.textContent)
            if (stationFrom === element.textContent) {
                element = document.querySelector("#modals-container > div > div li:last-child")
            }
            console.log(stationFrom, " - ", element.textContent)
            element.click()
            setTimeout(function () {
                console.log("Click date button")
                document.querySelector("#root > div > div > div > div > div > div:nth-child(4) > div > div > button:nth-child(1)").click()
                waitDepartCalendar();
            }, 1000)
            nextStep = "date"
        }
    }, 1000)
}

function startTests(e) {
    waitModalStationFrom()

    // select train segment
    document.querySelector("#root > div > div:nth-child(1) > div > div > div > div > button:nth-child(2)").click()
    // select From
    document.querySelector("#root > div > div > div > div > div > div:nth-child(3) > div > div > button:nth-child(1)").click()
}

(() => {
    chrome.runtime.onMessage.addListener((obj, sender, response) => {
        console.log("received message: " + JSON.stringify(obj))
        const {type, value, videoId} = obj;
        if (type === "Play") {
            startTests()
        }
        if (type === "Stop") {
            nextStep = ""
        }
    })
})();