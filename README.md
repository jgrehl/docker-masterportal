# Masterportal

The Masterportal is a tool-kit to create geo web applications based on [OpenLayers](https://openlayers.org), [Vue.js](https://vuejs.org/) and [Backbone.js](https://backbonejs.org). The Masterportal is Open Source Software published under the [MIT License](https://bitbucket.org/geowerkstatt-hamburg/masterportal/src/dev/License.txt).

The Masterportal is a project by [Geowerkstatt Hamburg](https://www.hamburg.de/geowerkstatt/).

## MasterPortal 3.0.0-beta

After more than two years of refactorings we can proudly present the first beta-version of Masterportal 3.0.0! We completely removed backbonejs and jquery, moved to vue3 and vuex4 and rewrote the application-core. We redesigned the UI to match all the different usecases and usergroups. We have nearly all modules and tools working but still
some work to do. Features still to be added/moved to the new version are the following:

* Draw Module
* Different AddOns
* Theming
* Touchtable-UI
* Performance
* etc.

To try out the new version just checkout this tag and run "npm start". You'll find working configs under "portal" as usual.

Please be aware of the following:

**Structure of config.json can still be changing, docs may not be up-to-date.**
**Changelog is wip and may also not be correct.**
**We appreciate hints, feedback and communication of bugs! Please use the Issuetracker and tag your issue with "v3.0.0-beta1"**

Our further Roadmap is to work hard on 3.0.0 and to release wip-Versions, rcs etc. and hopefully to be able to have a stable Version in the beginning of 2024. We will support and fix bugs for V2.x until end of 2023.


## User section

* [Download](https://bitbucket.org/geowerkstatt-hamburg/masterportal/downloads/)
* [Quick start for users](https://bitbucket.org/geowerkstatt-hamburg/masterportal/src/dev/doc/setup.md)
* [Remote interface](https://bitbucket.org/geowerkstatt-hamburg/masterportal/src/dev/doc/remoteInterface.md)
* [User documentation](https://bitbucket.org/geowerkstatt-hamburg/masterportal/src/dev/doc/doc.md)
* [User documentation online](https://www.masterportal.org/dokumentation.html)
* [Community board (User forum and issue tracker)](https://trello.com/c/qajdXkMa/110-willkommen)

## Developer section
### Community
* [Community board (Developer forum and issue tracker)](https://trello.com/c/qajdXkMa/110-willkommen)
### Contributing
* Contributors to the Masterportal are expected to act respectfully toward others in accordance with the [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md) for open source projects.
* Follow our [Developer documentation](doc/devdoc.md)
* First steps in the code: [Tutorial 01: Creating a new module (Scale switcher)](https://bitbucket.org/geowerkstatt-hamburg/masterportal/src/dev/doc/vueTutorial.md)

#### Pull requests
* Your pull request must have:
    * An understandable detailed description
    * If necessary a test portal or test configurations
    * A changelog entry
    * A PrePushHook with no errors
    * Hints if your contribution contains adopted external code
    * Unit tests for new functions or updated tests for bugfixes

#### Contributor License Agreement
* Your contribution will be under [MIT License](https://bitbucket.org/geowerkstatt-hamburg/masterportal/raw/5e7faf83734509a15438805790d3b434428b35fc/License.txt)


[![Sauce Test Status](https://app.eu-central-1.saucelabs.com/buildstatus/geodatenanwendungen_gv.hamburg.de)](https://app.eu-central-1.saucelabs.com/builds/dfd7abc54af1493091fbeef1b6b48ca6)
