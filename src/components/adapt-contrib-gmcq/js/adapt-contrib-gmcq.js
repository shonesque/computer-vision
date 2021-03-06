define([
    'core/js/adapt',
    'components/adapt-contrib-mcq/js/adapt-contrib-mcq'
], function(Adapt, Mcq) {

    var Gmcq = Mcq.view.extend({

        setupQuestion: function() {
            Mcq.view.prototype.setupQuestion.call(this);

            this.listenTo(Adapt, {
                'device:changed': this.resizeImage,
                'device:resize': this.onDeviceResize
            });

        },

        onQuestionRendered: function() {

            this.resizeImage(Adapt.device.screenSize);
            this.setUpColumns();

            this.$('label').imageready(this.setReadyStatus.bind(this));

        },

        onDeviceResize: function() {
            this.setUpColumns();
        },

        resizeImage: function(width) {
            var imageWidth = width === 'medium' ? 'small' : width;

            this.$('label').each(function(index) {
                var $img = $(this).find('img');
                var newSrc = $img.attr('data-' + imageWidth);
                if (!newSrc) return;
                $img.attr('src', newSrc);
            });

        },

        setUpColumns: function() {
            var columns = this.model.get('_columns');

            if (!columns) return;

            if (Adapt.device.screenSize === 'large') {
                this.$el.addClass('gmcq-column-layout');
                this.$('.gmcq-item').css('width', (100 / columns) + '%');
            } else {
                this.$el.removeClass('gmcq-column-layout');
                this.$('.gmcq-item').css('width', '');
            }
        }

    }, {
        template: 'gmcq'
    });

    return Adapt.register("gmcq", {
        view: Gmcq,
        model: Mcq.model.extend({})
    });

});
