# [jquery.dataDisplay](https://github.com/assetinfo/jquery.dataDisplay)         [![Build Status](https://travis-ci.org/assetinfo/jquery.dataDisplay.png)](https://travis-ci.org/assetinfo/jquery.dataDisplay)

   >jquery.dataDisplay.js aids the developer in writing concise conditions against elements within a form based setting, in order to control the display of elements based on the state of a form.

--------

## Demo

* [Demo on jsfiddle](https://jsfiddle.net/graydixon/tchmmn27/).

## Initialising a form with conditionally displayed elements

* A dataDisplay instance is initialised against a div which contains at least one element that has data-display tags:

    * HTML
    ```HTML
    ...
        <div id="container">
            <input name="inputTest" type="value">
            <div class="dataDisplay" data-display="{inputTest} == 'testing';"
                <a>Test</a>
            </div>
        </div>
    ...
    ```

    * Javascript
    ```javascript
    ...
        var dataDisplay = $('#container').dataDisplay({...options...});
    ...
    ```

    * Options
    ```javascript
    ...
        // provide an array of func methods to extend the built-in helper methods
        funcs: {},
        // name to bind the events against
        eventName: '.dataDisplay',
        // data-attribute to bind DataDisplay instance against (against the $el)
        dataAttr: 'dataDisplay',
        // attribute holding the conditions on first-load
        condsAttr: 'data-display',
        // attribute holding resets on first load (defined as jquery statements against $this)
        resetsAttr: 'data-display-resets',
        // should the plugin fire during the setup phase?
        initFire: true,
        // should the plugin fire on key events?
        keyEventsFire: true
    ...
    ```

## Documentation

* [jquery.dataDisplay's documentation](https://assetinfo.github.io/jquery.dataDisplay/docs/jquery.dataDisplay.html) has been generated using [jsDocs 3.5.3](https://github.com/jsdoc3/jsdoc)

## Installing, building and testing

1. [Download](https://github.com/assetinfo/jquery.dataDisplay/archive/master.zip) or clone this repo...
   ```
   $ git clone git@github.com:assetinfo/jquery.dataDisplay.git
   ```

2. Navigate to the directory containing jquery.dataDisplay and run...

   ```
   $ npm install
   ```

3. Followed by...

   ```
   $ bower install
   ```

4. Then to build run...

   ```
   $ grunt
   ```

5. And to test run...

   ```
   $ grunt test
   ```

6. To use in your own project...

   * include dependencies and minified version of jquery.dataDisplay.js

   ```HTML
   <link rel="stylesheet" href="./src/css/jquery.dataDisplay.css"/>
   <script src="./bower_components/jquery/dist/jquery.js"></script>
   <script src="./dist/jquery.dataDisplay.min.js"></script>
   ```

   * or include the optimised versions from ./dist/:

   ```HTML
   <link rel="stylesheet" href="./dist/jquery.dataDisplay.optimised.css"/>
   <script src="./dist/jquery.dataDisplay.optimised.js"></script>
   ```

   * alternatively, [require](http://requirejs.org/) jquery.dataDisplay in a [module](https://github.com/assetinfo/jquery.dataDisplay/blob/master/main.js) with the following in your config file...

   ```javascript
   require.config({
       "deps": ["main"],
       "paths": {
           "jquery": "bower_components/jquery/dist/jquery",
           "dataDisplay": "src/js/jquery.dataDisplay"
       },
       "shim": {
           "jquery": { "exports": "$" }
       }
   });
   ```

## Built-in helper methods:

* !empty() - check if a variable is NOT empty

```HTML
...
   data-display="!empty({inputTest});"
...
```

* empty() - check if a variable is empty

```HTML
...
   data-display="empty({inputTest});"
...
```

* length() - check the length of a variable

```HTML
...
   data-display="length({inputTest}) > 6;"
...
```

* is greater than or equal to - check that a variable is greater than or equal to the criteria

```HTML
...
   data-display="{inputTest} is greater than or equal to 6;"
...
```

* is less than or equal to - check that a variable is less than or equal to the criteria

```HTML
...
   data-display="{inputTest} is less than or equal to 6;"
...
```

* is greater than - check that a variable is greater than the criteria

```HTML
...
   data-display="{inputTest} is greater than 6;"
...
```

* is less than - check that a variable is less than the criteria

```HTML
...
   data-display="{inputTest} is less than 6;"
...
```

* is equal to - check that a variable is == to the criteria

```HTML
...
   data-display="{inputTest} is equal to 6;"
...
```

#### Extending the helper methods object:

* The helper methods may be extended by providing an array of helpers in the options provided to $.fn.dataDisplay at init...

```javascript
...
   $('#container').dataDisplay({
       'funcs': {
           'sum': {
               rgx: 'sum\\({([^}]+)}\\)',
               exec: function (field, ctx) {

                   ... sum all values against the given field ...

                   return str;
               }
           }
       }
   });
...
```

## Writing conditions and statements

<!-- allow for multiple side-effects in single conditions
 ... data-display="
  {val} > 0; &#124;&#124;
  {val} < 1 :: $(var).css('background','#bdbdbd'); &#124;&#124;
  {val} > 1 && {val} < 2 :: $(var).css('background','#bdbdbd');
 " ...
 -->
#### Syntax

* A condition consists of {variables}, helper method calls (eg length()) and side-affects (any statements following a '::' after a condition (optional)).

```HTML
...
    data-display="length({inputTest}) is greater than 6 ::
        $this.css('background', '#000');"
...
```

* Any side-affects should be defined after the condition, separated by a double-colon (::).<br/>
Each condition may hold one or more side-affects where each side-affect is separated by a semicolon ';'.</br>
Each side-affect should be a jQuery function (.css, .data, .scrollTop... etc), the element is passed to the execution scope as $this ($this.css(...), $this.data(...), $this.scrollTop(...)... etc).

```HTML
...
    data-display="length({inputTest}) is greater than 6 ::
        $this.css('background', '#000'); $this.css('font-size', '16px');"
...
```

* The data-display-resets attribute should undo any actions performed by the data-display condition(s).

```HTML
...
    data-display="length({inputTest}) is greater than 6 ::
        $this.css('background', '#000');"
    data-display-resets="$this.css('background', '#fff');"
...
```
* Conditions may be grouped in brackets ({condition} == "value" &#124;&#124; {condition} == "value2")
```HTML
...
    data-display="(length({inputTest}) is greater than 6 && length({inputTest}) is less than 12) ::
        $this.css('background', '#000');"
    data-display-resets="$this.css('background', '#fff');"
...
```

* If the condition does not define any side-affects, then it will instead control the display state (display: block) - the reverse action (\*-resets) is implied.

```HTML
...
    data-display="(length({inputTest}) is greater than 6 && length({inputTest}) is less than 12);"
...
```

* Multiple conditions may be defined against the same data-display attr by separating each condition with a double pipe (&#124;&#124;)

```HTML
...
    data-display="
        length({inputTest}) is greater than 6 ::
            $this.css('background', '#000'); &#124;&#124;
        length({inputTest}) is greater than 12 ::
            $this.css('background', '#ddd');"
    data-display-resets="$this.css('background', '#fff');"
...
```

## License
  * [Licensed](https://github.com/assetinfo/jquery.dataDisplay/blob/master/LICENSE) under the MIT License (MIT).

## Contact us
 * [Contact us](mailto:gdixon@assetinfo.co.uk?Subject=jQuery.dataDisplay%20Enquiry...) if you need any further information or guidance (email: gdixon@assetinfo.co.uk).