describe("Initialise a dataDisplay div with a single condition (based on the state of a text input).", function() {
    beforeEach(function() {
        // append the basic element and coditions to the body
        $('body').append('<div id="test1"><input name="inputTest" type="value"/><div class="dataDisplay" data-display="{inputTest} == \'testing\' :: $this.show();"><a>Test</a></div></div>');
        // initiate against the #container element
        $('#test1').dataDisplay();
    });
    
    it("assert that the dataDisplay instance has been added", function() {
        // init is a function if a dataDisplay instance is discovered
        expect((typeof $('#test1').dataDisplay().init === "function")).toBe(true);
    });

    it("element will be hidden if the data-display-resets have been called", function() {
        // defined to only reset the state of .dataDisplay element
        expect(($('.dataDisplay', $('#test1')).css("display") == "none")).toBe(true);
    });

    it("change inputTest to 'test' which will cause the .dataDisplay element to remain hidden", function(done) {
        // change the value on the input which should change the display state on the dataDisplay element
        $('[name="inputTest"]', $('#test1')).val("test").trigger("change");;
        // the input changing is debounced so test needs to timeout to catch the change
        waitsForAndRuns(function() {
            // wait for the div to be visible
            return ($('.dataDisplay', $('#test1')).css("display") == "none");
        }, function() {
            // expect the conditionally display div to be visible
            expect(($('.dataDisplay', $('#test1')).css("display") == "none")).toBe(true);
            // end the test
            done();
        });
    });

    it("change inputTest to 'testing' which will trigger the .dataDisplay element to show", function(done) {
        // change the value on the input which should change the display state on the dataDisplay element
        $('[name="inputTest"]', $('#test1')).val("testing").trigger("change");
        // the input changing is debounced so test needs to timeout to catch the change
        waitsForAndRuns(function() {
            // wait for the div to be visible
            return ($('.dataDisplay', $('#test1')).css("display") == "block");
        }, function() {
            // expect the conditionally display div to be visible
            expect(($('.dataDisplay', $('#test1')).css("display") == "block")).toBe(true);
            // end the test
            done();
        });
    });
});

describe("Initialise a dataDisplay div with multiple condition (based on the state of a text input).", function() {
    beforeEach(function() {
        // append the basic element and coditions to the body
        $('body').append('<div id="test2"><input name="inputTest" type="value"/><div class="dataDisplay" data-display="{inputTest} == \'testing\' :: $this.show(); || {inputTest} == \'test\' :: $this.show();"><a>Test</a></div></div>');
        // initiate against the #container element
        $('#test2').dataDisplay();
    });

    it("element will be hidden if the data-display-resets have been called", function() {
        // defined to only reset the state of .dataDisplay element
        expect(($('.dataDisplay', $('#test2')).css("display") == "none")).toBe(true);
    });

    it("change inputTest to 'tes' which will cause the .dataDisplay element remain hidden", function(done) {
        // change the value on the input which should change the display state on the dataDisplay element
        $('[name="inputTest"]', $('#test2')).val("tes").trigger("change");;
        // the input changing is debounced so test needs to timeout to catch the change
        waitsForAndRuns(function() {
            // wait for the div to be visible
            return ($('.dataDisplay', $('#test2')).css("display") == "none");
        }, function() {
            // expect the conditionally display div to be hidden
            expect(($('.dataDisplay', $('#test2')).css("display") == "none")).toBe(true);
            // end the test
            done();
        });
    });

    it("change inputTest to 'test' which will trigger the .dataDisplay element to show", function(done) {
        // change the value on the input which should change the display state on the dataDisplay element
        $('[name="inputTest"]', $('#test2')).val("test").trigger("change");;
        // the input changing is debounced so test needs to timeout to catch the change
        waitsForAndRuns(function() {
            // wait for the div to be visible
            return ($('.dataDisplay', $('#test2')).css("display") == "block");
        }, function() {
            // expect the conditionally display div to be visible
            expect(($('.dataDisplay', $('#test2')).css("display") == "block")).toBe(true);
            // end the test
            done();
        });
    });

    it("change inputTest to 'testing' which will trigger the .dataDisplay element to show", function(done) {
        // change the value on the input which should change the display state on the dataDisplay element
        $('[name="inputTest"]', $('#test2')).val("testing").trigger("change");;
        // the input changing is debounced so test needs to timeout to catch the change
        waitsForAndRuns(function() {
            // wait for the div to be visible
            return ($('.dataDisplay', $('#test2')).css("display") == "block");
        }, function() {
            // expect the conditionally display div to be visible
            expect(($('.dataDisplay', $('#test2')).css("display") == "block")).toBe(true);
            // end the test
            done();
        });
    });
});

describe("Initialise a dataDisplay div with a single condition and multiple side-affect statements (based on the state of a text input).", function() {
    beforeEach(function() {
        // append the basic element and coditions to the body
        $('body').append('<div id="test3"><input name="inputTest" type="value"/><div class="dataDisplay" data-display="{inputTest} == \'testing\' :: $this.css(\'color\', \'rgb(0, 0, 255)\'); $this.attr(\'dataDisplayState\', \'true\');" data-display-resets="$this.css(\'color\', \'rgb(0, 0, 0)\'); $this.attr(\'dataDisplayState\', \'false\');"><a>Test</a></div></div>');
        // initiate against the #container element
        $('#test3').dataDisplay();
    });

    it("assert that the dataDisplay instance has been added", function() {
        // init is a function if a dataDisplay instance is discovered
        expect((typeof $('#test3').dataDisplay().init === "function")).toBe(true);
    });

    it("element will be hidden if the data-display-resets have been called", function() {
        // defined to only reset the state of .dataDisplay element
        expect(($('.dataDisplay', $('#test3')).css("display") == "none")).toBe(true);
        expect(($('.dataDisplay', $('#test3')).css("color") == "rgb(0, 0, 0)")).toBe(true);
        expect(($('.dataDisplay', $('#test3')).attr("dataDisplayState") == "false")).toBe(true);
    });

    it("change inputTest to 'test' which will cause the .dataDisplay element to remain hidden", function(done) {
        // change the value on the input which should change the display state on the dataDisplay element
        $('[name="inputTest"]', $('#test3')).val("test").trigger("change");;
        // the input changing is debounced so test needs to timeout to catch the change
        waitsForAndRuns(function() {
            // wait for the div to be visible
            return ($('.dataDisplay', $('#test3')).css("display") == "none");
        }, function() {
            // expect the conditionally display div to be visible
            expect(($('.dataDisplay', $('#test3')).css("display") == "none")).toBe(true);
            expect(($('.dataDisplay', $('#test3')).css("color") == "rgb(0, 0, 0)")).toBe(true);
            expect(($('.dataDisplay', $('#test3')).attr("dataDisplayState") == "false")).toBe(true);
            // end the test
            done();
        });
    });

    it("change inputTest to 'testing' which will trigger the .dataDisplay element to show", function(done) {
        // change the value on the input which should change the display state on the dataDisplay element
        $('[name="inputTest"]', $('#test3')).val("testing").trigger("change");
        // the input changing is debounced so test needs to timeout to catch the change
        waitsForAndRuns(function() {
            // wait for the div to be visible
            return ($('.dataDisplay', $('#test3')).css("display") == "block");
        }, function() {
            // expect the conditionally display div to be visible
            expect(($('.dataDisplay', $('#test3')).css("display") == "block")).toBe(true);
            expect(($('.dataDisplay', $('#test3')).css("color") == "rgb(0, 0, 255)")).toBe(true);
            expect(($('.dataDisplay', $('#test3')).attr("dataDisplayState") == "true")).toBe(true);
            // end the test
            done();
        });
    });
});

describe("Initialise a dataDisplay div with multiple conditions and multiple side-affect statements (based on the state of a text input).", function() {
    beforeEach(function() {
        // append the basic element and coditions to the body
        $('body').append('<div id="test4"><input name="inputTest" type="value"/><div class="dataDisplay" data-display="{inputTest} == \'testing\' :: $this.css(\'color\', \'rgb(0, 0, 255)\'); $this.attr(\'dataDisplayState\', \'true\'); || {inputTest} == \'test\' :: $this.css(\'color\', \'rgb(255, 0, 0)\'); $this.attr(\'dataDisplayState\', \'true\');" data-display-resets="$this.css(\'color\', \'rgb(0, 0, 0)\'); $this.attr(\'dataDisplayState\', \'false\');"><a>Test</a></div></div>');
        // initiate against the #container element
        $('#test4').dataDisplay();
    });

    it("element will be hidden if the data-display-resets have been called", function() {
        // defined to only reset the state of .dataDisplay element
        expect(($('.dataDisplay', $('#test4')).css("display") == "none")).toBe(true);
    });

    it("change inputTest to 'tes' which will cause the .dataDisplay element remain hidden", function(done) {
        // change the value on the input which should change the display state on the dataDisplay element
        $('[name="inputTest"]', $('#test4')).val("tes").trigger("change");;
        // the input changing is debounced so test needs to timeout to catch the change
        waitsForAndRuns(function() {
            // wait for the div to be visible
            return ($('.dataDisplay', $('#test4')).css("display") == "none");
        }, function() {
            // expect the conditionally display div to be hidden
            expect(($('.dataDisplay', $('#test4')).css("display") == "none")).toBe(true);
            expect(($('.dataDisplay', $('#test4')).css("color") == "rgb(0, 0, 0)")).toBe(true);
            expect(($('.dataDisplay', $('#test4')).attr("dataDisplayState") == "false")).toBe(true);
            // end the test
            done();
        });
    });

    it("change inputTest to 'test' which will trigger the .dataDisplay element to show", function(done) {
        // change the value on the input which should change the display state on the dataDisplay element
        $('[name="inputTest"]', $('#test4')).val("test").trigger("change");;
        // the input changing is debounced so test needs to timeout to catch the change
        waitsForAndRuns(function() {
            // wait for the div to be visible
            return ($('.dataDisplay', $('#test4')).css("display") == "block");
        }, function() {
            // expect the conditionally display div to be visible
            expect(($('.dataDisplay', $('#test4')).css("display") == "block")).toBe(true);
            expect(($('.dataDisplay', $('#test4')).css("color") == "rgb(255, 0, 0)")).toBe(true);
            expect(($('.dataDisplay', $('#test4')).attr("dataDisplayState") == "true")).toBe(true);
            // end the test
            done();
        });
    });

    it("change inputTest to 'testing' which will trigger the .dataDisplay element to show", function(done) {
        // change the value on the input which should change the display state on the dataDisplay element
        $('[name="inputTest"]', $('#test4')).val("testing").trigger("change");;
        // the input changing is debounced so test needs to timeout to catch the change
        waitsForAndRuns(function() {
            // wait for the div to be visible
            return ($('.dataDisplay', $('#test4')).css("display") == "block");
        }, function() {
            // expect the conditionally display div to be visible
            expect(($('.dataDisplay', $('#test4')).css("display") == "block")).toBe(true);
            expect(($('.dataDisplay', $('#test4')).css("color") == "rgb(0, 0, 255)")).toBe(true);
            expect(($('.dataDisplay', $('#test4')).attr("dataDisplayState") == "true")).toBe(true);
            // end the test
            done();
        });
    });
});
