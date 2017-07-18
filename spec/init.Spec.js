describe("Initialise a dataDisplay div with a single condition (based on the state of a text input).", function() {
    beforeEach(function() {
        // append the basic element and coditions to the body
        $('body').append('<div id="container"><input name="inputTest" type="value"/><div class="dataDisplay" data-display="{inputTest} == \'testing\' :: $this.show();"><a>Test</a></div></div>');
        // initiate against the #container element
        $('#container').dataDisplay();
    });
    it("assert that the dataDisplay instance has been added", function() {
        // init is a function if a dataDisplay instance is discovered
        expect((typeof $('#container').dataDisplay().init === "function")).toBe(true);
    });
    it("element will be hidden if the data-display-resets have been called", function() {
        // defined to only reset the state of .dataDisplay element
        expect(($('.dataDisplay').css("display") == "none")).toBe(true);
    });
    it("change inputTest to 'testing' which will trigger the .dataDisplay element to show", function(done) {
        // change the value on the input which should change the display state on the dataDisplay element
        $('[name="inputTest"]').val("testing");
        // the input changing is debounced so test needs to timeout to catch the change
        waitsForAndRuns(function() {
            // wait for the div to be visible
            return ($('.dataDisplay').css("display") == "block");
        }, function() {
            // expect the conditionally display div to be visible
            expect(($('.dataDisplay').css("display") == "block")).toBe(true);
            // end the test
            done();
        });
    });
});
