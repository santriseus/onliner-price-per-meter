(function () {
    const rootLink = 'https://r.onliner.by/pk/';
    const apptLink = rootLink + 'apartments/';
    const listContainerClass = 'classifieds-list';
    const popupContainerClass = 'leaflet-popup-pane';
    const entryClass = 'classified';
    const popupEntryClass = 'map-popover';
    const priceSelector = 'span:nth-child(1) > span:nth-child(1) > span:nth-child(1)';
    const areaSelector = 'span:nth-child(2) > span:nth-child(1) > span:nth-child(2) > span:nth-child(2) > span:nth-child(1)';
    const areaSelectorPopup = 'span:nth-child(2) > span:nth-child(1) > span:nth-child(2) > span:nth-child(2)';
    const apptPriceSelector = 'div.apartment-bar > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > span:nth-child(2) > span:nth-child(1)';
    const apptAreaSelector = 'table.apartment-options-table > tbody > tr:nth-child(2)> td:nth-child(2)';
    const errorText = 'Ошибка в расширении хрома "Onliner - Цена за метр квадратный.": ';

    if (window.location.href.includes(apptLink)){
        processApptLink();
    } else if (window.location.href.includes(rootLink)){
        processRootLink();
    }

    function processRootLink(){
        try {
            subscribeForListProcessing();
            subscribeForPopupProcessing();
        }
        catch (err){
            console.log(errorText + err);
        }
    }

    function subscribeForListProcessing() {
        let elementList = document.getElementsByClassName(listContainerClass)[0];

        let listMutationHandler = function listMutationHandler(mutationsList) {
            for (let mutation of mutationsList) {
                for (let element of mutation.addedNodes) {
                    if (element.className === entryClass) {
                        processContentNode(element);
                    }
                }
            }
        };

        let listObserver = new MutationObserver(listMutationHandler);
        listObserver.observe(elementList, {childList: true, subtree: false});
    }

    function subscribeForPopupProcessing() {
        let popup = document.getElementsByClassName(popupContainerClass)[0];
        let popupMutationHandler = function popupMutationHandler(mutationsList) {
            for (let mutation of mutationsList) {
                for (let element of mutation.addedNodes) {
                    if (element.className && element.className.indexOf(popupEntryClass) > -1) {
                        processPopoverPopupNode(element);
                    }
                }
            }
        };

        let popupObserver = new MutationObserver(popupMutationHandler);
        popupObserver.observe(popup, {childList: true, subtree: true});
    }

    function processContentNode(element) {
        let priceElement = element.querySelector(priceSelector);
        let dollarPriceElement = priceElement.children[0];
        let dollarSignElement = priceElement.children[1];
        let dollarPrice = Number.parseFloat(dollarPriceElement.innerText.replace(/ /g, ''));
        let totalAreaElement = element.querySelector(areaSelector) || null;
        let totalArea = Number.parseFloat(totalAreaElement.innerText.replace(/,/, '.'));
        let meterPrice = (Math.ceil(dollarPrice / totalArea));
        let elementToInsert = document.createElement("SPAN");
        dollarSignElement.textContent += ', ';
        elementToInsert.innerText = meterPrice.toLocaleString('ru-RU') + ' $/кв.м';
        priceElement.appendChild(elementToInsert);
    }

    function processPopoverPopupNode(popoverElement) {
        let contentElements = popoverElement.getElementsByClassName(entryClass);
        for (let element of contentElements) {
            let priceElement = element.querySelector(priceSelector);
            let dollarPriceElement = priceElement.children[0];
            let dollarSignElement = priceElement.children[1];
            let dollarPrice = Number.parseFloat(dollarPriceElement.innerText.replace(/ /g, ''));
            let totalAreaElement = element.querySelector(areaSelectorPopup).childNodes[0];
            let totalArea = Number.parseFloat(totalAreaElement.textContent.replace(/"/, ''));
            let meterPrice = (Math.ceil(dollarPrice / totalArea));
            let elementToInsert = document.createElement("SPAN");
            dollarSignElement.textContent += ', ';
            elementToInsert.innerText = meterPrice.toLocaleString('ru-RU') + ' $/кв.м';
            priceElement.appendChild(elementToInsert);
        }
    }

    function processApptLink(){
        try {

            let priceElement = document.querySelector(apptPriceSelector);

            let dollarPrice = Number.parseFloat(priceElement.innerText.replace(/ /g, ''));

            let areaElement = document.querySelector(apptAreaSelector);

            let area = Number.parseFloat(areaElement.innerText.replace(/,/,'.'));

            let meterPrice = (Math.ceil(dollarPrice/area));

            priceElement.textContent += ', ' + meterPrice.toLocaleString('ru-RU') + ' $/кв.м';

        }
        catch (err){
            console.log(errorText + err);
        }
    }

}());



