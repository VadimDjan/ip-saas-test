describe("Регистрация пространства", function () {
  const $h = protractor.helpers;
  const EC = protractor.ExpectedConditions;
  const path = protractor.libs.path;

  const { errorCatcher } = $h.common;
  const { defaultWaitTimeout } = $h.wait;

  let spareId;

  function skip() {
    return !protractor.totalStatus.ok;
  }

  it(
    "open link",
    async (done) => {
      console.log("Авторизация в системе");
      await errorCatcher(async () => {
        await browser.get("http://localhost:8081/#/login"); // https://service-manager.online/app/#/entitytype
        await browser.sleep(2000);
        const loginHeader = await element(
          by.cssContainingText(".login__header", "Вход")
        );
        if (loginHeader) {
          await element(by.name("user")).clear().sendKeys("demo"); // alisa
          await browser.sleep(500);
          await element(by.name("password")).clear().sendKeys("Qwerty123!"); // Ktnj_pf_jryjv1
          await browser.sleep(500);
          await element(by.css(".login__fieldset button")).click();
          // await browser.wait(EC.presenceOf(element(by.cssContainingText('.header-logo', 'IP Service Manager'))), defaultWaitTimeout);
          await browser.sleep(2000);
        }
        // await expect(element(by.cssContainingText('.header-logo', 'IP Service Manager')));
      }, done);
    },
    skip()
  );

  it("Проверить работу личного кабинета", async (done) => {
    console.log("Проверить работу личного кабинета");
    await errorCatcher(async () => {
      await browser
        .actions()
        .mouseMove(element(by.className("username")))
        .perform();
      await browser.sleep(1000);
      const userProfileBtn = await element(
        by.cssContainingText(".dropdown-menu li", "Личный кабинет")
      );
      const hasUserProfileBtn = await userProfileBtn.isPresent();
      if (hasUserProfileBtn) await userProfileBtn.click();
      await browser.wait(
        EC.presenceOf(
          element(
            by.cssContainingText(
              ".form-header__title",
              "Личный кабинет пользователя"
            )
          )
        ),
        defaultWaitTimeout
      );

      await browser.wait(
        EC.stalenessOf($(".loader-spinner")),
        defaultWaitTimeout
      );
      await browser.sleep(1000);
      await element(
        by.cssContainingText(
          ".details__modal .accordion-panel",
          "Моя рабочая область"
        )
      ).click();
      await browser.wait(
        EC.visibilityOf(element(by.css(".dashboard-item__wrapper_subgrid"))),
        defaultWaitTimeout
      );
      await element(by.css(".details__close-btn")).click();
      await browser.wait(
        EC.stalenessOf(
          element(
            by.cssContainingText(
              ".form-header__title",
              "Личный кабинет пользователя"
            )
          )
        ),
        defaultWaitTimeout
      );
      await browser.sleep(500);
    });
  });

  it(
    "Добавить запись таблицу Запчасть",
    async (done) => {
      console.log("Добавить запись таблицу Запчасть");
      await errorCatcher(async () => {
        await browser.get("http://localhost:8081/#/entitytype/"); // https://service-manager.online/app/#/entitytype
        await browser.wait(
          EC.presenceOf(
            element(by.cssContainingText(".table-name", "Таблица"))
          ),
          defaultWaitTimeout
        );

        await browser.sleep(1000);
        const dataRow = await element(
          by.cssContainingText("tr", "Данные (Data)")
        );
        const referenceRow = await element(
          by.cssContainingText("tr", "Справочник (Reference)")
        );
        const hasDataRow = await dataRow.isPresent();
        const hasReferenceRow = await referenceRow.isPresent();
        if (hasDataRow && hasReferenceRow)
          await console.log("таблицы Данные и Справочники созданы");

        await element(by.css(".idea-button-add-row-modal")).click();
        await browser.wait(
          EC.presenceOf(
            element(
              by.cssContainingText(
                ".modal-content .form-header__title",
                "Таблица"
              )
            )
          ),
          defaultWaitTimeout
        );
        await browser.sleep(2000);

        // пишем название в заголовке
        await element(by.css(".displayname__name_active")).sendKeys("Запчасть");
        await browser.sleep(2000);
        await element(by.css(".displayname .glyphicon-ok")).click();
        await browser.sleep(2000);
        //задаем системное имя
        await element(
          by.css('div[data-field-name="tablename"] input')
        ).sendKeys("spare");
        await browser.sleep(1500);

        // очистка и выбор поля Справочник из выпадающего списка
        await element(
          by.css('div[data-field-name="baseentitytypeid"] .glyphicon-remove')
        ).click();
        await browser.sleep(2000);
        await element(
          by.css('div[data-field-name="baseentitytypeid"]')
        ).click();
        await browser.sleep(5000);
        await element(by.css(".rw-popup-container .rw-input-reset")).sendKeys(
          "Справочник (Reference)"
        );
        await browser.sleep(4000);
        await element(
          by.cssContainingText(".rw-popup ul li", "Справочник (Reference)")
        ).click();
        await browser.sleep(1500);

        // жмём кн Создать
        await element(by.css('button[data-button-name="CREATE"]')).click();
        await browser.sleep(2000);

        // активируем таблицу
        await element(
          by.css('div[data-field-name="isactive"] .checkboxfield__checkbox')
        ).click();
        await browser.sleep(2000);

        // сохранение изменений
        await element(by.css('button[data-button-name="UPDATE"]')).click();
        await browser.sleep(7000);

        // переключаемся на вкладку Настройки отображения
        await element(
          by.cssContainingText(".accordion-panel", "Общая информация")
        ).click();
        // await browser.wait(EC.presenceOf(element(by.cssContainingText('.accordion-panel', 'Настройки отображения'))), defaultWaitTimeout);
        await browser.sleep(3000);
        await element(
          by.cssContainingText(".accordion-panel", "Настройки отображения")
        ).click();
        await browser.wait(
          EC.presenceOf(
            element(
              by.cssContainingText(
                ".subgrid-table-title",
                "Настройки отображения"
              )
            )
          ),
          defaultWaitTimeout
        );
        await browser.sleep(3000);

        const oneRow = await element(
          by.cssContainingText("tr", "Запчасть - Список записей")
        );
        const rowList = await element(
          by.cssContainingText("tr", "Запчасть - Одна запись")
        );
        const hasOneRow = await oneRow.isPresent();
        const hasRowList = await rowList.isPresent();
        if (hasOneRow && hasRowList)
          await console.log(
            "формы списка заказов и одной записи заказа созданы"
          );
        await browser.sleep(2000);
        // open form designer
        const detailRow = await element(
          by.cssContainingText("tr", "Запчасть - Одна запись")
        );
        await browser.actions().doubleClick(detailRow).perform();
        await browser.wait(
          EC.presenceOf(
            element(
              by.cssContainingText(
                ".form-header__title",
                "Настройки отображения"
              )
            )
          ),
          defaultWaitTimeout
        );
        await browser.sleep(2000);
        await element(
          by.css('div[data-field-name="label_base"] .glyphicon-pencil')
        ).click();
        await browser.sleep(2000);

        // switch to tab with form designer
        const tabs = await browser.getAllWindowHandles();
        await browser.switchTo().window(tabs[1]);
        await browser.sleep(2000);

        // Drag&Drop settings
        const sidebar = await element.all(
          by.css(".form-designer__sidebar-group")
        );
        const form = await element.all(by.css(".react-grid-layout")).first();
        const dnd = require("html-dnd").code;

        // Поле цена
        await sidebar[1].click();
        await browser.sleep(2000);
        const doubleNumber = await element
          .all(
            by.css(
              ".form-designer__sidebar-group[open] .form-designer__control-wrapper"
            )
          )
          .get(1);
        await browser.executeScript(dnd, doubleNumber, form);
        await browser.wait(
          EC.presenceOf(
            element(by.cssContainingText(".form-header__title", "Поле"))
          ),
          defaultWaitTimeout
        );
        await browser.sleep(1000);
        // пишем название в заголовке
        await element(by.css(".form-header__title .glyphicon-pencil")).click();
        await browser.sleep(2000);
        await element(by.css(".displayname__name_active")).sendKeys(
          "Цена (Price)"
        );
        await browser.sleep(200);
        await element(by.css(".displayname .glyphicon-ok")).click();
        await browser.sleep(200);
        // задаем полю системное имя
        await element(
          by.css('div[data-field-name="fieldname"] input')
        ).sendKeys("price");
        await browser.sleep(200);
        // change field format
        await element(
          by.css(
            'div[data-field-name="fieldformatid"] .comboboxfield__container'
          )
        ).click();
        await browser.sleep(2000);
        await element(
          by.cssContainingText(
            'div[data-field-name="fieldformatid"] .rw-popup-container ul li',
            "Дробное число (Double) с 2 знаками после запятой"
          )
        ).click();
        await browser.sleep(2000);
        // check isRequired
        await element(
          by.css(
            'div[data-detail="entityfield"] div[data-field-name="isrequired"] .checkboxfield__checkbox'
          )
        ).click();
        await browser.sleep(200);
        // кн Создать поле
        await element(by.cssContainingText("button", "Создать поле")).click();
        await browser.wait(
          EC.stalenessOf($('[data-button-name="CREATE"] .loader-spinner')),
          defaultWaitTimeout
        );
        await browser.sleep(1000);
        // check Аудит включен
        await element(
          by.css(
            'div[data-detail="entityfield"] div[data-field-name="isauditon"] .checkboxfield__checkbox'
          )
        ).click();
        await browser.sleep(200);
        await element
          .all(by.cssContainingText("button", "Сохранить"))
          .last()
          .click();
        await browser.sleep(2000);
        await element(by.css(".details__close-btn")).click();
        await browser.wait(
          EC.stalenessOf($(".details-fade")),
          defaultWaitTimeout
        );
        await browser.sleep(1000);

        // закрыть секцию бокового меню
        await element
          .all(by.css(".form-designer__sidebar-group[open] summary"))
          .click();
        await browser.sleep(100);
        // Сохранить форму
        await element(by.cssContainingText("button", "Сохранить")).click();
        await browser.sleep(2000);

        // поле Описание
        await sidebar[2].click();
        await browser.sleep(2000);
        const description = await element
          .all(
            by.css(
              ".form-designer__sidebar-group[open] .form-designer__control-wrapper"
            )
          )
          .get(1);
        await browser.executeScript(dnd, description, form);
        await browser.sleep(2000);
        // set displayname
        await element(by.css(".form-header__title .glyphicon-pencil")).click();
        await browser.sleep(2000);
        await element(by.css(".displayname__name_active")).sendKeys("Описание");
        await browser.sleep(200);
        await element(by.css(".displayname .glyphicon-ok")).click();
        await browser.sleep(200);
        // задаем полю системное имя
        await element(
          by.css('div[data-field-name="fieldname"] input')
        ).sendKeys("descriptiontest");
        await browser.sleep(200);
        // change field format
        await element(
          by.css(
            'div[data-field-name="fieldformatid"] .comboboxfield__remove-btn'
          )
        ).click();
        await browser.sleep(2000);
        await element(
          by.css('div[data-field-name="fieldformatid"] .rw-dropdown-list-input')
        ).click();
        await browser.sleep(2000);
        await element(
          by.css(
            'div[data-field-name="fieldformatid"] .rw-popup-container .rw-input-reset'
          )
        ).sendKeys("Simple Rich Text Editor (Rich Text Editor)");
        await browser.sleep(2000);
        await element(
          by.cssContainingText(
            'div[data-field-name="fieldformatid"] .rw-popup-transition ul li',
            "Simple Rich Text Editor (Rich Text Editor)"
          )
        ).click();
        await browser.sleep(2000);
        // кн Создать поле
        await element(by.cssContainingText("button", "Создать поле")).click();
        await browser.wait(
          EC.stalenessOf($('[data-button-name="CREATE"] .loader-spinner')),
          defaultWaitTimeout
        );
        await browser.sleep(1000);
        //check Аудит включен
        await element(
          by.css(
            'div[data-detail="entityfield"] div[data-field-name="isauditon"] .checkboxfield__checkbox'
          )
        ).click();
        await browser.sleep(2000);
        // save & close
        await element
          .all(by.cssContainingText("button", "Сохранить"))
          .last()
          .click();
        await browser.sleep(2000);
        await element(by.css(".details__close-btn")).click();
        await browser.wait(
          EC.stalenessOf($(".details-fade")),
          defaultWaitTimeout
        );
        await browser.sleep(1000);

        // закрыть секцию бокового меню
        await element
          .all(by.css(".form-designer__sidebar-group[open] summary"))
          .click();
        await browser.sleep(100);
        // Сохранить форму
        await element(by.cssContainingText("button", "Сохранить")).click();
        await browser.sleep(2000);

        // поле Картинка
        await sidebar[6].click();
        await browser.sleep(2000);
        const image = await element
          .all(
            by.css(
              ".form-designer__sidebar-group[open] .form-designer__control-wrapper"
            )
          )
          .get(3);
        await browser.executeScript(dnd, image, form);
        await browser.sleep(2000);
        // пишем название в заголовке
        await element(by.css(".form-header__title .glyphicon-pencil")).click();
        await browser.sleep(2000);
        await element(by.css(".displayname__name_active")).sendKeys("Картинка");
        await browser.sleep(200);
        await element(by.css(".displayname .glyphicon-ok")).click();
        await browser.sleep(200);
        // задаем полю системное имя
        await element(
          by.css('div[data-field-name="fieldname"] input')
        ).sendKeys("imgtest");
        await browser.sleep(100);
        // кн Создать поле
        await element(by.cssContainingText("button", "Создать поле")).click();
        await browser.wait(
          EC.stalenessOf($('[data-button-name="CREATE"] .loader-spinner')),
          defaultWaitTimeout
        );
        await browser.sleep(1000);
        // close modal
        await element(by.css(".details__close-btn")).click();
        await browser.wait(
          EC.stalenessOf($(".details-fade")),
          defaultWaitTimeout
        );
        await browser.sleep(1000);

        // закрыть секцию бокового меню
        await element
          .all(by.css(".form-designer__sidebar-group[open] summary"))
          .click();
        await browser.sleep(100);
        // Сохранить форму
        await element(by.cssContainingText("button", "Сохранить")).click();
        await browser.sleep(2000);

        // поле Переработка
        await sidebar[4].click();
        await browser.sleep(2000);
        const typeRow = await element
          .all(
            by.css(
              ".form-designer__sidebar-group[open] .form-designer__control-wrapper"
            )
          )
          .get(6);
        await browser.executeScript(dnd, typeRow, form);
        await browser.sleep(2000);
        // пишем название в заголовке
        await element(by.css(".form-header__title .glyphicon-pencil")).click();
        await browser.sleep(2000);
        await element(by.css(".displayname__name_active")).sendKeys(
          "Переработка"
        );
        await browser.sleep(200);
        await element(by.css(".displayname .glyphicon-ok")).click();
        await browser.sleep(200);
        // задаем полю системное имя
        await element(
          by.css('div[data-field-name="fieldname"] input')
        ).sendKeys("is_recycle");
        await browser.sleep(100);
        // set pattern
        await element(
          by.css('div[data-field-name="_$_FF/pattern"] input')
        ).sendKeys(
          "1:Полностью перерабатывается;2:Частично перерабатывается;3:Не перерабатывается"
        );
        await browser.sleep(200);
        // default value
        await element(
          by.css('div[data-field-name="defaultvalue"] input')
        ).sendKeys("3");
        // кн Создать поле
        await element(by.cssContainingText("button", "Создать поле")).click();
        await browser.wait(
          EC.stalenessOf($('[data-button-name="CREATE"] .loader-spinner')),
          defaultWaitTimeout
        );
        await browser.sleep(3000);
        // close modal
        await element(by.css(".details__close-btn")).click();
        await browser.wait(
          EC.stalenessOf($(".details-fade")),
          defaultWaitTimeout
        );
        await browser.sleep(1000);

        // закрыть секцию бокового меню
        await element
          .all(by.css(".form-designer__sidebar-group[open] summary"))
          .click();
        await browser.sleep(100);
        // Сохранить форму
        await element(by.cssContainingText("button", "Сохранить")).click();
        await browser.sleep(2000);

        // поле Материал
        await sidebar[4].click();
        await browser.sleep(2000);
        const materialList = await element
          .all(
            by.css(
              ".form-designer__sidebar-group[open] .form-designer__control-wrapper"
            )
          )
          .first();
        await browser.executeScript(dnd, materialList, form);
        await browser.sleep(2000);
        // пишем название в заголовке
        await element(by.css(".form-header__title .glyphicon-pencil")).click();
        await browser.sleep(2000);
        await element(by.css(".displayname__name_active")).sendKeys("Материал");
        await browser.sleep(200);
        await element(by.css(".displayname .glyphicon-ok")).click();
        await browser.sleep(200);
        // задаем полю системное имя
        await element(
          by.css('div[data-field-name="fieldname"] input')
        ).sendKeys("materialtest");
        await browser.sleep(200);
        // set pattern
        await element(
          by.css('div[data-field-name="_$_FF/pattern"] input')
        ).sendKeys("metal:Металл;plastic:Пластик;wood:Дерево");
        await browser.sleep(200);
        // кн Создать поле
        await element(by.cssContainingText("button", "Создать поле")).click();
        await browser.wait(
          EC.stalenessOf($('[data-button-name="CREATE"] .loader-spinner')),
          defaultWaitTimeout
        );
        await browser.sleep(1000);
        // close modal
        await element(by.css(".details__close-btn")).click();
        await browser.wait(
          EC.stalenessOf($(".details-fade")),
          defaultWaitTimeout
        );
        await browser.sleep(1000);

        // подвинем на форме поле Цена
        const priceRow = await element(by.css('div[data-field-name="price"]'));
        await browser
          .actions()
          .mouseDown(priceRow)
          .mouseMove({ x: -600, y: 0 })
          .mouseUp()
          .perform();
        await browser.sleep(2000);

        // подвинем на форме поле Картинка
        const imgRow = await element(by.css('div[data-field-name="imgtest"]'));
        await browser
          .actions()
          .mouseDown(imgRow)
          .mouseMove({ x: -600, y: 0 })
          .mouseUp()
          .perform();
        await browser.sleep(2000);

        // Сохранить форму
        await element(by.cssContainingText("button", "Сохранить")).click();
        await browser.sleep(2000);

        // switch to the 1st tab
        await browser.switchTo().window(tabs[0]);
        await browser.sleep(2000);

        await browser.get("http://localhost:8081/#/spare/"); // https://service-manager.online/app/#/spare
        await browser.wait(
          EC.presenceOf(
            element(by.cssContainingText(".table-name", "Запчасть"))
          ),
          defaultWaitTimeout
        );
        await browser.sleep(200);

        // формирование вида списка Запчастей
        await element(by.css(".view-settings-button")).click();
        await browser.sleep(2000);
        await element(
          by.css('.k-column-menu ul li[data-field-name="price"]')
        ).click();
        await element(
          by.css('.k-column-menu ul li[data-field-name="descriptiontest"]')
        ).click();
        await element(
          by.css('.k-column-menu ul li[data-field-name="imgtest"]')
        ).click();
        await element(
          by.css('.k-column-menu ul li[data-field-name="materialtest"]')
        ).click();
        await element(
          by.css('.k-column-menu ul li[data-field-name="is_recycle"]')
        ).click();
        await browser.sleep(4000);
        // await element(by.css('a[title="Сохранить настройки"]')).click(); // .publish-changes-button
        // await browser.sleep(2000);
        await browser.refresh();
        await browser.sleep(2000);

        // добавление записей в справочник Запчасти
        // 1
        await element(by.cssContainingText("a", "Добавить запись")).click(); // в модальном окне
        await browser.wait(
          EC.presenceOf(
            element(
              by.cssContainingText(".form-header__title span", "Запчасть")
            )
          ),
          defaultWaitTimeout
        );
        await browser.sleep(200);
        await element(by.css(".displayname__name")).sendKeys("Запчасть 2");
        await browser.sleep(2000);
        await element(by.css('div[data-field-name="price"] input')).sendKeys(
          "11.55"
        );
        await browser.sleep(2000);
        await element(
          by.css('div[data-field-name="descriptiontest"] .sun-editor-editable')
        ).sendKeys("Тут есть буква и");
        await browser.sleep(80);
        await element(
          by.cssContainingText(
            'div[data-field-name="is_recycle"] ul li',
            "Полностью перерабатывается"
          )
        ).click();
        await browser.sleep(80);
        await element(by.css('div[data-field-name="materialtest"]')).click();
        await browser.sleep(2000);
        await element(
          by.cssContainingText(".rw-popup-container ul li span", "Металл")
        ).click();
        await browser.sleep(2000);
        const imageField = await element(
          by.css('div[data-field-name="imgtest"] input')
        );
        let imgToUpload = "./sign.jpg";
        const absolutePath = path.resolve(__dirname, imgToUpload);
        imageField.sendKeys(absolutePath);
        await browser.sleep(5000);
        await element(by.css('button[data-button-detail="spare"]')).click();
        await browser.sleep(2000);
        await element(by.css(".modal-content .details__close-btn")).click();
        await browser.sleep(1500);

        // 2
        await element(by.cssContainingText("a", "Добавить запись")).click(); // в модальном окне
        await browser.wait(
          EC.presenceOf(
            element(
              by.cssContainingText(".form-header__title span", "Запчасть")
            )
          ),
          defaultWaitTimeout
        );
        await browser.sleep(200);
        await element(by.css(".displayname__name")).sendKeys("Запчасть 1");
        await browser.sleep(2000);
        await element(by.css('div[data-field-name="price"] input')).sendKeys(
          "2.01"
        );
        await browser.sleep(2000);
        await element(
          by.css('div[data-field-name="descriptiontest"] .sun-editor-editable')
        ).sendKeys("Тут нет");
        await browser.sleep(80);
        await element(
          by.cssContainingText(
            'div[data-field-name="is_recycle"] ul li',
            "Частично перерабатывается"
          )
        ).click();
        await browser.sleep(80);
        await element(by.css('div[data-field-name="materialtest"]')).click();
        await browser.sleep(2000);
        await element(
          by.cssContainingText(".rw-popup-container ul li span", "Пластик")
        ).click();
        await browser.sleep(2000);
        const imageField2 = await element(
          by.css('div[data-field-name="imgtest"] input')
        );
        let imgToUpload2 = "./sign.jpg";
        const absolutePath2 = path.resolve(__dirname, imgToUpload2);
        imageField2.sendKeys(absolutePath2);
        await browser.sleep(5000);
        await element(by.css('button[data-button-detail="spare"]')).click();
        await browser.sleep(2000);
        await element(by.css(".modal-content .details__close-btn")).click();
        await browser.sleep(1500);

        // 3
        await element(by.cssContainingText("a", "Добавить запись")).click(); // в модальном окне
        await browser.wait(
          EC.presenceOf(
            element(
              by.cssContainingText(".form-header__title span", "Запчасть")
            )
          ),
          defaultWaitTimeout
        );
        await browser.sleep(200);
        await element(by.css(".displayname__name")).sendKeys("Запчасть 3");
        await browser.sleep(2000);
        await element(by.css('div[data-field-name="price"] input')).sendKeys(
          "10"
        );
        await browser.sleep(2000);
        await element(
          by.css('div[data-field-name="descriptiontest"] .sun-editor-editable')
        ).sendKeys("Тут нет");
        await browser.sleep(80);
        await element(by.css('div[data-field-name="materialtest"]')).click();
        await browser.sleep(2000);
        await element(
          by.cssContainingText(".rw-popup-container ul li span", "Дерево")
        ).click();
        await browser.sleep(2000);
        const imageField3 = await element(
          by.css('div[data-field-name="imgtest"] input')
        );
        let imgToUpload3 = "./sign.jpg";
        const absolutePath3 = path.resolve(__dirname, imgToUpload3);
        imageField3.sendKeys(absolutePath3);
        await browser.sleep(5000);
        await element(by.css('button[data-button-detail="spare"]')).click();
        await browser.sleep(2000);
        await element(by.css(".modal-content .details__close-btn")).click();
        await browser.sleep(1500);

        // сортировка по полю Цена
        await element(by.css('th[data-title="Цена (Price)"]')).click();
        await browser.sleep(2000);

        // фильтры у колонок
        // Материал
        await element(
          by.css('th[data-title="Материал"] .k-grid-filter')
        ).click();
        await browser.sleep(1000);
        await element(
          by.cssContainingText(".k-filter-menu ul li .k-label", "Металл")
        ).click();
        await browser.sleep(200);
        await element(
          by.cssContainingText(".k-filter-menu button", "Найти")
        ).click();
        await browser.sleep(1000);
        await element(by.css('a[title="Закрыть"]')).click(); // .header-filter-grouping
        await browser.refresh();
        await browser.sleep(2000);
        // Переработка
        await element(
          by.css('th[data-title="Переработка"] .k-grid-filter')
        ).click();
        await browser.sleep(1000);
        await element(
          by.cssContainingText(
            ".k-filter-menu ul li .k-label",
            "Не перерабатывается"
          )
        ).click();
        await browser.sleep(200);
        await element(
          by.cssContainingText(".k-filter-menu button", "Найти")
        ).click();
        await browser.sleep(1000);
        await element(by.css('a[title="Закрыть"]')).click(); // .header-filter-grouping
        await browser.sleep(2000);
        // Цена
        await element(
          by.css('th[data-title="Цена (Price)"] .k-grid-filter')
        ).click();
        await browser.sleep(2000);
        await element
          .all(by.css(".k-animation-container .k-numerictextbox span input"))
          .first()
          .sendKeys("10");
        await browser.sleep(200);
        await element
          .all(by.cssContainingText(".k-animation-container button", "Найти"))
          .last()
          .click();
        await browser.sleep(1000);
        await element(by.css('a[title="Закрыть"]')).click(); // .header-filter-grouping
        await browser.refresh();
        await browser.sleep(2000);
        // Описание
        await element(
          by.css('th[data-title="Описание"] .k-grid-filter')
        ).click();
        await browser.sleep(1000);
        await element
          .all(by.css('.k-animation-container input[type="text"]'))
          .first()
          .sendKeys("и");
        await browser.sleep(200);
        await element
          .all(by.cssContainingText(".k-animation-container button", "Найти"))
          .last()
          .click();
        await browser.sleep(1000);
        await element(by.css('a[title="Закрыть"]')).click(); // .header-filter-grouping
        await browser.refresh();
        await browser.sleep(2000);
      }, done);
    },
    skip()
  );

  it(
    "8. Logout",
    async (done) => {
      console.log("Выход из ИС");
      await errorCatcher(async () => {
        await browser
          .actions()
          .mouseMove(element(by.className("username")))
          .perform();
        await browser.sleep(2000);

        const logoutBtn = await element(by.css(".button-log-out"));
        const hasLogoutBtn = await logoutBtn.isPresent();
        if (hasLogoutBtn) await logoutBtn.click();
        await browser.wait(
          EC.stalenessOf(
            element(by.cssContainingText(".header-logo", "IP Service Manager"))
          ),
          defaultWaitTimeout
        );

        await expect(element(by.css(".login_service-manager")));
        await browser.sleep(2000);
      }, done);
    },
    skip()
  );
});
