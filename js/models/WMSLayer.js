define([
    'underscore',
    'backbone',
    'openlayers',
    'eventbus'
], function (_, Backbone, ol, EventBus) {

    var WMSLayer = Backbone.Model.extend({
        defaults: {
            id: '',
            name: '',
            url: '',
            format: '',
            visibility: '',
            version: '',
            source: '',
            layer: '',
            opacity: 1,
            transparence: 0
        },
        initialize: function () {
            this.listenTo(this, 'change:visibility', this.setVisibility);
            this.listenTo(this, 'change:transparence', this.updateOpacity)
            this.set('source', new ol.source.TileWMS({
                url: this.get('url'),
                params: {
                    'LAYERS': this.get('title'),
                    'FORMAT': this.get('format'),
                    'VERSION': this.get('version'),
                },
                tileGrid: new ol.tilegrid.TileGrid({
                    resolutions : [ 66.14614761460263, 26.458319045841044, 15.874991427504629, 10.583327618336419, 5.2916638091682096, 2.6458319045841048, 1.3229159522920524, 0.6614579761460262, 0.2645831904584105 ],
                    origin: [442800, 5809000]
                })
            }));
            this.set('layer', new ol.layer.Tile({
                source: this.get('source'),
                name: this.get('name'),
                folder: this.get('treeFolder')
            }));
            this.get('layer').setVisible(this.get('visibility'));
        },
        toggleVisibility: function () {
            if (this.get('visibility') === true) {
                this.set({'visibility': false});
            }
            else {
                this.set({'visibility': true});
            }
            EventBus.trigger('checkVisibilityByFolder');
        },
        setUpTransparence: function (value) {
            if (this.get('transparence') < 100) {
                this.set('transparence', this.get('transparence') + value);
            }
        },
        setDownTransparence: function (value) {
            if (this.get('transparence') > 0) {
                this.set('transparence', this.get('transparence') - value);
            }
        },
        updateOpacity: function () {
            var opacity = (100 - this.get('transparence')) / 100;
            this.get('layer').setOpacity(opacity);
            this.set({'opacity': opacity});
        },
        setVisibility: function () {
            this.get('layer').setVisible(this.get('visibility'));
        }
    });

    return WMSLayer;
});