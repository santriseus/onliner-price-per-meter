(function () {
    const rootLink = 'https://r.onliner.by/pk/';
    const apptLink = rootLink + 'apartments/';
    const containerClass = 'classifieds-list';
    const entryClass = 'classified';
    const priceSelector = 'span:nth-child(1) > span:nth-child(1) > span:nth-child(1)';
    const areaSelector = 'span:nth-child(2) > span:nth-child(1) > span:nth-child(2) > span:nth-child(2) > span:nth-child(1)';
    const apptPriceSelector = 'div.apartment-bar > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > span:nth-child(2) > span:nth-child(1)';
    const apptAreaSelector = 'table.apartment-options-table > tbody > tr:nth-child(1)> td:nth-child(2)';
    const errorText = 'Ошибка в расширении хрома "Onliner - Цена за метр квадратный.": ';

    if (window.location.href.includes(apptLink)){
        processApptLink();
    } else if (window.location.href.includes(rootLink)){
        processRootLink();
    }

    function processRootLink(){
        try {
            let elementList = document.getElementsByClassName(containerClass)[0];

            let config = { childList: true };

            let mutationHandler = function mutationHandler(mutationsList) {
                for(let mutation of mutationsList) {
                    for (let element of mutation.addedNodes) {
                        if (element.className === entryClass) {
                            let priceElement = element.querySelector(priceSelector);
                            let dollarPriceElement = priceElement.children[0];
                            let dollarSignElement = priceElement.children[1];
                            let dollarPrice = Number.parseFloat(dollarPriceElement.innerText.replace(/ /g, ''));
                            let totalArea = Number.parseFloat(element.querySelector(areaSelector).innerText.replace(/,/,'.'));
                            let meterPrice = (Math.ceil(dollarPrice/totalArea));
                            let elementToInsert = document.createElement("SPAN");
                            dollarSignElement.textContent += ',';
                            elementToInsert.innerText = meterPrice.toLocaleString('ru-RU') + ' $/кв.м';
                            priceElement.appendChild(elementToInsert);
                        }
                    }
                }
            };

            let observer = new MutationObserver(mutationHandler);

            observer.observe(elementList, config);
        }
        catch (err){
            console.log(errorText + err);
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



