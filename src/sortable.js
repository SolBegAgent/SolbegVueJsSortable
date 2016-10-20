// required Binding attributes
// boardAtribute - 



var VueSortableHelper = (function (Vue) {
    if (!Vue.http) {
        throw new Error("Error directive usage : lib vue-resource.js is required");
    }
    return {
        CSRF_TOKEN: (function () {
            var x, myname, inputs = document.getElementsByTagName("meta");
            for (x = 0; x < inputs.length; x++) {
                myname = inputs[x].getAttribute("name");
                if (myname && myname.indexOf("csrf-token") === 0) {
                    return inputs[x].content;
                }
            }
            throw new Error("Error application : Laravel csrf-token not found");
        })(),
        sendNewStatePostRequest: function (url, itemId, orderIndex, oldGroupId, newGroupId) {
            Vue.http.post(url, {
                item_id: itemId,
                order_index: orderIndex,
                old_group_id: oldGroupId,
                new_group_id: newGroupId,
                _token: this.CSRF_TOKEN
            }, {body: 'JSON'}).then(function (response) {

            }, function (response) {
                throw new Error("Error application : " + response.body.message);
            });
        },
        mergeOptions: function (obj1, obj2) {
            var obj3 = {};
            for (var attrname in obj1) {
                obj3[attrname] = obj1[attrname];
            }
            for (var attrname in obj2) {
                obj3[attrname] = obj2[attrname];
            }
            return obj3;
        }
    };
})(Vue);

Vue.directive('sortable', function (el, binding) {
    el.style.minHeight = '20px';
    if (!binding.value.global && !binding.value.global.urlSaveAction) {
       throw new Error("Error directive usage : save-url-alias not set"); 
    }
    var itemIdAttribute=binding.value.global.itemIdAttribute?binding.value.global.itemIdAttribute:'id',
        groupIdAttribute=binding.value.global.groupIdAttribute?binding.value.global.groupIdAttribute:'id';
    var options = {
        group: {name: 'sortable', put: true, pull: true},
        sort: true,
        disabled: false,
        handle: false,
        ghostClass: 'item-placeholder',
        onEnd: function (evt) {
            var url = binding.value.global.urlSaveAction,
                    itemId = parseInt(evt.item.getAttribute(itemIdAttribute)),
                    orderIndex = evt.newIndex,
                    oldGroupId = parseInt(evt.from.getAttribute(groupIdAttribute)),
                    newGroupId = parseInt(evt.item.parentElement.getAttribute(groupIdAttribute));
            VueSortableHelper.sendNewStatePostRequest(url, itemId, orderIndex, oldGroupId, newGroupId);
        }
    }, mergedOptions;
    mergedOptions=VueSortableHelper.mergeOptions(options,binding.value.local);
    
    Sortable.create(el, mergedOptions);
});