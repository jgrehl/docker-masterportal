[TOC]

# Code
### Allgemein
* Alle Dokumente werden in utf-8 gespeichert
* Jedes Dokument wird mit einer leeren Zeile beendet
* [***EditorConfig***](http://editorconfig.org/), [***JSCS***](http://jscs.info/) und [***JSHint***](http://jshint.com/docs/options) werden eingesetzt, um die Konventionen leichter einhalten zu können

### Whitespace
* Soft Intends (Spaces) statt Tabs
* Vier Spaces repräsentieren einen Tab
* Die Größe der Einrückung beträgt vier Spaces (1 Tab)
* Keine Whitespaces am Ender der Zeile
* Keine leeren "Whitespace Zeilen"

### JavaScript
##### Leerzeichen, geschweifte Klammern und Zeilenumbrüche

* Strings die zu lang werden, werden mit in mehrere Zeilen geschrieben und mit "+" verbunden.

"so ja" Beispiel:
```javascript
    console.log("Dies ist ein besonders langer String " +
                "Länge" + this.getStringLength() + " Zeichen, " +
                "deswegen sollte der String nicht komplett in eine Zeile " +
                "geschrieben werden");

```

* *if / else / for / while / try* enthalten immer Leerzeichen, geschweifte Klammern und erstrecken sich über mehrere Zeilen
* keine leeren Blöcke

"so nicht" Beispiele:
```javascript
if(Bedingung) machWas();

while(Bedingung) iterieren++;

for(var i=0;i<100;i++) machWas();
```

"so ja" Beispiele:
```javascript
if (Bedingung) {
    // statements
}
else {
    // statements
}

while (Bedingung) {
    // statements
}

for (var i = 0; i < 100; i++) {
    // statements
}
```

#### Zuweisungen, Deklarationen, Funktionen
* Nur einmal "var" pro Scope (Funktion) verwenden
```javascript
// so nicht
var foo = "";
var bar = "";
var foobar;
// sondern so
var foo = "",
      bar = "",
      foobar;
```
* "var" am Anfang der Funktion definieren
* Eine Funktion erfüllt genau eine Aufgabe
* Object und Array ohne new Operator erzeugen
* Definierte Variable, Parameter oder Funktionen die nicht genutzt werden vermeiden

"so nicht" Beispiele:
```javascript
var car = new Object();
car.goes = "far";
var cars = new Array();
```
"so ja" Beispiele:
```javascript
var car = {goes:"far"};
var cars = [];
```

#### Typprüfung
* Zur Typprüfung wird Underscore JS eingesetzt

String:
```
_.isString(variable)
```
Number:
```
_.isNumber(variable)
```
Boolean:
```
_.isBoolean(variable)
```
Object:
```
_.isObject(variable)
```
Array:
```
_.isArray(variable)
```
null:
```
_.isNull(variable)
```
undefined:
```
_.isUndefined(variable)
```
undefined im Template:
```
typeof variable !== "undefined"
```
#### Auswertungen
* Vergleiche mit **"==="** und **"!=="** anstatt mit **"=="** und **"!="**

Ob ein Array eine Länge hat:
```
if ( array.length ) ...
```
Ob ein Array leer ist:
```
if ( !array.length ) ...
```
Ob ein String nich leer ist:
```
if ( string ) ...
```
Ob ein String leer ist:
```
if ( !string ) ...
```

#### Bezeichnungen
* Sprechende Namen für Variablen und Funktionen verwenden
* camelCase für Funktions- und var- Deklarationen
* Wenn es die String-Variable "dog" gibt, ist "dogList" ein Array bestehend aus "dog" Strings
* Bezeichnung für Konstanten --> SYMBOLIC_CONSTANTS_LIKE_THIS

#### Anführungszeichen
* Es werden doppelte Anführungszeichen eingesetzt
* Beim Einsatz von inneren und äußeren Anführungszeichen, doppelte Anführungszeichen außen und einfache Anführungszeichen innen
```javascript
var html = "<div id='my-id'></div>";
```

#### Kommentare
* Mehrzeilige Kommentare sind gut
* Kommentare am Zeilenende sind untersagt
* JSDoc Style Kommentare werden für Funktionen benutzt.

#### Backbone spezifische Konventionen
* "listenTo" anstatt "on" als Eventlistener
* Die initialize-Funktion ist die erste Funktion in den Backbone-Objekten
* Die render-Funktion ist in jeder View die zweite Funktion
* Die Logik wird im Model programmiert(Controller)

#### Require

Der syntaktische Zucker (http://requirejs.org/docs/whyamd.html#sugar) wird verwendet:

"so nicht" Beispiele:
```javascript
define("app",
    [
    "config",
    "modules/core/util",
    "modules/core/rawLayerList",
    .
    .
    .
], function (Config, Util, RawLayerList, ...) {

````
"so ja" Beispiele:
```javascript
define(function (require) {
    var Backbone = require("backbone"),
        Radio = require("backbone.radio"),
        .
        .
        .
```
#### Sonstiges
* Comma-First-Formatierung ist verboten
* So wenig globale Variablen wie möglich

### EditorConfig
```ini
root = true

[*]
indent_style = space
indent_size = 4
end_of_line = crlf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true
```

### JSHintConfig
```ini
{
    "asi": true,
    "bitwise": true,
    "boss": true,
    "browser": true,
    "curly": true,
    "debug" : false,
    "devel": true,
    "eqeqeq": true,
    "eqnull": true,
    "es3": true,
    "es5": false,
    "esnext": true,
    "evil": true,
    "expr": true,
    "forin": true,
    "immed": true,
    "indent": 4,
    "iterator": true,
    "jquery": true,
    "lastsemic": true,
    "latedef": true,
    "laxbreak": true,
    "laxcomma": true,
    "loopfunc": true,
    "maxerr": 80,
    "multistr": true,
    "newcap": true,
    "noarg": true,
    "noempty": true,
    "nonstandard": true,
    "onecase": true,
    "proto": true,
    "quotmark": "double",
    "regexdash": true,
    "regexp": true,
    "scripturl": true,
    "shadow": true,
    "smarttabs": true,
    "sub": true,
    "supernew": true,
    "trailing": true,
    "undef": true,
    "unused": true,
    "validthis": true,
    "white": true,
    "withstmt": true,
    "wsh": true,
    "predef": [
        "define",
        "require"
    ]
}
```
Eslint-Config:

```ini
{
  "rules": {
    "no-empty": [
      1,
      {
        "allowEmptyCatch": true
      }
    ],
    "no-mixed-spaces-and-tabs": 1,
    "no-multiple-empty-lines": 1,
    "no-multi-spaces": 1,
    "key-spacing": [
      1,
      {
        "beforeColon": false,
        "afterColon": true
      }
    ],
    "space-unary-ops": [
      1,
      {
        "words": false,
        "nonwords": false
      }
    ],
    "array-bracket-spacing": [
      1,
      "never",
      {
        "arraysInArrays": true
      }
    ],
    "space-in-parens": [
      1,
      "never"
    ],
    "comma-dangle": [
      1,
      "never"
    ],
    "no-trailing-spaces": 1,
    "comma-style": [
      1,
      "last"
    ],
    "curly": [
      1,
      "all"
    ],
    "dot-notation": 1,
    "brace-style": [
      1,
      "stroustrup",
      {
        "allowSingleLine": true
      }
    ],
    "one-var": [
      1,
      "always"
    ],
    "operator-linebreak": [
      1,
      "after"
    ],
    "newline-after-var": [
      1,
      "always"
    ],
    "semi": [
      1,
      "always"
    ],
    "space-infix-ops": 1,
    "keyword-spacing": [
      1,
      {}
    ],
    "spaced-comment": [
      1,
      "always"
    ],
    "space-before-blocks": [
      1,
      "always"
    ],
    "space-before-function-paren": [
      1,
      "always"
    ],
    "linebreak-style": [
      off,
      "windows"
    ],
    "quotes": [
      1,
      "double"
    ]
  }
}
```

### CSS
* CSS-Code gehört nur in CSS-Dateien und in keine HTML-Dokumente
* Keine ID-Selektoren verwenden
* !improtant vermeiden
* Nach dem Selektor gehört ein Leerzeichen
* Regeln einrücken und über mehrere Zeilen und nicht in einer schreiben

"so nicht" Beispiel:
```css
.btn-panel-submit{background-color: #e6e6e6; border-color: #ccc; color: #333;}
```

"so ja" Beispiel:
```css
.btn-panel-submit {
    background-color: #e6e6e6;
    border-color: #ccc;
    color: #333;
}
```

# Branchworkflow
![Branchworkflow](/img/branchworkflow.jpg)


Portale werden nur auf dem stable-branch (hier Master) gebaut. Bei neuen Portalen oder Änderungen an bestehenden,
wird dem Commit das Verb config vorangestellt (z.B. git commit -m "config FHH-Atlas Druckdienst entfernt"). Andere Commits sind auf dem stable-branch nicht erlaubt.
# Git
## Commit
* Committe früh und oft
* Ein Commit repräsentiert eine Idee oder eine Änderung
* Nutze Verben für die Commits **(add/remove/update/refactor/fix/config/hotfix)**
* Es dürfen keine console.log Statements in den Commits vorhanden sein
* Die einzigen zugelassen Commits auf dem stable-Branch sind "hotfix-Commits"

## Branches
* Bei aufwändigeren Neuentwicklungen werden Branches angelegt. Dies soll bei allen zeitaufwändigeren oder komplexeren und nicht zeitkritischen Aktualisierungen beachtet werden. Lediglich wichtige Fixes können zeitnah direkt ins master gespielt werden.
* Bezeichnung der Branches: #43_add_GFI oder 56_update_draw (IssueNummer_Verb_Modul)
* Nutze Verben für die Merge-Commits **(add/remove/update/refactor/fix/config/hotfix)**. Die Merging-Commit-Messages sollen deutsch und sprechend sein. Die "add"- und "fix"-Messages der Merges fließen bei neuen Stable-Versionen in die CHANGELOG.md! "hotfix"-Messages fließen ebenso in die CHANGELOG.md, wenn minor-updates gemacht werden.
* Branches werden nach dem Mergen gelöscht

## Pushen
* Die Commits werden mit thematisch umschließenden Pushes ins Repository geschrieben, wobei es nicht Ziel ist, ganze Features in einem Push zu umschließen, sondern Tätigkeiten. Mit der lokalen Entwicklungsumgebung ist eine tägliche Sicherung ins Repository empfehlenswert um Datenverlust zu verhindern.

## Pullrequests
* Die in Branches abgelegten Commits werden vorm mergen in Pullrequests dem restlichen (verfügbaren) Team zum reviewen angeboten. Diese werden gebeten, möglichst zeitnah einen Blick auf den Code zu werfen, um evtl. Schwachstellen aufzudecken. Es ist nicht notwendig, den Code hinsichtlich seiner Funktionsfähigkeit zu untersuchen. Fehler können dann im Code oder im Pullrequest kommentiert werden. Es reicht bereits ein accept aus, um den Pullrequest in dev zu mergen.

### Accept
* Werden keine produktionsverhindernden Gründe gefunden, soll der Pullrequest baldmöglichst accepted werden.

### Decline
* Im Falle von produktionsverhindernden Gründen wird der Pullrequest declined. Damit kann er in Bitbucket nicht mehr accepted werden und ein neuer Pullrequest muss nach Behebung der Fehler gestellt werden. Der requestor wird über die Gründe informiert.
