/*jquery.cascade.js */
/*
 * jQuery UI cascade
 *
 * Adapted from Yehuda Katz, Rein Henrichs autocomplete plugin.
 *
 * @version: 1.3 (2010-12-02)
 * @requires: jQuery v1.3 or later
 * @license: http://www.opensource.org/licenses/mit-license.php
 * @license: http://www.gnu.org/licenses/gpl.html
 * @copyright 2008 Mike Nichols
 * @author Mike Nichols
 * @author Eugene Janusov <esycat@gmail.com>
 */

;(function($) {

  $.ui = $.ui || {}; $.ui.cascade = $.ui.cascade || {};

  $.fn.cascade = function(parent, opt) {
    if (opt.event) {
        // namespace our event
        //opt.event = opt.event.replace('.cascade', '') + '.cascade';
    }

    opt = $.extend({}, {
        list: [], // static list to use as datasource
        timeout: 10, // delay before firing getList operation
        getList: function(select) { $(this).trigger("updateList", [opt.list]); }, // function to fetch datasource
        template: function(item) { return "<option value='" + item.value + "'>" + item.text + "</option>"; }, // applied to each item in datasource
        match: function(selectedValue) { return this.when == selectedValue; }, // 'this' is the js object, or the current list item from 'getList'
        event: "change", // event to listen on parent which fires the cascade
        getParentValue: function(parent) { return $(parent).val(); } // delegate for retrieving the parent element's value
    }, opt);

    if ($.ui.cascade.ext) {
        for(var ext in $.ui.cascade.ext) {
            if (opt[ext]) {
            opt = $.extend(opt, $.ui.cascade.ext[ext](opt));
            delete opt[ext];
            }
        }
    }

    return this.each(function() {
        var source = $(parent);
        var self = $(this);
        var curVal = self.val();

        // bind any events in extensions to each instance
        if ($.ui.cascade.event) {
            for(var e in $.ui.cascade.event) {
                self.bind(e + ".cascade", [source], $.ui.cascade.event[e]);
            }
        }

        $(source).bind(opt.event, function() {
            // store current value first of all, even loading event can modify the select element
            curVal = self.val();

            self.trigger("loading.cascade", [source[0]]);

            var selectTimeout = $.data(self, "selectTimeout");
            if (selectTimeout) { window.clearInterval(selectTimeout); }
            $.data(self, "selectTimeout", window.setTimeout(function() {
                    self.trigger("cascade");
            }, opt.timeout));

        });

        self.bind("cascade", function() {
          self.one("updateList", function(e, list) {
            list = $(list)
              .filter(function() { return opt.match.call(this, opt.getParentValue(parent)); })
              .map(function() {
                var node = $(opt.template(this))[0];
                return node;
              });

            self.empty(); // clear the source/select

            if (list.length) {
                self.html(list);

                if (curVal != null) self.val(curVal);
            }

            self.trigger("loaded.cascade", [source[0]]); // be sure to fire even if there is no data

            if (self.is(":input")) { // opinionated, but enables cascading from this element as well
                self.trigger("change.cascade");
            }
          });

          opt.getList.call(self[0], source); // call with child element as this

        });
    });
  };

})(jQuery);
