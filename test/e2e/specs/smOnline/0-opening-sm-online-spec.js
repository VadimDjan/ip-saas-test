describe('Открытие страницы', function () {
  const $h = protractor.helpers;
  const EC = protractor.ExpectedConditions;

  const { errorCatcher } = $h.common;
  const { defaultWaitTimeout } = $h.wait;

  function skip() {
    return !protractor.totalStatus.ok;
  }

  it('open mailbox', async done => {
    console.log('Заходим в почту');
    await errorCatcher(async () => {
      await browser.get('http://mail.yandex.ru/lite');
      await browser.wait(EC.presenceOf(element(by.css('input[aria-label="Переслать"]'))), defaultWaitTimeout);
      await browser.sleep(7000);
    }, done);
  }, skip());

  it('1. Open page', async function() {
    console.log('1. Открыть страницу');
    await browser.executeScript(`window.open("https://service-manager.online/")`);
    await browser.sleep(1500);

    const tabs = await browser.getAllWindowHandles();
    await browser.switchTo().window(tabs[1]);
    await browser.wait(EC.presenceOf(element(by.css('.subtitle-1'))), defaultWaitTimeout);
    await browser.sleep(2000);

    const text = element(by.css('.subtitle-1'));
    await text.isPresent().then(async present => {
      if (present) {
        await browser.sleep(2000);
      } else {
        await console.log('Не открывается SM online');
        await browser.switchTo().window(tabs[0]);
        // await element(by.cssContainingText('a[href="#compose"]', 'Написать')).click();
        await element(by.css('.b-toolbar__i .b-toolbar__col a[aria-label="Написать"]')).click();
        await browser.wait(EC.presenceOf(element(by.css('.b-form-label', 'Тема'))), defaultWaitTimeout);
        await browser.sleep(7000);
        // await element(by.css('div[title="Кому"]')).sendKeys('timur@ideaplatform.ru vadim@ideaplatform.ru olga.dubik@ideaplatform.ru dorin.grigorii@ideaplatform.ru aleksey.avetisyan@ideaplatform.ru');
        await element(by.css('input[name="to"]')).sendKeys('timur@ideaplatform.ru, vadim@ideaplatform.ru, olga.dubik@ideaplatform.ru, dorin.grigorii@ideaplatform.ru, aleksey.avetisyan@ideaplatform.ru');
        await browser.sleep(2000);
        // await element(by.css('input[name="subject"]')).sendKeys('Не открывается SM online');
        await element(by.css('input[name="subj"]')).sendKeys('Не_открывается_SM_online');
        await browser.sleep(2000);
        // await element(by.css('div[title="Напишите что-нибудь"] div')).sendKeys('Добрый день! Во время автотеста не удалось открыть страницу SM online.');
        await element(by.css('textarea[name="send"]')).sendKeys('Добрый день! Во время автотеста не удалось открыть страницу SM online.');
        await browser.sleep(2000);
        await element(by.css('input[value="Отправить"]')).click();
        await browser.wait(EC.presenceOf(element(by.cssContainingText('.b-statusline', 'Письмо отправлено'))), defaultWaitTimeout);
        await browser.sleep(2000);
//         await element(by.className('PSHeader-Right')).click(2000);
        await browser.switchTo().window(tabs[1]);
        await browser.sleep(2000);
      }
    }).catch(async err => {
      await console.log('Не открывается SM online', err);
      await browser.switchTo().window(tabs[1]);
      await browser.sleep(2000);
    })
  }, skip());

  it('2. Scroll down', async done => {
    console.log('2. Скролл вниз страницы');
    await errorCatcher(async () => {
      // // для разрешения более 1024px
      // const footerEl = await element(by.css('.big-title'));
      // await browser.executeScript("arguments[0].scrollIntoView();", footerEl);
      // await browser.sleep(2500);

      // для разрешения 1024px
      await element(by.css('.burger-menu')).click();
      await browser.wait(EC.presenceOf(element(by.cssContainingText('.mobile-menu .buttons .log-in-btn', 'Вход'))), defaultWaitTimeout);
      await browser.sleep(2000);
      await element(by.css('.mobile-menu .open-modal-sign-up')).click();
      await browser.wait(EC.presenceOf(element(by.css('.enter-email .sign-up__form button span', 'Зарегистрироваться'))), defaultWaitTimeout);
      await browser.sleep(1500);
    }, done);
  }, skip());

  it('3. Press btn Registry, input and send data', async done => {
    console.log('3. Регистрация');
    await errorCatcher(async () => {
      // // для разрешения более 1024px
      // await element(by.css('.footer .try-for-free-btn')).click();
      await browser.sleep(2500);

      const sendBtn = await element(by.css('.modal-window-sign-up .send-form'));
      if (sendBtn) {
        await element(by.name('email')).sendKeys('tech@ideaplatform.ru');
        await browser.sleep(1500);
        await sendBtn.click();
        await browser.wait(EC.presenceOf(element(by.cssContainingText('.visit-link-message p', 'Мы отправили вам'))), defaultWaitTimeout);
        await browser.sleep(1500);

        const hasSendText = await element(by.cssContainingText('.modal-window-sign-up .visit-link-message p', 'Мы отправили'));
        await hasSendText.isPresent().then(async present => {
          if (!present) {
            await console.log('Не проходит регистрация на SM online');
            const tabs = await browser.getAllWindowHandles();
            await browser.switchTo().window(tabs[0]);
            // await element(by.cssContainingText('a[href="#compose"]', 'Написать')).click();
            await element(by.css('.b-toolbar__i .b-toolbar__col a[aria-label="Написать"]')).click();
            await browser.wait(EC.presenceOf(element(by.css('.b-form-label', 'Тема'))), defaultWaitTimeout);
            await browser.sleep(7000);
            // await element(by.css('div[title="Кому"]')).sendKeys('timur@ideaplatform.ru vadim@ideaplatform.ru olga.dubik@ideaplatform.ru dorin.grigorii@ideaplatform.ru aleksey.avetisyan@ideaplatform.ru');
            await element(by.css('input[name="to"]')).sendKeys('timur@ideaplatform.ru, vadim@ideaplatform.ru, olga.dubik@ideaplatform.ru, dorin.grigorii@ideaplatform.ru, aleksey.avetisyan@ideaplatform.ru');
            await browser.sleep(2000);
            // await element(by.css('input[name="subject"]')).sendKeys('Не проходит регистрация на SM online');
            await element(by.css('input[name="subj"]')).sendKeys('Не_проходит_регистрация_на_SM_online');
            await browser.sleep(2000);
            // await element(by.css('div[title="Напишите что-нибудь"] div')).sendKeys('Добрый день! Во время автотеста не удалось отправить данные для регистрации на SM online.');
            await element(by.css('textarea[name="send"]')).sendKeys('Добрый день! Во время автотеста не удалось отправить данные для регистрации на SM online.');
            await browser.sleep(2000);
            // await element(by.css('.ComposeControlPanel-Button_new button')).click();
            await element(by.css('input[value="Отправить"]')).click();
            await browser.wait(EC.presenceOf(element(by.cssContainingText('.b-statusline', 'Письмо отправлено'))), defaultWaitTimeout);
            await browser.sleep(2000);
//             await element(by.className('PSHeader-Right')).click(2000);
            await browser.switchTo().window(tabs[1]);
            await browser.sleep(2000);
          }
        }).catch(async err => {
          await console.log('Не проходит регистрация на SM online', err);
          await browser.switchTo().window(tabs[1]);
          await browser.sleep(2000);
        });
      }
    }, done);
  }, skip());

  it('4. Go to the Home page', async done => {
    console.log('4. Переход на страницу входа');
    await errorCatcher(async () => {
      // const isSendPage = await element(by.cssContainingText('.modal-window-sign-up .visit-link-message p', 'Мы отправили вам письмо'));
      // if (isSendPage) 
      await browser.get('https://service-manager.online/');
    }, done);
  }, skip());

  it('5. Press btn Enter, input and send data', async done => {
    console.log('5. Ввод логина и пароля');
    await errorCatcher(async () => {
      // // для разрешения более 1024px
      // const loginLink = await element(by.cssContainingText('.menu-header-content .log-in-btn p', 'Вход'));
      // await loginLink.click();
      // await browser.sleep(3000);
      const tabs = await browser.getAllWindowHandles();
      await browser.switchTo().window(tabs[1]);

      // для разрешения 1024px
      // await element(by.className('burger-menu')).click();
      // await browser.sleep(3000);
      // await element(by.css('.mobile-menu .log-in-btn')).click();
      await browser.get('https://service-manager.online/app/#/login/');
      await browser.sleep(7000);

      const paragraph = await element(by.cssContainingText('.login__header', 'Вход'));
      await paragraph.isPresent().then(async present => {
        if (present) {
          await element(by.name('user')).sendKeys('login');
          await browser.sleep(2500);
          await element(by.name('password')).sendKeys('password');
          await browser.sleep(2500);
          await element(by.css('.login__fieldset button')).click();
          await browser.sleep(3000);
        } else {
          await console.log('Не открывается страница логина на SM online');
          await browser.switchTo().window(tabs[0]);
          // await element(by.cssContainingText('a[href="#compose"]', 'Написать')).click();
          await element(by.css('.b-toolbar__i .b-toolbar__col a[aria-label="Написать"]')).click();
          await browser.wait(EC.presenceOf(element(by.css('.b-form-label', 'Тема'))), defaultWaitTimeout);
          await browser.sleep(7000);
          // await element(by.css('div[title="Кому"]')).sendKeys('timur@ideaplatform.ru vadim@ideaplatform.ru olga.dubik@ideaplatform.ru dorin.grigorii@ideaplatform.ru aleksey.avetisyan@ideaplatform.ru');
          await element(by.css('input[name="to"]')).sendKeys('timur@ideaplatform.ru, vadim@ideaplatform.ru, olga.dubik@ideaplatform.ru, dorin.grigorii@ideaplatform.ru, aleksey.avetisyan@ideaplatform.ru');
          await browser.sleep(2000);
          // await element(by.css('input[name="subject"]')).sendKeys('Не открывается страница логина на SM online');
          await element(by.css('input[name="subj"]')).sendKeys('Не_открывается_страница_логина_на_SM_online');
          await browser.sleep(1000);
          // await element(by.css('div[title="Напишите что-нибудь"] div')).sendKeys('Добрый день! Во время автотеста не удалось открыть страницу для логина в SM online.');
          await element(by.css('textarea[name="send"]')).sendKeys('Добрый день! Во время автотеста не удалось открыть страницу для логина в SM online.');
          await browser.sleep(1000);
          // await element(by.css('.ComposeControlPanel-Button_new button')).click();
          await element(by.css('input[value="Отправить"]')).click();
          await browser.wait(EC.presenceOf(element(by.cssContainingText('.b-statusline', 'Письмо отправлено'))), defaultWaitTimeout);
          await browser.sleep(2000);
//           await element(by.className('PSHeader-Right')).click(2000);
          await browser.switchTo().window(tabs[1]);
          await browser.sleep(2000);
        }
      }).catch(async err => {
        await console.log('Не открывается страница логина на SM online', err);
        await browser.switchTo().window(tabs[1]);
        await browser.sleep(2000);
      });
    }, done);
  }, skip());

  it('6. Open the browser and follow a link', async done => {
    console.log('6. Зайти в почту и перейти по ссылке');
    await errorCatcher(async () => {
      await browser.sleep(40000);
      const tabs = await browser.getAllWindowHandles();
      await browser.switchTo().window(tabs[0]);
      await browser.refresh();
      await browser.wait(EC.presenceOf(element(by.css('input[aria-label="Переслать"]'))), defaultWaitTimeout);
      await browser.sleep(7000);
  
      // открываем письмо
      await browser.sleep(5000);
      // full mailbox version
//       const letter = await element(by.cssContainingText('.js-message-snippet-body', 'Регистрация пространства в Service-Manager.online'));
      // lite version
      const letter = await element.all(by.cssContainingText('.b-messages__message_unread', 'Регистрация пространства в Service-Manager.online')).first();
      await letter.isPresent().then(async present => {
        if (present) {
          await browser.actions().doubleClick(letter).perform();
          await browser.wait(EC.presenceOf(element(by.cssContainingText('.b-message-body__content p a', 'workspace_request_confirmation'))), defaultWaitTimeout);
          await browser.sleep(5000);
  
//           await element(by.css('.react-message-wrapper__body a')).click();
          await element(by.css('.b-message-body__content p a')).click();
          await browser.sleep(2000);

          // удаляем письмо
          // full mailbox version
//           await element(by.css('.ns-view-toolbar-button-delete')).click();
          // lite version
          await element(by.css('.b-toolbar__i .b-toolbar__col input[name="delete"]')).click();
          await browser.wait(EC.presenceOf(element(by.cssContainingText('.b-statusline', 'Письмо удалено'))), defaultWaitTimeout);
          await browser.sleep(2000);

          // переключаемся на вкладку с созданием пространства
          await browser.switchTo().window(tabs[2]);
          await browser.sleep(2000);
        } else {
          await console.log('Не пришло письмо с регистрацией пространства на SM online');
//           await element(by.cssContainingText('a[href="#compose"]', 'Написать')).click();
          await element(by.css('.b-toolbar__i .b-toolbar__col a[aria-label="Написать"]')).click();
          await browser.wait(EC.presenceOf(element(by.css('.b-form-label', 'Тема'))), defaultWaitTimeout);
          await browser.sleep(7000);
//           await element(by.css('div[title="Кому"]')).sendKeys('timur@ideaplatform.ru vadim@ideaplatform.ru olga.dubik@ideaplatform.ru dorin.grigorii@ideaplatform.ru aleksey.avetisyan@ideaplatform.ru');
          await element(by.css('input[name="to"]')).sendKeys('timur@ideaplatform.ru, vadim@ideaplatform.ru, olga.dubik@ideaplatform.ru, dorin.grigorii@ideaplatform.ru, aleksey.avetisyan@ideaplatform.ru');
          await browser.sleep(2000);
//           await element(by.css('input[name="subject"]')).sendKeys('Не пришло письмо с регистрацией пространства на SM online');
          await element(by.css('input[name="subj"]')).sendKeys('Не_пришло_письмо_с_регистрацией_пространства_на_SM_online');
          await browser.sleep(200);
//           await element(by.css('div[title="Напишите что-нибудь"] div')).sendKeys('Добрый день! Во время автотеста не отправилось письмо с регистрацией пространства на SM online.');
          await element(by.css('textarea[name="send"]')).sendKeys('Добрый день! Во время автотеста не отправилось письмо с регистрацией пространства на SM online.');
          await browser.sleep(200);
//           await element(by.css('.ComposeControlPanel-Button_new button')).click();
          await element(by.css('input[value="Отправить"]')).click();
          await browser.wait(EC.presenceOf(element(by.cssContainingText('.b-statusline', 'Письмо отправлено'))), defaultWaitTimeout);
          await browser.sleep(2000);
//           await element(by.className('PSHeader-Right')).click(2000);
          await browser.switchTo().window(tabs[1]);
          await browser.sleep(2000);
        }
      }).catch(async err => {
        await console.log('Ошибка при открытии/чтении письма с регистрацией', err);
        await browser.switchTo().window(tabs[1]);
        await browser.sleep(2000);
      });
    }, done);
  }, skip());

  it('8. Remove the invitation from the base', async done => {
    console.log('8. Удалить приглашение из базы');
    await errorCatcher(async () => {
      await browser.get('https://service-manager.online/app/#/sys_workspace_request');
      await browser.sleep(1200);

      await element(by.name('user')).clear().sendKeys('autotest');
      await browser.sleep(200);
      await element(by.name('password')).clear().sendKeys('Qwerty123!1!'); // autoTest123!$
      await browser.sleep(200);
      await element(by.css('.btn-lg')).click();
      await browser.wait(EC.presenceOf(element(by.css('.toolbar-row'), defaultWaitTimeout))); // header-filter-grouping
      await browser.sleep(2000);

      // удаляем запись с регистрацией
      const rowToDel = await element.all(by.cssContainingText('table tbody tr', 'CONFIRMED')).first(); // tech@ideaplatform.ru
      await rowToDel.isPresent().then(async present => {
        if (present) {
          await browser.actions().doubleClick(rowToDel).perform();
          await browser.wait(EC.presenceOf(element(by.cssContainingText('.form-header__title', 'sys_workspace_request'))), defaultWaitTimeout);
          await browser.sleep(2000);

          await element(by.css('button[data-button-name="DELETE"]')).click();
          await browser.wait(EC.presenceOf(element(by.css('.popup__dialog-btn_primary', 'Удалить'))), defaultWaitTimeout);
          await browser.sleep(200);
          await element(by.css('.popup__dialog-btn_primary')).click();
          await browser.wait(EC.stalenessOf($('.details__modal')), defaultWaitTimeout);
          await browser.sleep(1200);
          await element(by.css('.alerts__container .alert__close-btn')).click();
          await browser.sleep(200);
        }
      }).catch(async err => {
        console.log('err in deleting registry, confirmed section', err);
      });

      // удаляем запись с регистрацией
      const rowToDel2 = await element.all(by.cssContainingText('table tbody tr', 'INVITED')).first(); // tech@ideaplatform.ru
      await rowToDel2.isPresent().then(async present => {
        if (present) {
          await browser.actions().doubleClick(rowToDel2).perform();
          await browser.wait(EC.presenceOf(element(by.cssContainingText('.form-header__title', 'sys_workspace_request'))), defaultWaitTimeout);
          await browser.sleep(2000);

          await element(by.css('button[data-button-name="DELETE"]')).click();
          await browser.wait(EC.presenceOf(element(by.css('.popup__dialog-btn_primary', 'Удалить'))), defaultWaitTimeout);
          await browser.sleep(200);
          await element(by.css('.popup__dialog-btn_primary')).click();
          await browser.wait(EC.stalenessOf($('.details__modal')), defaultWaitTimeout);
          await browser.sleep(1200);
          await element(by.css('.alerts__container .alert__close-btn')).click();
          await browser.sleep(200);
        }
      }).catch(async err => {
        console.log('err in deleting registry, invited section', err);
      });

      // удаляем запись с регистрацией
      const rowToDel3 = await element.all(by.cssContainingText('table tbody tr', 'IGNORED')).first(); // tech@ideaplatform.ru
      await rowToDel3.isPresent().then(async present => {
        if (present) {
          await browser.actions().doubleClick(rowToDel3).perform();
          await browser.wait(EC.presenceOf(element(by.cssContainingText('.form-header__title', 'sys_workspace_request'))), defaultWaitTimeout);
          await browser.sleep(2000);

          await element(by.css('button[data-button-name="DELETE"]')).click();
          await browser.wait(EC.presenceOf(element(by.css('.popup__dialog-btn_primary', 'Удалить'))), defaultWaitTimeout);
          await browser.sleep(200);
          await element(by.css('.popup__dialog-btn_primary')).click();
          await browser.wait(EC.stalenessOf($('.details__modal')), defaultWaitTimeout);
          await browser.sleep(1200);
          await element(by.css('.alerts__container .alert__close-btn')).click();
          await browser.sleep(200);
        }
      }).catch(async err => {
        console.log('err in deleting registry, ignored section', err);
      });

      // удаляем запись с регистрацией
      const rowToDel4 = await element.all(by.cssContainingText('table tbody tr', 'NEW')).first(); // tech@ideaplatform.ru
      await rowToDel4.isPresent().then(async present => {
        if (present) {
          await browser.actions().doubleClick(rowToDel4).perform();
          await browser.wait(EC.presenceOf(element(by.cssContainingText('.form-header__title', 'sys_workspace_request'))), defaultWaitTimeout);
          await browser.sleep(2000);

          await element(by.css('button[data-button-name="DELETE"]')).click();
          await browser.wait(EC.presenceOf(element(by.css('.popup__dialog-btn_primary', 'Удалить'))), defaultWaitTimeout);
          await browser.sleep(200);
          await element(by.css('.popup__dialog-btn_primary')).click();
          await browser.wait(EC.stalenessOf($('.details__modal')), defaultWaitTimeout);
          await browser.sleep(1200);
          await element(by.css('.alerts__container .alert__close-btn')).click();
          await browser.sleep(200);
        }
      }).catch(async err => {
        console.log('err in deleting registry, ignored section', err);
      });

      // выходим из ИС
      await browser.sleep(4000);
      await browser.actions().mouseMove(element(by.css('nav ul .navbar-username'))).perform();
      await browser.sleep(1500);
      await element(by.css('.button-log-out')).click();
      await browser.sleep(7000);
    }, done);
  }, skip());
});
