const  {PORTALCONFIG} = require("./constants");




module.exports =function createMainMenu(data, configJS, convertedTools, convertedMenuEntries) {
    console.log("mainMenu");
    const mainMenu = {
        expanded: true,
        sections: [[]]
    };

    addTitle(data, mainMenu);
    addSearchbar(data, mainMenu);
    fillMainSections(data, configJS, mainMenu, convertedTools, convertedMenuEntries);

    return mainMenu;
}

function fillMainSections(data, configJS, mainMenu, convertedTools, convertedMenuEntries) {
    console.log("   tools");
    const  menu = data[PORTALCONFIG]["menu"],
    tools = menu["tools"]["children"],
    section = mainMenu.sections[0];

    if(tools.print) {
        console.log("       print");
        const print = {...tools.print};

        print.type = "print";
        section.push(print);
        convertedTools.push("print");
    }
    console.log("       openConfig");
    section.push({
        type: "openConfig",
    });
    if(menu.legend) {
        console.log("       legend");
        section.push({
            type: "legend",
        });
        convertedMenuEntries.push("contact");
    }
    console.log("       shareView");
    section.push({
        type: "shareView",
    });
    if(menu.contact) {
        console.log("       contact");
        const contact = {...menu.contact};

        contact.type = "contact";
        section.push(contact);
        convertedMenuEntries.push("contact");
    }
    console.log("       news");
    section.push({
        type: "news",
    });
    if(configJS.portalLanguage?.enabled){
        console.log("       language");
        section.push({
            type: "language",
        });
    }  
    console.info("--- HINT: add nested folders to menu containing menu entries by using type 'folder'."); 
    console.info("--- HINT: display HTML or excute action or open url by using type 'customMenuElement'."); 
}

function addSearchbar(data, mainMenu) {
    if (data[PORTALCONFIG]["searchBar"]) {
        const oldSearchbar = data[PORTALCONFIG]["searchBar"],
            newSearchbar = {
                searchInterfaces: {}
            };

        Object.entries(oldSearchbar).forEach(([searchName, interface]) => {
            if(typeof interface === "object"){
                console.log("   searchbar entry " + searchName);
                if (interface.minchars === 3) {
                    delete interface.minchars;
                }
                newSearchbar.searchInterfaces[searchName] = interface;   
            }
        });
        mainMenu.searchBar = newSearchbar;
    }
    else {
        console.warn("  no 'searchBar' found");
    }
}
/*
 "title": {
        "text": "Master",
        "logo": "https://geodienste.hamburg.de/lgv-config/img/hh-logo.png",
        "link": "https://geoinfo.hamburg.de",
        "toolTip": "Landesbetrieb Geoinformation und Vermessung"
      },
*/
function addTitle(data, mainMenu) {
    let newTitle = {};

    if (data[PORTALCONFIG]["portalTitle"]) {
        const oldTitle = data[PORTALCONFIG]["portalTitle"],
            oldTitleText = oldTitle.title,
            newTitle = oldTitle;

        newTitle.text = oldTitleText;
        delete newTitle.title;
    }
    else {
        console.warn("  no 'portalTitle' to convert found - fill mainMenu/title with title");      
        newTitle.text = "Titel des Portals"
        newTitle.logo = ""
        newTitle.link = ""
        newTitle.toolTip = "toolTip"
    }
    mainMenu.title = newTitle;
    console.log("   title");
}
