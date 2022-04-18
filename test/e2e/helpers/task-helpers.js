const $h = protractor.helpers;
const EC = protractor.ExpectedConditions;
const alertSuccess = 'alert__wrapper alert__wrapper_success';
const { defaultWaitTimeout } = $h.wait;

const assignAndSaveTask = async assignTo => {
    console.log('1. Назначаем текущую задачу на "Волков С.А." и сохраняем запись.');
    try {
        await $h.form.setForm({
            assignedto: assignTo,
        });
        await browser.sleep(1500);
        await $h.form.processButton(['UPDATE'], 'task');
        await browser.wait(EC.presenceOf(element(by.css(`[class="${alertSuccess}"]`))), defaultWaitTimeout);
        const inWorkButtonIsPresent = await element(by.css('[data-button-name="В работу"]')).isPresent();

        console.log('TEST: на форме после сохранения присутствует кнопка "В работу"');
        expect(inWorkButtonIsPresent).toBe(true);
        await browser.sleep(1500);
    } catch (e) {
        console.error(e);
    }
};

const pressTakeToWorkButton = async () => {
    console.log('2. Переводим наряд в работу и убеждаемся что изменился статус.');
    try {
        const selector = '.modal-body[data-detail="task"] .card .react-grid-item[data-field-name="workflowstepid"] input';
        const currentText = await element(by.css(selector)).getAttribute('value');
        if (!currentText.includes('В работе')) {
            await $h.form.processButton(['В работу']);
            await browser.wait(EC.presenceOf(element(by.css('[data-button-name="Выполнить"]'))), defaultWaitTimeout);
            await browser.sleep(1500);
        }

        console.log('TEST: статус задачи "В работе"');
        const textAfterButtonPressed = await element(by.css(selector)).getAttribute('value');
        expect(textAfterButtonPressed?.trim()).toBe('В работе');
    } catch (e) {
        console.error(e);
    }
};

const getIdFromModalTitle = async () => {
    const titleText = await $$('.form-header__title').last().getText();
    return parseInt(titleText.split('#')[1]);
};

exports.assignAndSaveTask = assignAndSaveTask;
exports.pressTakeToWorkButton = pressTakeToWorkButton;
exports.getIdFromModalTitle = getIdFromModalTitle;