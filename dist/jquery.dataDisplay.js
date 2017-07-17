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
!function(factory) {
    "function" == typeof define && define.amd ? define([ "jquery" ], factory) : factory(jQuery);
}(function($) {
    var defaults = {
        eventName: ".dataDisplay",
        dataAttr: "dataDisplay",
        condsAttr: "data-display",
        resetsAttr: "data-display-resets",
        initFire: !0,
        keyEventsFire: !0
    }, funcs = {
        "!empty": {
            rgx: "\\!empty\\({([^}]+)}\\)",
            exec: function(field, ctx) {
                var str = "(";
                return $('[name*="' + field + '"]', ctx).each(function() {
                    var val = $(this).val();
                    str = "(" == str ? str + '"' + val + '" !== "" ' : str + ' && "' + val + '" !== "" ';
                }), str += ")";
            }
        },
        empty: {
            rgx: "empty\\({([^}]+)}\\)",
            exec: function(field, ctx) {
                var str = "(";
                return $('[name*="' + field + '"]', ctx).each(function() {
                    var val = $(this).val();
                    str = "(" == str ? str + '"' + val + '" == "" ' : str + ' && "' + val + '" == "" ';
                }), str += ")";
            }
        },
        length: {
            rgx: "length\\({([^}]+)}\\)",
            exec: function(field, ctx) {
                var fieldSelector = '[name*="' + field + '"]';
                if (void 0 !== $(fieldSelector + ":checked", ctx).val()) str = $(fieldSelector + ":checked", ctx).val().length; else var str = $(fieldSelector, ctx).val().length;
                return str;
            }
        },
        "is greater than or equal to": {
            rgx: "is\\sgreater\\sthan\\s(?:or\\s)?equal\\sto",
            exec: function(field, ctx) {
                return ">=";
            }
        },
        "is less than or equal to": {
            rgx: "is\\sless\\sthan\\s(?:or\\s)?equal\\sto",
            exec: function(field, ctx) {
                return "<=";
            }
        },
        "is greater than": {
            rgx: "is\\sgreater\\sthan",
            exec: function(field, ctx) {
                return ">";
            }
        },
        "is less than": {
            rgx: "is\\sless'sthan",
            exec: function(field, ctx) {
                return "<";
            }
        },
        "is equal to": {
            rgx: "is\\sequal\\sto",
            exec: function(field, ctx) {
                return "==";
            }
        }
    };
    $.fn.dataDisplay = function(options) {
        var optionsArray = "string" == typeof options ? [ options ] : options;
        if ($(this).length) {
            var settingsArray = $.extend({}, defaults, void 0 !== optionsArray ? optionsArray : []), funcsArray = $.extend({}, funcs, void 0 !== settingsArray.funcs ? settingsArray.funcs : []);
            if (void 0 === $(this).data(settingsArray.dataAttr)) instance = $(this).data(settingsArray.dataAttr, new DataDisplay(this, settingsArray, funcsArray)); else if (void 0 !== options && "destroy" == options) instance = this.data(settingsArray.dataAttr).destroy(); else if (void 0 !== options) instance = this.data(settingsArray.dataAttr).destroy().init(this, settingsArray, funcsArray); else var instance = this.data(settingsArray.dataAttr);
            $(this).data(settingsArray.dataAttr, instance);
        }
        return instance;
    };
    var DataDisplay = function(el, settings, funcs) {
        var dataDisplay = this;
        return dataDisplay.init = function(el, settings, funcs) {
            var that = this;
            return that.el = el, that.settings = settings, that.funcs = funcs, $(that.el).each(function() {
                var $ctx = $(this);
                $("[" + that.settings.condsAttr + "]", $ctx).each(function() {
                    var $this = $(this), conditions = $this.attr(that.settings.condsAttr);
                    if (isNaN(conditions)) {
                        void 0 === that.conditions && (that.conditions = []);
                        var applyDefaults = that.debounce(function(el) {
                            return that.applyDefaults(el);
                        }), applyConditions = that.debounce(function(conditions, fields, el, $ctx) {
                            return that.applyConditions(conditions, fields, el, $ctx);
                        }), styles = void 0 !== $this.attr("style") ? $this.attr("style") : "", resets = void 0 !== $this.attr(that.settings.resetsAttr) ? $this.attr(that.settings.resetsAttr) : "", n = that.conditions.length;
                        that.conditions[n] = {
                            this: $this,
                            resets: resets,
                            styles: styles,
                            conditions: conditions
                        }, $this.attr(that.settings.condsAttr, n);
                        $this.attr("name");
                        var fields = that.findFields(conditions), fireEvents = "change" + that.settings.eventName + (that.settings.keyEventsFire ? " keyup" + that.settings.eventName : "");
                        for (i = 0; i < fields.length; i++) {
                            if (0 == $(that.getFieldSelector(fields[i]), $ctx).length) return;
                            var field = fields[i], selector = that.getFieldSelector(field);
                            $(selector, $ctx).on(fireEvents, {
                                el: $this,
                                context: $ctx,
                                conditions: conditions,
                                conditionFields: fields
                            }, function(e) {
                                applyDefaults(e.data.el), applyConditions(e.data.conditions, e.data.conditionFields, e.data.el, e.data.context);
                            });
                        }
                        that.applyDefaults($this), that.settings.initFire && applyConditions(conditions, fields, $this, $ctx);
                    }
                });
            }), that;
        }, dataDisplay.debounce = function(func, threshold, execAsap) {
            var timeout;
            return function() {
                var context = this, args = arguments, callNow = execAsap && !timeout;
                clearTimeout(timeout), timeout = setTimeout(function() {
                    timeout = null, execAsap || func.apply(context, args);
                }, threshold), callNow && func.apply(context, args);
            };
        }, dataDisplay.findFields = function(conditions) {
            for (var fields = [], r = /{([^}]+)}/gi; null != (m = r.exec(conditions)); ) fields[fields.length] = m[1];
            return fields;
        }, dataDisplay.getFieldSelector = function(field) {
            return '[name*="' + field + '"]';
        }, dataDisplay.escapeRegExp = function(str) {
            return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
        }, dataDisplay.searchArray = function(array, value) {
            for (var key in array) if (array[key] == value) return key;
            return -1;
        }, dataDisplay.applyDefaults = function(el) {
            if ($(el).hide(), isNaN($(el).attr(this.settings.resetsAttr))) {
                resets = $(el).attr(this.settings.resetsAttr);
                $(el).attr(this.settings.resetsAttr, $(el).attr(this.settings.condsAttr));
            } else var resets = this.conditions[$(el).attr(this.settings.condsAttr)].resets;
            new Function("$this", resets || "")(el);
        }, dataDisplay.applyConditions = function(conditions, fields, el, $ctx) {
            var that = this;
            field = "", fieldSelector = "", fieldValue = "", parseVal = "", conditionalParts = [], 
            conditionalPartsSplit = [];
            for (func in that.funcs) for (var f = that.funcs[func], r = new RegExp(f.rgx, "gi"); null != (m = r.exec(conditions)); ) {
                var v = f.exec(m[1], $ctx);
                conditions = conditions.replace(new RegExp(f.rgx), v);
            }
            if ("string" == typeof fields) fieldSelector = that.getFieldSelector(fields), conditions = that.replaceFieldInCondition(fieldSelector, fields, conditions); else for (i = 0; i < fields.length; i++) field = fields[i], 
            fieldSelector = that.getFieldSelector(field), conditions = that.replaceFieldInCondition(fieldSelector, field, conditions);
            for (var conditionalParts = (conditions = conditions.replace(/\s\s+/g, " ")).split("; ||"), i = 0; i < conditionalParts.length; i++) {
                var conditionalPartsSplit = conditionalParts[i].split("::");
                1 == conditionalPartsSplit.length ? that.showOnCondition(conditionalParts[i], el) : that.funcOnCondition(conditionalPartsSplit, el);
            }
        }, dataDisplay.replaceFieldInCondition = function(fieldSelector, field, conditions) {
            var that = this, fieldValue = "", parseVal = "";
            return void 0 !== (fieldValue = void 0 !== $(fieldSelector + ":checked").val() ? $(fieldSelector + ":checked").val() : $(fieldSelector).val()) && (parseVal = 1 == isNaN(fieldValue) ? '"' + encodeURIComponent(fieldValue) + '"' : parseFloat(fieldValue), 
            conditions = conditions.replace(new RegExp("{" + that.escapeRegExp(field) + "}", "g"), parseVal)), 
            conditions;
        }, dataDisplay.showOnCondition = function(conditions, el) {
            var condition = "return (" + (conditions = conditions.replace(/;(\s+)?$/, "")) + ");";
            1 == new Function(condition)() && $(el).show();
        }, dataDisplay.funcOnCondition = function(conditionalParts, el) {
            for (var i = 0; i < conditionalParts.length; i++) {
                var condition = "return (" + conditionalParts[0] + ");";
                if (i > 0) for (var conditionalPartsSplit = conditionalParts[i].split(";"), j = 0; j < conditionalPartsSplit.length; j++) if (1 == new Function(condition)()) {
                    $(el).show();
                    var outcomes = " return (" + (conditionalPartsSplit[j].length ? conditionalPartsSplit[j] : "true") + ");";
                    new Function("$this", outcomes)(el);
                }
            }
        }, dataDisplay.destroy = function(undefined) {
            var that = this;
            return $(that.el).each(function() {
                var $ctx = $(this);
                $("[" + that.settings.condsAttr + "]", $ctx).each(function() {
                    var $this = $(this), n = $this.attr(that.settings.condsAttr), styles = that.conditions[n].styles, resets = that.conditions[n].resets, conditions = that.conditions[n].conditions, fields = that.findFields(conditions);
                    if (0 != fields.length) {
                        for (i = 0; i < fields.length; i++) {
                            var field = fields[i], selector = that.getFieldSelector(field);
                            $(selector, $ctx).off(that.settings.eventName);
                        }
                        $this.attr("style", styles).attr(that.settings.condsAttr, conditions).attr(that.settings.resetsAttr, resets);
                    }
                }), $(that.el).removeData("dataDisplay");
            }), this;
        }, dataDisplay.init(el, settings, funcs);
    };
});