const { defaultWaitTimeout } = protractor.helpers.wait;
const EC = protractor.ExpectedConditions;

/* function loginToPage(loginPageUrl, user, password) {
    var $h = protractor.helpers;

    var expliciteWait = $h.wait.expliciteWait;
    var angularWait = $h.wait.angularWait;

    if (user == null || password == null) {
        var loginObject = getLoginObject();
        user = loginObject.user;
        password = loginObject.password;
    }

    loginPageUrl = loginPageUrl || protractor.helpers.url + '#/login';
    console.info('Logging in...')
    console.info('user =', user)
    console.info('password =', password)
    return browser.get(loginPageUrl)
        .then(browser.sleep(1000))
        .then(function () {
            element(by.css('input[name="user"]')).clear().sendKeys(user);
            element(by.css('input[name="password"]')).clear().sendKeys(password);
            element(by.css('form[name="NormalForm"] button[value="Войти в систему"]')).click();
            browser.sleep(100); // if your test is outrunning the browser
        })
        .then(browser.sleep(2000));
}*/

async function loginToPage(loginPageUrl, user, password) {
    const $h = protractor.helpers;
    if (user == null || password == null) {
        const loginObject = getLoginObject();
        user = loginObject.user;
        password = loginObject.password;
    }
    loginPageUrl = loginPageUrl || $h.url + '#/login';
    console.info('Logging in...')
    console.info('user =', user)
    console.info('password =', password)

    await browser.get(loginPageUrl);
    await browser.sleep(1500);
    await element(by.css('input[name="user"]')).clear().sendKeys(user);
    await element(by.css('input[name="password"]')).clear().sendKeys(password);
    await element(by.css('form[name="NormalForm"] button[value="Войти в систему"]')).click();
    await browser.wait(EC.stalenessOf(element(by.css('.login-container'))), defaultWaitTimeout);
    await browser.wait(EC.presenceOf(element(by.css('.spinner-container'))), 5000);
    await browser.wait(EC.stalenessOf(element(by.css('.spinner-container'))), defaultWaitTimeout);
    await browser.sleep(1500);
}

function setLoginObject(pathToFile, loginObject) {
    var $h = protractor.helpers;
    var s = loginObject.user + ';' + loginObject.password + ';'
        + loginObject.workspace + '\n'
        + (loginObject.users || []).map(function (user) {
            return user.user + ';' + user.password + ';' + user.workspace;
        }).join('\n') + '\n';

    $h.file.writeFileSync($h.workspaceDirectory + '/login.txt',
        s);
}

function getLoginObject(index) {
    var $h = protractor.helpers;
    // var path = pathToFile || $h.workspaceDirectory + '/login.txt';
    var lines = // $h.file.readFileSync(path).split(/\r?\n/)
        // ['victor.follet@ideaplatform.ru;buktop;TEMPLATE', 'demo.user@ipdemo.ru;123;TEMPLATE'].map(line => line.split(';'))
        [
            'КраснДРП;Qwerty123!;itsm',
            'seri0zha;Qwerty123!',
            'ПМС-20_Фомин;Qwerty1!;itsm',
            'ПМС197_Менед;Qwerty123!;',
        ].map(line => line.split(';'))
    const selectedIndex = 0;
    var loginObject = {
        user: lines[selectedIndex][0],
        password: lines[selectedIndex][1],
        workspace: lines[selectedIndex][2],
        users: lines.map(function (line) {
            return {
                user: line[0],
                password: line[1],
                workspace: line[2]
            };
        })
    };
    return loginObject;
}

async function logOut() {
    const EC = protractor.ExpectedConditions;
    const profileButton = await element(by.css('.navbar-username'));
    await browser.wait(EC.elementToBeClickable(profileButton), defaultWaitTimeout);
    await browser.sleep(1500);
    await browser.actions().mouseMove(profileButton).perform();
    await browser.sleep(500);
    await browser.wait(EC.elementToBeClickable(element(by.css('.button-log-out'))), 2000);
    await browser.sleep(500);
    await profileButton.element(by.css('.button-log-out')).click();
}

exports.loginToPage = loginToPage;
exports.getLoginObject = getLoginObject;
exports.setLoginObject = setLoginObject;
exports.logOut = logOut;
