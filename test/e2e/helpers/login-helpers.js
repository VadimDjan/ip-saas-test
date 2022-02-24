function loginToPage(loginPageUrl, user, password) {
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
        .then(expliciteWait);
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

function getLoginObject(usr) {
    if (usr && usr.password && usr.name)
        return usr
    var $h = protractor.helpers;
    // var path = pathToFile || $h.workspaceDirectory + '/login.txt';
    var lines = // $h.file.readFileSync(path).split(/\r?\n/)
        // ['victor.follet@ideaplatform.ru;buktop;TEMPLATE', 'demo.user@ipdemo.ru;123;TEMPLATE'].map(line => line.split(';'))
        [
            'КраснДРП;Qwerty1234!;itsm',
            'seri0zha;Qwerty123!',
            'ПМС-20_Фомин;Qwerty1!;itsm',
            'ПМС197_Менед;Qwerty123!;',
        ].map(line => line.split(';'))
    const selectedIndex = 0;
    var loginObject = {
        user: lines[selectedIndex][0],
        password: lines[selectedIndex][1],
        workspace: lines[selectedIndex][2],
        users: lines.slice(1).filter(function (line) {
            return line.length >= 3;
        }).map(function (line) {
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
    await browser.wait(EC.elementToBeClickable(profileButton), 10000);
    await browser.sleep(500);
    await browser.actions().mouseMove(profileButton).perform();
    await browser.wait(EC.elementToBeClickable(element(by.css('.button-log-out'))), 10000);
    return profileButton.element(by.css('.button-log-out')).click();
}

exports.loginToPage = loginToPage;
exports.getLoginObject = getLoginObject;
exports.setLoginObject = setLoginObject;
exports.logOut = logOut;
