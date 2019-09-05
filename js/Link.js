class Link {
    constructor(url, name, color) {
        this.url = url;
        this.name = name;
        this.color = color;
        this.id = Link.getId();
    }
    static getId() {
        let storageUi = localStorage.getItem('ui');
        let localUi = JSON.parse(storageUi);
        let numOflinks = localUi.links.length;
        let index = 0;

        /** 
        * Note: The index++ happens because everytime the user saves the widget, it gets sorted by
                its id value from smallest to largest, so +1 adds a new widget with an unused id value
                even when the user has deleted certain widgets.
        */
        for (let i = 0; i < numOflinks; i++) {
            if (numOflinks < 1) {
                index = i;
            } else if (localUi.links[i].id == i) {
                index = i;
                index++;
            }
        }

        let newUi = JSON.stringify(localUi);
        localStorage.setItem('ui', newUi);

        return index;
    }
}