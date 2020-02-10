describe('Scenario 4.5. New Entity details form editor. Редактор форм записи новой Entity. ', function () {

    var urlBase = protractor.helpers.url + '#/form_editor/';
    var $h = protractor.helpers;
    var expliciteWait = $h.wait.expliciteWait;
    var angularWait = $h.wait.angularWait;

    function skip() {
        return !protractor.totalStatus.ok;
    }

    it('1. Should add new tab', function (done) {
        return browser.get(urlBase + protractor.constants.DetailsFormId)
            .then(angularWait)
            .then(function () {
                return $h.designer.addTab('Дополнительный таб');
            })
            .then(function (cols) {
                return expect($h.designer.getTabs()).toEqual(['Общая информация', 'История', 'Дополнительный таб']);
            })
            .then(angularWait)
            .then(expliciteWait)
            .then(done);
    });

    it('2. Should select field', function (done) {
        $h.designer.getFieldCoordinates('createdbyid')
            .then(function (coords) {
                expect(coords).toEqual({
                    section: 1,
                    row: 1,
                    col1: 1,
                    col2: 2
                });
            })
            .then(angularWait)
            .then(expliciteWait)
            .then(done);
    });

    it('3. Should move field to another section', function (done) {
        $h.designer.setFieldSection('createdbyid', 'Дополнительный таб')
            .then(function () {
                return $h.designer.getFieldCoordinates('createdbyid');
            })
            .then(function (coords) {
                expect(coords).toEqual({
                    section: 2,
                    row: 1,
                    col1: 1,
                    col2: 2
                });
            })
            .then(angularWait)
            .then(expliciteWait)
            .then(done);
    });

    it('4. Should not remove nonempty section', function (done) {
        $h.designer.removeSection(2)
            .then(function () {
                expect($h.designer.getTabs()).toEqual(['Общая информация', 'История', 'Дополнительный таб']);
            })
            .then(angularWait)
            .then(expliciteWait)
            .then(done);
    });

    it('5. Should correctly change fields coordinates', function (done) {
        $h.designer.setFieldCoordinates('createdbyid', {
            section: 1,
            row: 1,
            col1: 1,
            col2: 2
        })
            .then(function () {
                return expect($h.designer.getFieldCoordinates('createdbyid')).toEqual({
                    section: 1,
                    row: 1,
                    col1: 1,
                    col2: 2
                });
            })
            .then(angularWait)
            .then(expliciteWait)
            .then(done);
    });

    it('5. Should correctly remove empty section', function (done) {
        $h.designer.removeSection(2)
            .then(function () {
                expect($h.designer.getTabs()).toEqual(['Общая информация', 'История']);
            })
            .then(angularWait)
            .then(expliciteWait)
            .then(done);
    });
});

