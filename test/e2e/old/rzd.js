
describe('Idea Platform list page', function () {
    var ptor;
    var headers, elems = [];
    it('should create data for a week', function () {
        getPage(101);
        function getPage(page) {
            ptor = browser;
            ptor.ignoreSynchronization = true;

            ptor.get('http://cargo.rzd.ru/cargostation/public/ru?STRUCTURE_ID=5101&page4821_2705=' + page);
            element.all(by.css('#container > tbody > tr > td:nth-child(2) > table tr td'))
                .map(function (row) {
                    return row.getText()//.innerText
                })
                .then(function (newElems) {
                    elems = elems.concat(newElems)
                    if (page < 1024) return getPage(page + 1)
                    else {

                        var chunk_size = 6;
                        var arr = elems;
                        var groups = arr.map(function (e, i) {
                            return i % chunk_size === 0 ? arr.slice(i, i + chunk_size) : null;
                        })
                            .filter(function (e) { return e; });

                        groups.forEach(function (row) {
                            var sRow = ''
                            row.forEach(function (col) { sRow = sRow + col + ';' })
                        })
                        browser.pause()

                    }
                })

        }
    }, 7 * 24 * 3600 * 1000)

})
