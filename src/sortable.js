;
(function (Vue, Sortable) {
    if (!axios) {
        throw new Error("Error directive usage : lib axios.js is required");
    }
    
    var VueSortableHelper = (function (Vue) {
        return {
            sendNewStatePostRequest: function (url, postData, callback) {
                axios.post(url, postData, {body: 'JSON'}).then(function (response) {
                    if (callback) {
                        callback(response.data);
                    }
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
        el.style.minHeight = binding.value.global.minHeigthElement?binding.value.global.minHeigthElement+'px':'20px';
        if (!binding.value.global && !binding.value.global.urlSaveAction) {
            throw new Error("Error directive usage : save-url-alias not set");
        }
        if (!binding.value.global && !binding.value.global.csrfToken) {
            throw new Error("Error directive usage : csrf_token not set");
        }
        var sorted, itemIdAttribute = binding.value.global.itemIdAttribute ? binding.value.global.itemIdAttribute : 'id',
                groupIdAttribute = binding.value.global.groupIdAttribute ? binding.value.global.groupIdAttribute : 'id';
        var options = {
            group: {name: 'sortable', put: true, pull: true},
            sort: true,
            disabled: false,
            handle: false,
            ghostClass: 'item-placeholder',
            onEnd: function (evt) {
                var url = binding.value.global.urlSaveAction,
                        postData = {
                            item_id: parseInt(evt.item.getAttribute(itemIdAttribute)),
                            order_index: evt.newIndex,
                            old_group_id: parseInt(evt.from.getAttribute(groupIdAttribute)),
                            new_group_id: parseInt(evt.item.parentElement.getAttribute(groupIdAttribute)),
                            _token: binding.value.global.csrfToken
                        };
                VueSortableHelper.sendNewStatePostRequest(url, postData, binding.value.callback);
            },
            onMove: function (evt) {
                if (sorted) {
                    sorted.parentNode.className = sorted.parentNode.className.replace('hover', '');
                }
                evt.to.parentElement.className = evt.to.parentElement.className + ' hover';
                sorted = evt.to;
            }
        }, mergedOptions;
        mergedOptions = VueSortableHelper.mergeOptions(options, binding.value.local);

        Sortable.create(el, mergedOptions);
    });
})(Vue, Sortable);