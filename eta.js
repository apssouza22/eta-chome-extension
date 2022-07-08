nextStep = "from"
stationFrom = ""

class EttaAutomatedTest {
    stationFromButton = "#root > div > div > div > div > div > div:nth-child(3) > div > div > button:nth-child(1)"
    stationOptionElement = "#modals-container > div > div li"
    stationToButton = "#root > div > div > div > div > div > div:nth-child(3) > div > div > button:nth-child(2)"
    trainSegmentOption = "#root > div > div:nth-child(1) > div > div > div > div > button:nth-child(2)";
    dateButton = "#root > div > div > div > div > div > div:nth-child(4) > div > div > button:nth-child(1)"
    calendarDayElement = ".CalendarDay[aria-disabled='false']:last-child"
    confirmDateButton = "#modals-container > div > div > div > button"
    searchTrainButton = "#root > div > div > div > div > div > div:nth-child(6) button"

    nextStep = "from"
    intervalModalStationFrom;
    intervalModalStationTo;
    intervalModalDate;
    from;
    to;

    constructor() {
    }

    startTests(e) {
        console.log("From the class")
        this.waitModalStationFrom()
        document.querySelector(this.trainSegmentOption).click()
        document.querySelector(this.stationFromButton).click()
    }

    waitModalStationFrom() {
        self = this;
        this.intervalModalStationFrom = setInterval(() => {
            let element = document.querySelector(self.stationOptionElement);
            if (self.nextStep === "from" && element) {
                clearInterval(self.intervalModalStationFrom);
                console.log("Selecting station FROM")
                stationFrom = element.textContent
                element.click()
                self.nextStep = "to"
                setTimeout(() => {
                    console.log("Click To button")
                    document.querySelector(self.stationToButton).click()
                    self.waitModalStationTo();
                }, 500)
            }
        })
    }


    waitModalStationTo() {
        self = this;
        this.intervalModalStationTo = setInterval(function () {
            let listOfStations = document.querySelectorAll(self.stationOptionElement);
            let element = listOfStations[0];
            // for(const value of listOfStations) {
            //     if (value.textContent){
            //         element = value
            //     }
            // }
            if (self.nextStep === "to" && element) {
                console.log("Selecting station TO")
                clearInterval(self.intervalModalStationTo)
                console.log(stationFrom, " ", element.textContent)
                if (stationFrom === element.textContent) {
                    element = listOfStations[1];
                }
                console.log(stationFrom, " - ", element.textContent)
                element.click()
                setTimeout(function () {
                    console.log("Click date button")
                    document.querySelector(self.dateButton).click()
                    self.waitDepartCalendar();
                }, 1000)
                self.nextStep = "date"
            }
        }, 1000)
    }

    waitDepartCalendar() {
        self = this;
        this.intervalModalDate = setInterval(() => {
            let calendarDay = document.querySelector(self.calendarDayElement);
            if (self.nextStep === "date" && calendarDay) {
                console.log("Selecting date")
                clearInterval(self.intervalModalDate)
                calendarDay.click()
                document.querySelector(self.confirmDateButton).click()
                setTimeout(() => {
                    document.querySelector(self.searchTrainButton).click()
                    // waitJourneysPage();
                }, 1000)
                self.nextStep = ""
            }
        }, 1000)
    }
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


(() => {
    test = new EttaAutomatedTest()
    chrome.runtime.onMessage.addListener((obj, sender, response) => {
        console.log("received message: " + JSON.stringify(obj))
        const {type, value, videoId} = obj;
        if (type === "Play") {
            test.startTests()
        }
        if (type === "Stop") {
            nextStep = ""
        }
    })
})();