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
    journeysContainer = "#root > div > div:nth-child(1) > div > div > div > div:nth-child(2) div"
    firstJourneyItem = "#root > div > div:nth-child(1) > div > div > div > div > div > div:nth-child(3) > div"
    firstFareButton = "#modals-container > div > div > div > div > div > div > button"
    getPreferenceBtn = "#root > div > div:nth-child(1) > div > div > div > div > div > div > div > div > a"
    confirmPreferenceBtn = "#modals-container > div > div > div > div > button"

    nextStep = "from"
    intervalLoadRtpPage;
    intervalModalStationFrom;
    intervalModalStationTo;
    intervalModalDate;
    intervalLoadJourneys;
    from;
    to;

    constructor() {

    }

    startTests(e) {
        console.log("Starting tests...")
        document.querySelector("a[data-tracking-id='navigation_book-button']").click()
        this.waitModalStationFrom()
        let trainStationSegment = document.querySelector(this.trainSegmentOption);
        let interval = setInterval(() => {
            if (trainStationSegment) {
                clearInterval(interval)
                trainStationSegment.click()
                document.querySelector(this.stationFromButton).click()
            }
        }, 2000)
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
                    self.waitJourneysPage();
                }, 1000)
                self.nextStep = ""
            }
        }, 1000)
    }

    waitJourneysPage() {
        self = this;
        self.intervalLoadJourneys = setInterval( ()=> {
            // Waiting the journeys to be loaded
            if (document.querySelector(self.journeysContainer).children.length > 3) {
                clearInterval(self.intervalLoadJourneys)
                console.log("Selecting journey")
                document.querySelector(self.firstJourneyItem).click()

                setTimeout(function () {
                    console.log("Selecting fare")
                    document.querySelector(self.firstFareButton).click()
                }, 1000)

                self.waitPreferencePage();
            }
        }, 1000)
    }

    waitPreferencePage() {
        self = this;

        self.intervalLoadRtpPage = setInterval( ()=> {
            let getPreferenceBtn = document.querySelector(self.getPreferenceBtn);
            if (getPreferenceBtn) {
                clearInterval(self.intervalLoadRtpPage)
                console.log("Open Preference modal")
                getPreferenceBtn?.click()
                nextStep = "preference"

                setTimeout( ()=> {
                    console.log("Select Preference")
                    document.querySelector(self.confirmPreferenceBtn)?.click()
                    self.triggerCheckoutButton();
                }, 1000)
            }
        }, 1000)
    }

    triggerCheckoutButton() {
        setTimeout( ()=> {
            console.log("checkout btn clicked")
            document.querySelector("#root button[data-tracking-id='rtp-checkout-button']").click()
        }, 1000)
        this.waitTravelInfoPage();
        this.waitPaymentPage();
    }

    waitTravelInfoPage() {
        let loadTravelInfoInterval = setInterval( () =>{
            let continueBtn = document.querySelector("#root button[data-tracking-id='traveler-info-continue-button']");
            if (continueBtn) {
                console.log("Setting delivery preferences")
                let editPrefBtn = document.querySelector("#root > div > div:nth-child(1) > div > div > div  > div > div > div > a")
                if (editPrefBtn) {
                    editPrefBtn.click()
                }
                setTimeout( ()=> {
                    let saveTrainPrefBtn = document.querySelector("#modals-container > div > div > div > button")
                    if (saveTrainPrefBtn) {
                        saveTrainPrefBtn.click()
                    }
                    clearInterval(loadTravelInfoInterval)
                    console.log("Press continue button")
                    continueBtn.click()
                }, 1000)
            }
        }, 1000)
    }

    waitPaymentPage() {
        let loadPaymentInterval = setInterval( () => {
            let bookNowBtn = document.querySelector("#root button[data-tracking-id='book-trip-button']");
            if (bookNowBtn) {
                console.log("Press Book now button")
                clearInterval(loadPaymentInterval)
                setTimeout(function () {
                    bookNowBtn.click()
                }, 1000)
            }
        }, 1000)
    }

    stop() {
        console.log("Stopping execution...")
        this.nextStep = ""
        let intervals = [
            self.intervalLoadRtpPage,
            self.intervalModalStationFrom,
            self.intervalModalStationTo,
            self.intervalModalDate,
            self.intervalLoadJourneys,
        ]
        for (const interval of intervals) {
            console.log("Stopping intervals")
            clearInterval(interval)
        }
    }
}

(() => {
    const test = new EttaAutomatedTest()
    chrome.runtime.onMessage.addListener((obj, sender, response) => {
        console.log("received message: " + JSON.stringify(obj))
        const {type, value, videoId} = obj;
        if (type === "Play") {
            test.startTests()
        }
        if (type === "Stop") {
            test.stop()
        }
    })
})();
