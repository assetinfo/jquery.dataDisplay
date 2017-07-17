/*!
 * Script: jQuery.dataDisplay.js
 * Description: jquery.dataDisplay aids the developer in writing concise conditions against elements within a form based setting, in order to control the display of elements based on the state of a form.
 * Copyright: Copyright (c) 2014-2017 Graham Dixon - http://gdixon.co.uk/
 * Author: GDixon
 * Email: gdixon@assetinfo.co.uk
 * Licensed: MIT
 * Requires: jQuery > 1.9
 * Version: 0.0.1
 */
;(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module depending on jQuery
        define(['jquery'], factory);
    } else {
        // No AMD. Register plugin with global jQuery object
        factory(jQuery);
    }
}(
    /**
     * @fileOverview $.fn.dataDisplay - A jQuery library that aids the developer in writing concise conditions against elements within a form based setting, in order to control the display of elements based on the state of the form.
     *
     * @example <caption>Basic HTML syntax and structure example:</caption>
     * <div id="container">
     *     <input name="inputTest" type="value"/>
     *     <div class="dataDisplay"
     *         data-display="
     *             {inputTest} is equal to 'testing';"
     *         data-display-resets="
     *             $this.css('display', 'none');">
     *         <a>Test</a>
     *     </div>
     * </div>
     *
     * @example <caption>Basic JS initiation example:</caption>
     * $(function() {
     *     $('#container').dataDisplay({...});
     * });
     *
     * @version 0.0.1
     * @author Graham Dixon - gdixon@assetinfo.co.uk
     * @namespace $.fn.DataDisplay
     * @memberOf! $.fn
     */
    function ($) {
        // defaults to align the dataDisplay instance with the dom situation
        var defaults = {
            // name to bind the events against
            eventName: '.dataDisplay',
            // bind DataDisplay instance to data attribute
            dataAttr: 'dataDisplay',
            // main attribute holding the conditions on first-load
            condsAttr: 'data-display',
            // attribute holding resets (defined as jquery statements against $this)
            resetsAttr: 'data-display-resets',
            // should the plugin fire during the setup phase?
            initFire: true,
            // should the plugin fire on key events?
            keyEventsFire: true
        };

        // pre-defined helpers available in data-display's conditions
        var funcs = {
            '!empty': {
                rgx: '\\!empty\\({([^}]+)}\\)',
                exec: function (field, ctx) {
                    var str = '(';
                    $('[name*="' + field + '"]', ctx).each(function () {
                        var val = $(this).val();
                        if (str == '(') {
                            str = str + '\"' + val + '\"' + ' !== \"\" ';
                        } else {
                            str = str + ' && ' + '\"' + val + '\"' + ' !== \"\" ';
                        }
                    });
                    str = str + ')';
                    return str;
                }
            },
            'empty': {
                rgx: 'empty\\({([^}]+)}\\)',
                exec: function (field, ctx) {
                    var str = '(';
                    $('[name*="' + field + '"]', ctx).each(function () {
                        var val = $(this).val();
                        if (str == '(') {
                            str = str + '\"' + val + '\"' + ' == \"\" ';
                        } else {
                            str = str + ' && ' + '\"' + val + '\"' + ' == \"\" ';
                        }
                    });
                    str = str + ')';
                    return str;
                }
            },
            'length': {
                rgx: 'length\\({([^}]+)}\\)',
                exec: function (field, ctx) {
                    var fieldSelector = '[name*="' + field + '"]';
                    if (typeof $(fieldSelector + ':checked', ctx).val() !== "undefined") {
                        // first check for radio/checkbox - failover to inputs
                        var str = $(fieldSelector + ':checked', ctx).val().length;
                    } else {
                        // then check for everything else
                        var str = $(fieldSelector, ctx).val().length;
                    }
                    return str;
                }
            },
            'is greater than or equal to': { // or is optional
                rgx: 'is\\sgreater\\sthan\\s(?:or\\s)?equal\\sto',
                exec: function (field, ctx) {
                    return '>=';
                }
            },
            'is less than or equal to': { // or is optional
                rgx: 'is\\sless\\sthan\\s(?:or\\s)?equal\\sto',
                exec: function (field, ctx) {
                    return '<=';
                }
            },
            'is greater than': {
                rgx: 'is\\sgreater\\sthan',
                exec: function (field, ctx) {
                    return '>';
                }
            },
            'is less than': {
                rgx: 'is\\sless\'sthan',
                exec: function (field, ctx) {
                    return '<';
                }
            },
            'is equal to': {
                rgx: 'is\\sequal\\sto',
                exec: function (field, ctx) {
                    return '==';
                }
            }
        };

        /**
         * $.fn.dataDisplay - Invokes methods against a DataDisplay instance bound to the $el
         *
         * @param {object} options the settings being applied to this $el
         * @param {string} options.eventName - name to bind the events against
         * @param {string} options.dataAttr - bind DataDisplay instance to data attribute
         * @param {string} options.condsAttr - main attribute holding the conditions on first-load
         * @param {string} options.resetsAttr - attribute holding resets (defined as jquery statements against $this)
         * @param {string} options.initFire - should the plugin fire during the setup phase?
         * @param {string} options.keyEventsFire - should the plugin fire on key events?
         *
         * @version 0.0.1
         * @author Graham Dixon - gdixon@assetinfo.co.uk
         * @memberOf $.fn.DataDisplay
         */
        $.fn.dataDisplay = (function (options) {
            // the options must be passed to the init func as an array - convert any strings
            var optionsArray = (typeof options == "string" ? [options] : options);
            // only create when the giving el exists
            if ($(this).length) {
                // extend defaults with options and set to settings
                var settingsArray = $.extend({}, defaults, (typeof optionsArray !== "undefined" ? optionsArray : []));
                // extend default funcss with funcs defined in settings
                var funcsArray = $.extend({}, funcs, (typeof settingsArray.funcs !== "undefined" ? settingsArray.funcs : []));
                // check that dataDisplay instance hasnt already been created
                if (typeof $(this).data(settingsArray.dataAttr) == "undefined") {
                    // create a new instance
                    var instance = $(this).data(settingsArray.dataAttr, new DataDisplay(this, settingsArray, funcsArray));
                } else {
                    // do option based functions
                    if (typeof options !== 'undefined' && options == "destroy") {
                        // fully destroys the dataDisplay instance
                        var instance = this.data(settingsArray.dataAttr).destroy();
                    } else if (typeof options !== 'undefined') {
                        // recreates the dataDisplay instance against the defined options
                        var instance = this.data(settingsArray.dataAttr).destroy().init(this, settingsArray, funcsArray);
                    } else {
                        // return the dataDisplay instance held against the el
                        var instance = this.data(settingsArray.dataAttr);
                    }
                }
                // hold the instance against the calling element
                $(this).data(settingsArray.dataAttr, instance);
            }
            // DataDisplay instance - fully intiated or destroyed
            return instance
        });

        /**
         * @fileOverview DataDisplay - A jQuery library that aids the developer in writing concise conditions against elements within a form based setting, in order to control the display of elements based on the state of the form. <br/><br/>
         *
         * new DataDisplay($el, settings, funcs)
         *
         * @example <caption>Basic HTML syntax and structure example:</caption>
         * <div id="container">
         *     <input name="inputTest" type="value"/>
         *     <div class="dataDisplay"
         *         data-display="
         *             {inputTest} is equal to 'testing';"
         *         data-display-resets="
         *             $this.css('display', 'none');">
         *         <a>Test</a>
         *     </div>
         * </div>
         *
         * @example <caption>Basic JS initiation example:</caption>
         * $(function() {
         *     $('#container').dataDisplay({...});
         * });
         *
         * @version 0.0.1
         * @author Graham Dixon - gdixon@assetinfo.co.uk
         * @class DataDisplay
         * @memberof $.fn.dataDisplay
         */
        var DataDisplay = function (el, settings, funcs) {
            // assign internal scope to local obj
            var dataDisplay = this;

            /**
             * $.fn.dataDisplay - initiates dataDisplay on the given element with the given settings and funcs
             *
             * @function DataDisplay.init
             * @param {object} el the element that DataDisplay is being applied to
             * @param {object} settings the settings being applied to this $el
             * @param {string} settings.eventName - name to bind the events against
             * @param {string} settings.dataAttr - bind DataDisplay instance to data attribute
             * @param {string} settings.condsAttr - main attribute holding the conditions on first-load
             * @param {string} settings.resetsAttr - attribute holding resets (defined as jquery statements against $this)
             * @param {string} settings.initFire - should the plugin fire during the setup phase?
             * @param {string} settings.keyEventsFire - cshould the plugin fire on key events?
             * @param {object} funcs the funcs being supplied as helpers to build out conditions in a congruent manner
             *
             * @memberOf! DataDisplay
             */
            dataDisplay.init = function (el, settings, funcs) {
                // associate properties the outer calling scope
                var that = this;
                // record the calling outer el to use as ctx internally
                that.el = el;
                that.settings = settings;
                that.funcs = funcs;
                // initiate the conditions defined against this collection of elements
                $(that.el).each(function () {
                    // keep ref to the outer context to limit the inner scope
                    var $ctx = $(this);
                    // for each discovered element of given attribute in context apply the defined condition(s)
                    $('[' + that.settings.condsAttr + ']', $ctx).each(function () {
                        // $this is always a jquery context for single elm
                        var $this = $(this);
                        // conditions are the condition we are working against for the given elm
                        var conditions = $this.attr(that.settings.condsAttr);
                        // conditions == !isNaN when dataDisplay is already loaded - stops reiniting
                        if (isNaN(conditions)) {
                            // when the conditions array is undefined create it
                            if (typeof that.conditions == 'undefined') {
                                that.conditions = [];
                            }
                            // apply the default state
                            var applyDefaults = that.debounce(function (el) {
                                return that.applyDefaults(el);
                            });
                            // apply the main debounce logic
                            var applyConditions = that.debounce(function (conditions, fields, el, $ctx) {
                                return that.applyConditions(conditions, fields, el, $ctx);
                            });
                            // backup the css for the given elm
                            var styles = (typeof $this.attr("style") !== 'undefined' ? $this.attr("style") : '');
                            // backup the resets for the given elm
                            var resets = (typeof $this.attr(that.settings.resetsAttr) !== 'undefined' ? $this.attr(that.settings.resetsAttr) : '');
                            // n is the current position in the conditions array
                            var n = that.conditions.length;
                            // apply the context to the conditions array
                            that.conditions[n] = {
                                "this": $this,
                                "resets": resets,
                                "styles": styles,
                                "conditions": conditions
                            };
                            // remove attr and push to arr - restore on destroy -> this to ensure the doms clean. against inspect.
                            $this.attr(that.settings.condsAttr, n);
                            // discover the elms name
                            var name = $this.attr('name');
                            // find the resultant fields that these conditions will affect
                            var fields = that.findFields(conditions);
                            // construct a name to bind events to
                            var fireEvents = 'change' + that.settings.eventName + (that.settings.keyEventsFire ? ' keyup' + that.settings.eventName : '');
                            // for each field ensure we have a selector available and
                            for (i = 0; i < fields.length; i++) {
                                // end early on missing selector
                                if ($(that.getFieldSelector(fields[i]), $ctx).length == 0)
                                    return;
                                // pull input field selector
                                var field = fields[i];
                                var selector = that.getFieldSelector(field);
                                // using discovered selector bind the discovered events
                                $(selector, $ctx).on(fireEvents, {
                                    el: $this,
                                    context: $ctx,
                                    conditions: conditions,
                                    conditionFields: fields
                                }, function (e) {
                                    // apply the default conditions
                                    applyDefaults(e.data.el);
                                    // before applying the conditionally displayed rules
                                    applyConditions(e.data.conditions, e.data.conditionFields, e.data.el, e.data.context);
                                });
                            }
                            // apply defaults as defined in current context
                            that.applyDefaults($this);
                            // fire the conditions once onload -- useful for when we have a complete data set
                            if (that.settings.initFire) {
                                applyConditions(conditions, fields, $this, $ctx);
                            }
                        }
                    });
                });
                // allow chainging on setup level methods
                return that;
            };

            /**
             * this.debounce()<br/><br/>Only perform the provided function once over the given threshold timeframe
             *
             * @function DataDisplay.debounce
             * @param {function} func the provided function we would like to call
             * @param {int}  threshold for how long should we supress calling the function?
             * @param {bool}  execAsap execute the function on first load, then again after threshold
             * @return {function} calling the returned function n* over a timeframe shorter than threshold will result in one invokation
             * @memberOf DataDisplay
             */
            dataDisplay.debounce = function (func, threshold, execAsap) {
                var timeout;
                return function () {
                    var context = this;
                    var args = arguments;
                    var delayed = function () {
                        timeout = null;
                        if (!execAsap) func.apply(context, args);
                    };
                    var callNow = execAsap && !timeout;
                    clearTimeout(timeout);
                    timeout = setTimeout(delayed, threshold);
                    if (callNow) func.apply(context, args);
                };
            };

            /**
             * this.findFields()<br/><br/>Find the fields defined across the entire condition
             *
             * @function DataDisplay.findFields
             * @param {string} conditions the conditions defined against the element
             * @return {array} an array of all {variables} defined in the confitions string
             * @memberOf DataDisplay
             */
            dataDisplay.findFields = function (conditions) {
                var fields = [];
                var r = /{([^}]+)}/gi;
                // find the fields defined in the conditions
                while ((m = r.exec(conditions)) != null) {
                    fields[fields.length] = m[1];
                }
                return fields;
            };

            /**
             * this.getFieldSelector()<br/><br/>Return a string selector which assumes field relates to a name, eg [name*="..."]
             *
             * @function DataDisplay.getFieldSelector
             * @param {string} field the field we want a selector for
             * @return {string} the field wrapped in a name selector
             * @memberOf DataDisplay
             */
            dataDisplay.getFieldSelector = function (field) {
                return '[name*="' + field + '"]';
            };

            /**
             * this.escapeRegExp()<br/><br/>Return a string which has been appropriately escaped ready for a regex expression
             *
             * @function DataDisplay.escapeRegExp
             * @param {string} str the string we want to clean
             * @return {string} the clean string
             * @memberOf DataDisplay
             */
            dataDisplay.escapeRegExp = function (str) {
                return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
            };

            /**
             * this.searchFor()<br/><br/>Search for a needle in a haystack
             *
             * @function DataDisplay.searchFor
             * @param {array} array the haystack we are searching
             * @param {string} value the needle to search for
             * @return {int} the needles index in the haystack
             * @memberOf DataDisplay
             */
            dataDisplay.searchArray = function (array, value) {
                for (var key in array) {
                    if (array[key] == value) {
                        return key;
                    }
                }
                return -1;
            };

            /**
             * this.applyDefaults()<br/><br/>Apply the defaults as defined against the el
             *
             * @function DataDisplay.applyDefaults
             * @param {object} el the element we are applying defaluts for
             * @memberOf DataDisplay
             */
            dataDisplay.applyDefaults = function (el) {
                // default action is to hide the element
                $(el).hide();
                // pull the resets from the attr
                if (isNaN($(el).attr(this.settings.resetsAttr))) {
                    // pull from the dom element on first load
                    var resets = $(el).attr(this.settings.resetsAttr);
                    // apply the same holder to the resets
                    $(el).attr(this.settings.resetsAttr, $(el).attr(this.settings.condsAttr));
                } else {
                    // pull resets from the dataDisplay obj
                    var resets = this.conditions[$(el).attr(this.settings.condsAttr)]['resets'];
                }
                // apply resets as js functions against given el
                var resolve = new Function('$this', (resets ? resets : ''));
                // trigger with the given el
                resolve(el);
            };

            /**
             * this.applyConditions()<br/><br/>Apply the conditions as provided by the el
             *
             * @function DataDisplay.applyConditions
             * @param {string} conditions the conditions defined against the element
             * @param {array} fields an array of all {variables} defined in the confitions string
             * @param {object} el the element we are applying defaluts for
             * @param {object} ctx the outer element we can use as context
             * @memberOf DataDisplay
             */
            dataDisplay.applyConditions = function (conditions, fields, el, $ctx) {
                var that = this;
                    field = '',
                    fieldSelector = '',
                    fieldValue = '',
                    parseVal = '',
                    conditionalParts = [],
                    conditionalPartsSplit = [];
                // check for predefined functions by syntax (!empty, empty, length)
                for (func in that.funcs) {
                    var f = that.funcs[func];
                    var r = new RegExp(f.rgx, 'gi');
                    while ((m = r.exec(conditions)) != null) {
                        var v = f.exec(m[1], $ctx);
                        conditions = conditions.replace(new RegExp(f.rgx), v);
                    }
                }
                // for each field present in the conditions, replace its {var} with its value
                if (typeof fields == "string") {
                    fieldSelector = that.getFieldSelector(fields);
                    conditions = that.replaceFieldInCondition(fieldSelector, fields, conditions);
                } else {
                    // for each field present in the conditions, replace its {var} with its value
                    for (i = 0; i < fields.length; i++) {
                        field = fields[i];
                        fieldSelector = that.getFieldSelector(field);
                        conditions = that.replaceFieldInCondition(fieldSelector, field, conditions);
                    }
                }
                // allow for multiple side-effects in single conditions
                // ... data-display="
                //  {val} > 0; ||
                //  {val} < 1 :: $(var).css('background','#bdbdbd'); ||
                //  {val} > 1 && {val} < 2 :: $(var).css('background','#bdbdbd');
                // " ...
                conditions = conditions.replace(/\s\s+/g, ' ');
                // split the conditions into its collective parts
                var conditionalParts = conditions.split("; ||");
                // for each part of the conditions, check the condition
                for (var i = 0; i < conditionalParts.length; i++) {
                    // check for the presents of a "::" this indicates that anything following the dash should be used instead of show/hide,
                    // each statement (seperated by ';') must have only one side-effect. This is enforced via the splitting of '::' and ';'
                    var conditionalPartsSplit = conditionalParts[i].split("::");
                    // allow for default condition-met-action of showing
                    if (conditionalPartsSplit.length == 1) {
                        // allow for default condition-met-action of showing
                        that.showOnCondition(conditionalParts[i], el);
                    } else {
                        // carry out the single action as defined against the condition
                        that.funcOnCondition(conditionalPartsSplit, el);
                    }
                }
            };

            /**
             * this.replaceFieldInCondition()<br/><br/>Replace a {variable} field in a condition
             *
             * @function DataDisplay.replaceFieldInCondition
             * @param {string} fieldSelector the selector that matches the given field
             * @param {string} field the field being considered
             * @param {string} condition the condition being considered
             * @memberOf DataDisplay
             */
            dataDisplay.replaceFieldInCondition = function (fieldSelector, field, conditions) {
                var that = this;
                // replace the given field with the value of the fieldSelector in the conditions
                var fieldValue = '';
                var parseVal = '';
                // check that the given field has a value
                if (typeof $(fieldSelector + ':checked').val() !== "undefined") {
                    // first check for radio/checkbox - failover to inputs
                    fieldValue = $(fieldSelector + ':checked').val();
                } else {
                    fieldValue = $(fieldSelector).val();
                }
                // when value is present replace {var}
                if (typeof fieldValue !== 'undefined') {
                    if (isNaN(fieldValue) == true) {
                        parseVal = '\"' + encodeURIComponent(fieldValue) + '\"';
                    } else {
                        parseVal = parseFloat(fieldValue);
                    }
                    // replace the {} var place holder with real safely encoded value
                    conditions = conditions.replace(new RegExp('{' + that.escapeRegExp(field) + '}', 'g'), parseVal);
                }
                // field had been replaced throughout the entire condition list
                return conditions;
            };

            /**
             * this.showOnCondition()<br/><br/>Show the el based on condition
             *
             * @function DataDisplay.showOnCondition
             * @param {string} condition the condition being considered
             * @param {object} el the element we are applying the condition to
             * @memberOf DataDisplay
             */
            dataDisplay.showOnCondition = function (conditions, el) {
                // strip final ';' from string before invoking
                var conditions = conditions.replace(/;(\s+)?$/, '');
                // check the condition and show/hide the el
                var condition = "return (" + conditions + ");";
                if (new Function(condition)() == true) {
                    $(el).show();
                }
            };

            /**
             * this.funcOnCondition()<br/><br/>Show the el based on condition and associated functions
             *
             * @function DataDisplay.funcOnCondition
             * @param {array} conditionalParts a two part construct spliting the condition from the resolution funcs
             * @param {object} el the element we are applying the condition to
             * @memberOf DataDisplay
             */
            dataDisplay.funcOnCondition = function (conditionalParts, el) {
                // carry out the single action as defined against the condition
                for (var i = 0; i < conditionalParts.length; i++) {
                    // strip final ';' from string before invoking
                    var condition = "return (" + conditionalParts[0] + ");";
                    // when the part isnt the condition we trigger the datafunc
                    if (i > 0) {
                        var conditionalPartsSplit = conditionalParts[i].split(";");
                        // carry out the work defined in each conditional statement
                        for (var j = 0; j < conditionalPartsSplit.length; j++) {
                            // when the condition is satisified build and trigger the func
                            if (new Function(condition)() == true) {
                                // default action is to show the element - implied so that it may be fully ommitted from the condition
                                $(el).show();
                                // create the function associated with this conditionsPart
                                var outcomes = " return (" + (conditionalPartsSplit[j].length ? conditionalPartsSplit[j] : 'true') + ");";
                                // apply the dataFunc aginst the given el
                                var resolve = new Function('$this', outcomes);
                                // trigger with the given el
                                resolve(el);
                            }
                        }
                    }
                }
            };

            /**
             * this.destroy()<br/><br/>Destroy the conditions and restore the originial state
             *
             * @function DataDisplay.destroy
             * @return {object} return this to allow for the base instance to be kept and removed manually
             * @memberOf DataDisplay
             */
            dataDisplay.destroy = function (undefined) {
                // hold outer ctx;
                var that = this;
                // destory each element (as-called) individually
                $(that.el).each(function () {
                    // keep ref to the outer context to limit the inner scope
                    var $ctx = $(this);
                    // find any options.condsAttr used in the call
                    $('[' + that.settings.condsAttr + ']', $ctx).each(function () {
                        // dataDisplay objects context
                        var $this = $(this);
                        // discover the location in the global obj this dataDisplay elm sits
                        var n = $this.attr(that.settings.condsAttr);
                        // pull details from global dataDisplay back to the dom
                        var styles = that.conditions[n]['styles'];
                        var resets = that.conditions[n]['resets'];
                        var conditions = that.conditions[n]['conditions'];
                        // the fields involved in any discovered conditions
                        var fields = that.findFields(conditions);
                        // when there are fields we need to unbind the event watchers
                        if (fields.length == 0) return;
                        // for each field unbind any dataDisplay events
                        for (i = 0; i < fields.length; i++) {
                            var field = fields[i];
                            var selector = that.getFieldSelector(field);
                            $(selector, $ctx).off(that.settings.eventName);
                        }
                        // restore original attributes
                        $this
                            .attr("style", styles)
                            .attr(that.settings.condsAttr, conditions)
                            .attr(that.settings.resetsAttr, resets);
                    });
                    // remove the data attr (removes all references to dataDisplay instance)
                    $(that.el).removeData('dataDisplay');
                });
                // allow chainging on setup level methods
                return this;
            };

            // call dataDisplay.init() on new dataDisplay()
            return dataDisplay.init(el, settings, funcs);
        };
    }
));
