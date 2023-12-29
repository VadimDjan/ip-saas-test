describe('Регистрация пространства', function () {
  const $h = protractor.helpers;
  const EC = protractor.ExpectedConditions;

  const { errorCatcher } = $h.common;
  const { defaultWaitTimeout } = $h.wait;

  let linkString;
  
  function skip() {
    return !protractor.totalStatus.ok;
  }
  
  it('1. Пройти по ссылке из письма', async done => {
    console.log('1. Пройти по ссылке из письма');
    await errorCatcher(async () => {
      await browser.get('');
      await browser.sleep(2000);
    }, done);
  }, skip());
  
  it('2. Заполнить регистрационную форму на создание пространства', async done => {
    console.log('2. Заполнить регистрационную форму на создание пространства');
    await errorCatcher(async () => {
      await browser.sleep(3000);

      const user = await element(by.name('user'));
      await user.clear();
      await user.sendKeys('user1');
      await browser.sleep(200);

      const workspace = await element(by.name('workspace_name'));
      await workspace.clear();
      await workspace.sendKeys('autotest');
      await browser.sleep(200);

      const password = await element.all(by.name('password')).first();
      await password.clear();
      await password.sendKeys('Qwerty123!');
      await browser.sleep(200);

      await element.all(by.css('input')).last().sendKeys('Qwerty123!');
      await browser.sleep(500);
      await element(by.css('form .login__submit-block .login__fieldset button')).click();
      await browser.sleep(8000);
    }, done);
  }, skip());

  it('3. Edit user data', async done => {
    console.log('3. Редактирование данных пользователя');
    await errorCatcher(async () => {
      await browser.sleep(5000);
      // await browser.wait(EC.stalenessOf($('.loader-spinner')), defaultWaitTimeout);
      await browser.actions().mouseMove(element(by.className('username'))).perform();
      await browser.sleep(1000);
      const userProfileBtn = await element(by.cssContainingText('.dropdown-menu li', 'Личный кабинет'));
      const hasUserProfileBtn = await userProfileBtn.isPresent();
      if (hasUserProfileBtn) await userProfileBtn.click();
      await browser.wait(EC.presenceOf(element(by.cssContainingText('.form-header__title', 'Личный кабинет пользователя'))), defaultWaitTimeout);

      await browser.wait(EC.stalenessOf($('.loader-spinner')), defaultWaitTimeout);
      await browser.sleep(1000);
      await element(by.cssContainingText('.details__modal .accordion-panel', 'Моя рабочая область')).click();
      await browser.wait(EC.visibilityOf(element(by.css('.dashboard-item__wrapper_subgrid'))), defaultWaitTimeout);

      const user = await element.all(by.cssContainingText('tr', 'Владелец пространства')).first();
      await browser.actions().doubleClick(user).perform();
      await browser.wait(EC.presenceOf(element(by.cssContainingText('.form-header__title', 'Сотрудник'))), defaultWaitTimeout);
      await browser.sleep(1000);
      
      // await browser.wait(EC.stalenessOf($('.loader-spinner')), defaultWaitTimeout);
      const nameField = await element(by.css('div[data-field-name="fullname"] input'));
      await nameField.clear().sendKeys('Василий Васильев');
      await expect(nameField.getAttribute('value')).toEqual('Василий Васильев');

      await element(by.css('button[data-button-name="PROCESSANDBACK"]')).click();
      await browser.wait(EC.stalenessOf(element(by.cssContainingText('.form-header__title', 'Сотрудник'))), defaultWaitTimeout);
      await expect(element(by.cssContainingText('button', 'Пригласить')));
      await browser.sleep(1000);
    }, done);
  }, skip());

  it('4. Invite new user', async done => {
    console.log('4. Выслать приглашение пользователю');
    await errorCatcher(async () => {
      await element(by.css('div[data-field-name="workspace_invite_user_email"] input')).sendKeys('anylogic.models@ideaplatform.ru');
      await browser.sleep(200);
      await element(by.cssContainingText('button', 'Пригласить')).click();
      await browser.sleep(2000);
      await element(by.css('.details__close-btn')).click();
      await browser.wait(EC.stalenessOf(element(by.cssContainingText('.form-header__title', 'Личный кабинет пользователя'))), defaultWaitTimeout);
      await browser.sleep(500);
    }, done);
  }, skip());

  it('5. Logout', async done => {
    console.log('5. Выход из ИС от руководителя пространства');
    await errorCatcher(async () => {
      await browser.sleep(3000);
      await browser.actions().mouseMove(element(by.className('username'))).perform();
      await browser.sleep(2000);
      const logoutBtn = await element(by.css('.button-log-out'));
      const hasLogoutBtn = await logoutBtn.isPresent();
      if (hasLogoutBtn) await logoutBtn.click();
      await browser.wait(EC.stalenessOf(element(by.cssContainingText('.header-logo', 'IP Service Manager'))), defaultWaitTimeout);
      await expect(element(by.css('.login_service-manager')));
      await browser.sleep(2000);
    }, done);
  }, skip());

  it('6. Open a mail and follow a link', async done => {
    console.log('6. Зайти в почту и перейти по ссылке');
    await errorCatcher(async () => {
      await browser.sleep(2000);
      const tabs = await browser.getAllWindowHandles();
      await browser.switchTo().window(tabs[0]);
      await browser.sleep(2000);

      // авторизуемся в почте
      await browser.get('http://mail.yandex.ru/'); 
      await browser.sleep(24000);
      await element(by.cssContainingText('.Button2_view_default', 'Войти')).click();
      await browser.sleep(7000);
      // на странице ввода логина жмём кнопку Почта, т.к. по умолчанию может быть выбран ввод номера тлф
      await element(by.css('button[data-type="login"]')).click();
      await browser.sleep(5000);
      await element(by.id('passp-field-login')).sendKeys('anylogic.models@ideaplatform.ru');
      await browser.sleep(5000);
      await element(by.css('.passp-sign-in-button')).click();
      await browser.sleep(5000);
      await element(by.id('passp-field-passwd')).sendKeys('Qwerty123!1!');
      await element(by.css('.passp-sign-in-button')).click();
      await browser.sleep(1500);
  
      // открываем письмо
      await browser.sleep(5000);
      const letter = await element(by.cssContainingText('.js-message-snippet-body', 'Вас пригласили в онлайн-сервис Service-Manager.online'));
      await browser.actions().doubleClick(letter).perform();
      await browser.sleep(5000);
  
      linkString = await element.all(by.css('.react-message-wrapper__body a')).last().getText();
      console.log(linkString);

      // удаляем письмо
      await element(by.css('.ns-view-toolbar-button-delete')).click();
      await browser.sleep(2000);
        
      // // очищаем корзину
      // await element(by.css('div[aria-label="Удалённые, папка"] div .qa-LeftColumn-FolderControls')).click();
      // await browser.sleep(2000);
      // await element(by.css('.qa-LeftColumn-ConfirmClear-ActionButton')).click();
      // await browser.sleep(2000);
      
      await browser.switchTo().window(tabs[1]);
      await browser.sleep(2000);

      // переход по ссылке
      await browser.get(linkString);
      await browser.sleep(2000);
    }, done);
  }, skip());

  it('7. Register new user in the workspace', async done => {
    console.log('7. Регистрация приглашенного пользователя в пространстве');
    await errorCatcher(async () => {
      await browser.get(linkString);
      await browser.sleep(3000);

      const header = await element(by.cssContainingText('h3', 'Регистрация'));
      await header.isPresent().then(async present => {
        if (present) {
          const userNameInput = await element(by.css('input[name="user"]'));
          userNameInput.clear();
          userNameInput.sendKeys('manager1');
          await browser.sleep(200);

          const passwordInput = await element.all(by.css('input[type="password"]')).first();
          passwordInput.clear();
          passwordInput.sendKeys('Qwerty123!');
          await browser.sleep(200);

          const repeatPasswordInput = await element.all(by.css('input[type="password"]')).last();
          repeatPasswordInput.clear();
          repeatPasswordInput.sendKeys('Qwerty123!');
          await browser.sleep(200);

          await element(by.css('button')).click();
          await browser.wait(EC.presenceOf(element(by.cssContainingText('.dashboard-container__title', 'Каталог услуг'))), defaultWaitTimeout);
          await browser.sleep(5000);
        }
      });
    }, done);
  }, skip());

  it('8. Logout', async done => {
    console.log('8. Выход из ИС от приглашенного пользователя');
    await errorCatcher(async () => {
      await browser.actions().mouseMove(element(by.className('username'))).perform();
      await browser.sleep(2000);
      const logoutBtn = await element(by.css('.button-log-out'));
      const hasLogoutBtn = await logoutBtn.isPresent();
      if (hasLogoutBtn) await logoutBtn.click();
      await browser.wait(EC.stalenessOf(element(by.cssContainingText('.header-logo', 'IP Service Manager'))), defaultWaitTimeout);
      await expect(element(by.css('.login_service-manager')));
      await browser.sleep(2000);
    }, done);
  }, skip());
});
