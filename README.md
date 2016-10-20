# Описание плагина

## Общая информация
1. Подключаем минифицированную версию dist/vue-sortable.min.js.
2. Неминифицированная  версия(src/sortable.js) не включает в себя плагин RubaXa/Sortable, и предназначена только для разработки.

## Использование плагина

1. Зависимости

   Для работы необходима библиотека vue-resource.js
   Так как предпологается сохранение методом POST с помощью framework-a Laravel, в мета-тегах  должен быть сгенерирован мета-тэг csrf-token
   Плагин автоматически навешивает на каждый родительский элемент списка обязательную минимальную высоту в 20 px;

2. подключить скрипт на страницу, где необходима сортировка
   
```html
   <script type="text/javascript" src="vue-sortable.min.js"></script>
```

3. Инициализировать директиву в html-коде. Html должен иметь определенную, но нестрогую структуру. 
    В рамках одного сортируемого списка структура следующая 
    ```html 
            <parent id="parent_id" v-sortable="{global:sortableOptions,local:parent.options}">
                 <child id="child_id" />
                 <child id="child_id" />
                 <child id="child_id" />
            </div>   
    ```

    Пример сортируемых списков
    ```html 
            <div v-for="board in boards" >
                <p>{{board.name}}</p>
                  <ul v-bind:id="board.id" v-sortable="{global:sortableOptions,local:board.options}">
                    <li v-for="item in board.list"  v-bind:id="item.id"><p>{{item.name}}</p></li>
                </ul>
            </div>   
    ```

    Пример сортируемых div-ов
    ```html 
            <div v-for="board in boards" >
                <p>{{board.name}}</p>
                <div v-bind:id="board.id" v-sortable="{global:sortableOptions,local:board.options}">
                    <div v-for="item in board.list" v-bind:id="item.id"><p>{{item.name}}</p></div>
                </div>
            </div>   
    ```

4. Плагин поддерживает инициализацию некоторыми настройками базового плагина RubaXa/Sortable + ему необходимы свои глобальные настройки.
Так как настройки каждого сортируемого списка могут отличаться друг от друга, глобально инициализировать эти настройки и передевать
в каждый из сортируемых списков не совсем хорошо. В примере выше предложено использовать json объект с разделениями настроек. 
   
    ```html 
         v-sortable="{global:glopalOptions,local:board.options}"
    ```

    Глобальные настройки
    ```javascript 
        {
            groupIdAttribute: 'id',
            itemIdAttribute: 'id',
            urlSaveAction: '/index1.php'
        }

        groupIdAttribute - название атрибута родительского элемента,уникальный идентификатор сортируемой группы, по умолчанию - id;
        itemIdAttribute  - название атрибута сортируемого элемента,уникальный идентификатор сортируемого элемента,по умолчанию - id;
        urlSaveAction - алиас веб-роута, куда будет уходить POST запрос с данными.

    ```

    Локальные настройки сортируемого списка
    ```javascript 
        {
            sort: true|false,
            disabled: false|true,
            handle: false|selector,
            ghostClass: false|className
        }

        sort - возможно ли изменение очередности внутри списка, по умолчанию - true;
        disabled  - сортировка как внутри списка так и во вне не происходит,по умолчанию - false;
        handle  - селектор элемента , за который  происходит сортировка,по умолчанию - срабатывает на всем элементе;
        ghostClass - дополнительный класс, который вешается на плейсхолдер при перетаскивании элемента, по умолчанию - 'item-placeholder'.

    ```

5. После успешного события сортировки происходит событие которое иницирует POST запрос по заданному в настройках url в формате "Request Payload".

    Формат запроса следующий

    ```javascript
        {
          item_id: 5,
          order_index: 1,
          old_group_id: 3,
          new_group_id: 2, 
          _token: "sfsd4353w345"
        }
        item_id - уникальный идентификатор сортируемого элемента в БД;
        order_index  - порядковый номер сортируемого элемента после сортировки в списке;
        old_group_id  - уникальный идентификатор группы из которой был перемещен сортируемый элемент, в рамках сортировки внутри списка совподает с new_group_id;
        new_group_id - уникальный идентификатор группы в которую был перемещен сортируемый элемент;
        _token - секретный токен, валидируемый Laravel в Post запросах.

    ```
    В случае успешного сохранения данных , ничего не происходит, работа плагина продолжается. 
    В случае ошибки на сервере в теле ответа ожидается json-object с текстом в ключе message
    ```html 
       {error: true, message: "Sorting saving error"}
    ```