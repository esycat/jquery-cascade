/*jquery.cascade.ui.ext.js */
/*
 * jQuery UI cascade
 *
 * Adapted from Yehuda Katz, Rein Henrichs autocomplete plugin.
 * Depends on templating  plugin if using with templateText.
 *
 * @version: 1.3.2 (2011-01-17)
 * @requires: jQuery v1.3 or later
 * @required: jQuery.data plugin
 * @license: http://www.opensource.org/licenses/mit-license.php
 * @license: http://www.gnu.org/licenses/gpl.html
 * @copyright 2008 Mike Nichols
 * @author Mike Nichols
 * @author Eugene Janusov <esycat@gmail.com>
 */

;(function($) {
    $.ui = $.ui || {};
    $.ui.cascade = $.ui.cascade || {};
    $.ui.cascade.ext = $.ui.cascade.ext || {};
    $.ui.cascade.event = $.ui.cascade.event || {};

    $.ui.cascade.ext.ajax = function(opt) {
        var ajax = opt.ajax; // ajax options hash, not just the url
        return { getList: function(parent) {
            var _ajax = {};
            var $this = $(this); // child element
            var defaultAjaxOptions = {
                type: 'GET',
                dataType: 'json',
                success: function(json) { $this.trigger('updateList', [json]); },
                data: $.extend(_ajax.data, ajax.data, { val: opt.getParentValue(parent) })
            };
            // overwrite opt.ajax with required props (json, successcallback, data)
            // this lets us still pass in handling the other ajax callbacks and options
            $.extend(_ajax, ajax, defaultAjaxOptions);

            $.ajax(_ajax);
        } };
    };

    $.ui.cascade.ext.templateText = function(opt) {
        var template = $.makeTemplate(opt.templateText, '<%', '%>');
        return { template: function(obj) { return template(obj); } };
    };

    /*these events are bound on every instance...so the indicator appears  on each target */
    /*
    * CSS: .cascade-loading: { background: transparent url("${staticDir}/Content/images/indicator.gif") no-repeat center; }
    */
    $.ui.cascade.event.loading = function(e, source) {
        var position = {
            'z-index':  '6000',
            'position': 'absolute',
            'width':    '16px'
        };
        $.extend(position, $(this).offset());
        position.top  += 3;
        position.left += 3;

        $('<div />').attr('class', 'cascade-loading').css(position).appendTo('body');

        // Temporary disable the field, and store original value.
        $(this).data('cascade.disabled', this.disabled);
        this.disabled = true;
    };

    $.ui.cascade.event.loaded = function(e, source) {
        /* Re-enable the dropdown, but only if the parent is not disabled (e.g. by a foreign script). */
        if ($(this).data('cascade.disabled') !== undefined && !source.disabled) {
            this.disabled = $(this).data('cascade.disabled');
        }

        $('.cascade-loading').remove();
    };

})(jQuery);
