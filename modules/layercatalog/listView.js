define([
    "backbone",
    "modules/layercatalog/list",
    "modules/layercatalog/viewNode",
    "eventbus"
], function (Backbone, CatalogList, NodeView, EventBus) {

    var listView = Backbone.View.extend({
        collection: CatalogList,
        tagName: "ul",
        className: "list-group layer-catalog-list",
        initialize: function () {
            this.listenTo(this.collection, {
                "reset": this.render
            });
             this.render();
        },
        render: function () {
            $(".layer-catalog").after(this.$el.html(""));
            this.collection.forEach(this.addTreeNode, this);
        },
        addTreeNode: function (node) {
            var nodeView = new NodeView({model: node});

            this.$el.append(nodeView.render().el);
        }
    });

    return listView;
});
