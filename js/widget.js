class Widget {
    constructor(size, id, image, type, unit) {
        this.size = size;
        this.id = this.getId();
        this.image = image;
        this.type = type;
        this.unit = unit;
        this.left = 0;
        this.top = 0;
        this.dimensions = this.dimensions();
        this.locked = false;
    }

    createWidget() {
        let saveWidget = (widget) => {
            let storageUi = localStorage.getItem('ui');
            let localUi = JSON.parse(storageUi);
            localUi.widgets.push(widget)
            console.log(localUi)

            localUi.widgets.sort(function (a, b) {
                return a.id - b.id;
            });

            let newUi = JSON.stringify(localUi);
            localStorage.setItem('ui', newUi);
        }
        let appendWidget = () => {
            let localUi = getNewestLocal();

            $('nav').after(`<div class="widget widget-${this.size} new-widget" id="widget-${this.id}">
                                <span>
                                    <i class="material-icons widget-clear">clear</i>
                                    <i class="material-icons widget-lock-open">lock_open</i>
                                    <i class="material-icons widget-lock">lock_outline</i>
                                </span>
                                <ul>
                                    <li id = "New">Change to a new location</li>
                                    <li id = "Same">Same Location</li>
                                </ul>
                            </div>`);
            $('.widget').draggable();
            $(`.widget-${this.size}`).css({
                width: this.dimensions[0],
                height: this.dimensions[1],
                opacity: '1',
            });
            $(`#widget-${this.id}`)
                .css({ 'font-size': `${this.dimensions[2]}` });
            
            $(`#widget-${this.id} > ul > li`).css({'color': `${localUi.color}`})

            
            let widget = `#widget-${this.id}`;
            let openLock = `${widget} > span > .widget-lock-open`;
            let closedLock = `${widget} > span > .widget-lock`;
            let clear = `${widget} > span > .widget-clear`;

            $(openLock).click(() => {
                $(openLock).css('display', 'none');
                $(closedLock).css('display', 'block')
                $(clear).css('visibility', 'hidden')
                $(`${widget}`).draggable('disable')
                let localUi = getNewestLocal();
                for (let i = 0; i < localUi.widgets.length; i++) {
                    if (this.id == localUi.widgets[i].id) {
                        localUi.widgets[i].locked = true;
                    }
                }
                saveLocal(localUi);
            })

            $(closedLock).click(() => {
                $(closedLock).css('display', 'none');
                $(openLock).css('display', 'block')
                $(clear).css('visibility', 'visible')
                $(`${widget}`).draggable('enable')
                let localUi = getNewestLocal();
                for (let i = 0; i < localUi.widgets.length; i++) {
                    if (this.id == localUi.widgets[i].id) {
                        localUi.widgets[i].locked = false;
                    }
                }
                saveLocal(localUi);
            })

            $(clear).click(() => {
                let localUi = getNewestLocal();

                if (localUi.widgets.length == 1 && localUi.widgets[0].id !== 0) {
                    localUi.widgets.splice(0, 1)
                } else {
                    for (let i = 0; i < localUi.widgets.length; i++) {
                        if (this.id == localUi.widgets[i].id) {
                            localUi.widgets.splice(i, 1)
                        }
                    }
                }
                console.log(localUi)
                $(`#widget-${this.id}`).remove();
                saveLocal(localUi)
            })

            let widgetCSS = () => {
                let localUi = getNewestLocal();

                $(`#widget-${this.id} > .data-container > h1`)
                    .css({
                        'font-size': `${this.dimensions[2]}`,
                        'color': `${localUi.color}`
                    })
                $(`#widget-${this.id} > .data-container > img`)
                    .css({
                        'width': `${this.dimensions[3]}`,
                        'height': `${this.dimensions[3]}`
                    })
            }

            $(`#widget-${this.id} > ul > #Same`).click(() => {

                let localUi = getNewestLocal();

                $(`#widget-${this.id} > ul`).remove();
                $(`#widget-${this.id}`).append(`<ul>
                                        <li>Humidity</li>
                                        <li>Visibility</li>
                                        <li>WindSpeed</li>
                                        <li>Pressure</li>
                                        <li>UvIndex</li>
                                    </ul>
                `)
                $(`#widget-${this.id} > ul > li`).css({
                    'margin': '0.25rem',
                    'color': `${localUi.color}`
                });
                $(`#widget-${this.id} > ul`).css({
                    'margin': '0',
                });
                let thisWidget = `#widget-${this.id} > ul > li`;
                let widget = `#widget-${this.id}`;

                let cords = () => {
                    let storageUi = localStorage.getItem('ui');
                    let localUi = JSON.parse(storageUi);

                    let lat = localUi.cords[0];
                    let long = localUi.cords[1];
                    
                    return [lat, long]
                }

                let lat = cords()[0];
                let long = cords()[1];


                let weatherData;

                    fetch(`https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/[key]/${lat},${long}`)
                        .then((data) => { return data.json() })
                        .then((data) => {
                            weatherData = data;
                            let localUi = getNewestLocal();

                            $($(thisWidget).get(0)).click(() => {
                                $(`#widget-${this.id} > ul`).remove();
                                $(`#widget-${this.id}`).removeClass('new-widget');
                                $(`#widget-${this.id}`).append(`
                                        <div class="data-container">
                                            <img src="../img/humidity-use.png">
                                            <h1> Humidity in ${localUi.location}: <br> 
                                            ${Math.floor(weatherData.currently.humidity * 100)}% </h1>
                                        </div>
                                `)
                                this.image = '../img/humidity-use.png';
                                this.type = 'Humidity';
                                this.unit = '%';
                                widgetCSS();
                                saveWidget(this);
                            })
                            $($(thisWidget).get(1)).click(() => {
                                $(`#widget-${this.id} > ul`).remove();
                                $(`#widget-${this.id}`).removeClass('new-widget');
                                $(`#widget-${this.id}`).append(`
                                        <div class="data-container">
                                            <img src="../img/eye-use.png">
                                            <h1> Visibility in ${localUi.location}: <br>
                                            ${Math.floor(weatherData.currently.visibility)} Mi </h1>
                                        </div>
                                `)
                                this.image = '../img/eye-use.png';
                                this.type = 'Visibility';
                                this.unit = 'Mi';
                                widgetCSS();
                                saveWidget(this);
                            })
                            $($(thisWidget).get(2)).click(() => {
                                $(`#widget-${this.id} > ul`).remove();
                                $(`#widget-${this.id}`).removeClass('new-widget');
                                $(`#widget-${this.id}`).append(`
                                        <div class="data-container">
                                            <img src="../img/windsock-use.png">
                                            <h1> Windspeed in ${localUi.location}: <br> 
                                            ${Math.floor(weatherData.currently.windSpeed)} mph </h1>
                                        </div>
                                `)
                                this.image = '../img/windsock-use.png';
                                this.type = 'WindSpeed';
                                this.unit = 'mph'
                                widgetCSS();
                                saveWidget(this);
                            })
                            $($(thisWidget).get(3)).click(() => {
                                $(`#widget-${this.id} > ul`).remove();
                                $(`#widget-${this.id}`).removeClass('new-widget');
                                $(`#widget-${this.id}`).append(`
                                        <div class="data-container">
                                            <img src="../img/pressure-use.png">
                                            <h1> Pressure in ${localUi.location}: <br> 
                                            ${Math.floor(weatherData.currently.pressure)} mb </h1>
                                        </div>
                                `)
                                this.image = '../img/pressure-use.png';
                                this.type = 'Pressure';
                                this.unit = 'mb'
                                widgetCSS();
                                saveWidget(this);
                            })
                            $($(thisWidget).get(4)).click(() => {
                                $(`#widget-${this.id} > ul`).remove();
                                $(`#widget-${this.id}`).removeClass('new-widget');
                                $(`#widget-${this.id}`).append(`
                                        <div class="data-container">
                                            <img src="../img/uv-index.png">
                                            <h1> UV INDEX in ${localUi.location}: <br> 
                                            ${weatherData.currently.uvIndex}</h1>
                                        </div>
                                `)
                                this.image = '../img/uv-index.png';
                                this.type = 'Uv-Index';
                                this.unit = ''
                                widgetCSS()
                                saveWidget(this);
                            })
                            $(widget).mouseup(() => {
                                let left = $(widget).css('left');
                                let top = $(widget).css('top');
                                this.left = left;
                                this.top = top;

                                let storageUi = localStorage.getItem('ui');
                                let localUi = JSON.parse(storageUi);

                                for (let i = 0; i < localUi.widgets.length; i++) {
                                    if (localUi.widgets[i].id == this.id) {
                                        localUi.widgets[i].top = top;
                                        localUi.widgets[i].left = left;
                                    }
                                }

                                let newUi = JSON.stringify(localUi);
                                localStorage.setItem('ui', newUi);
                                
                            })
                        })
            });

            $(`#widget-${this.id} > ul > #New`).click(() => { 
                $(`#widget-${this.id} > ul`).remove();
                $(`#widget-${this.id}`).append(`
                    <input type="text" class="new-location" placeholder="Location">
                    <button class="button new-location-button">Submit</button>
                `)
                $(`#widget-${this.id} > button`).css({'width': '75%'})
                $(`#widget-${this.id} > button`).click(() => {
                    let location = $(`#widget-${this.id} > input`).get(0).value;
                    let geoLocation = location.replace(/ |, |,/g, ',+');

                    $(`#widget-${this.id} > input`).remove();
                    $(`#widget-${this.id} > button`).remove();
                    $(`#widget-${this.id}`).append(`<img src="../img/Rolling-1.1s-73px.svg" class="widget-svg">`)
                    $(`.widget-svg`).css({'margin-top': '45%'})

                    fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${geoLocation},+&key=[key]`)
                        .then((Response) => { return Response.json() })
                        .then((Response) => {
                            let latitude = Response.results[0].geometry.location.lat;
                            let longitude = Response.results[0].geometry.location.lng;

                            this.location = Response.results[0].address_components[0].short_name;
                            this.geoLocation = geoLocation;


                            fetch(`https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/[key]/${latitude},${longitude}`)
                                .then((data) => { return data.json() })
                                .then((data) => {
                                    $(`.widget-svg`).remove();
                                    $(`#widget-${this.id}`).append(`<ul>
                                        <li>Humidity</li>
                                        <li>Visibility</li>
                                        <li>WindSpeed</li>
                                        <li>Pressure</li>
                                        <li>UvIndex</li>
                                        <li>Temperature</li>
                                    </ul>
                                    `)
                                    if (this.size == 'large') {
                                        $(`#widget-${this.id} > ul > li`).css({ 'margin-top': '0.5rem' })
                                    }

                                    $(`#widget-${this.id} > ul > li`).css({ 'margin': '0.25rem' });
                                    $(`#widget-${this.id} > ul`).css({
                                        'margin': '0',
                                    });

                                    let thisWidget = $(`#widget-${this.id} > ul > li`);
                                    let widget = $(`#widget-${this.id}`);

                                    $($(thisWidget).get(0)).click(() => {
                                        $(`#widget-${this.id} > ul`).remove();
                                        $(`#widget-${this.id}`).removeClass('new-widget');
                                        $(`#widget-${this.id}`).append(`
                                        <div class="data-container">
                                            <img src="../img/humidity-use.png">
                                            <h1> Humidity in ${this.location}: <br> 
                                            ${Math.floor(data.currently.humidity * 100)}% </h1>
                                        </div>
                                        `)
                                        this.image = '../img/humidity-use.png';
                                        this.type = 'Humidity';
                                        this.unit = '%';
                                        widgetCSS();
                                        saveWidget(this);
                                    })
                                    $($(thisWidget).get(1)).click(() => {
                                        $(`#widget-${this.id} > ul`).remove();
                                        $(`#widget-${this.id}`).removeClass('new-widget');
                                        $(`#widget-${this.id}`).append(`
                                        <div class="data-container">
                                            <img src="../img/eye-use.png">
                                            <h1> Visibility in ${this.location}: <br> 
                                            ${Math.floor(data.currently.visibility)} Mi </h1>
                                        </div>
                                        `)
                                        this.image = '../img/eye-use.png';
                                        this.type = 'Visibility';
                                        this.unit = 'Mi';
                                        widgetCSS();
                                        saveWidget(this);
                                    })
                                    $($(thisWidget).get(2)).click(() => {
                                        $(`#widget-${this.id} > ul`).remove();
                                        $(`#widget-${this.id}`).removeClass('new-widget');
                                        $(`#widget-${this.id}`).append(`
                                        <div class="data-container">
                                            <img src="../img/windsock-use.png">
                                            <h1> WindSpeed in ${this.location}: <br> 
                                            ${Math.floor(data.currently.windSpeed)} mph </h1>
                                        </div>
                                        `)
                                        this.image = '../img/windsock-use.png';
                                        this.type = 'Windspeed';
                                        this.unit = 'mph'
                                        widgetCSS();
                                        saveWidget(this);
                                    })
                                    $($(thisWidget).get(3)).click(() => {
                                        $(`#widget-${this.id} > ul`).remove();
                                        $(`#widget-${this.id}`).removeClass('new-widget');
                                        $(`#widget-${this.id}`).append(`
                                        <div class="data-container">
                                            <img src="../img/pressure-use.png">
                                            <h1> Pressure in ${this.location}: <br> 
                                            ${Math.floor(data.currently.pressure)} mb </h1>
                                        </div>
                                        `)
                                        this.image = '../img/pressure-use.png';
                                        this.type = 'Pressure';
                                        this.unit = 'mb'
                                        widgetCSS();
                                        saveWidget(this);
                                    })
                                    $($(thisWidget).get(4)).click(() => {
                                        $(`#widget-${this.id} > ul`).remove();
                                        $(`#widget-${this.id}`).removeClass('new-widget');
                                        $(`#widget-${this.id}`).append(`
                                        <div class="data-container">
                                            <img src="../img/uv-index.png">
                                            <h1> UV INDEX in ${this.location}: <br> 
                                            ${data.currently.uvIndex}</h1>
                                        </div>
                                        `)
                                        this.image = '../img/uv-index.png';
                                        this.type = 'Uv-Index';
                                        this.unit = ''
                                        widgetCSS();
                                        saveWidget(this);
                                    })
                                    $($(thisWidget).get(5)).click(() => {
                                        $(`#widget-${this.id} > ul`).remove();
                                        $(`#widget-${this.id}`).removeClass('new-widget');
                                        $(`#widget-${this.id}`).append(`
                                        <div class="data-container">
                                            <img src="../img/temp-use.png">
                                            <h1> Temperature in ${this.location}: <br> 
                                            ${Math.floor(data.currently.temperature)} °F</h1>
                                        </div>
                                        `)
                                        this.image = '../img/temp-use.png';
                                        this.type = 'Temperature';
                                        this.unit = '°F'
                                        widgetCSS();
                                        saveWidget(this);
                                    })
                                    $(widget).mouseup(() => {
                                        let left = $(widget).css('left');
                                        let top = $(widget).css('top');
                                        this.left = left;
                                        this.top = top;

                                        let storageUi = localStorage.getItem('ui');
                                        let localUi = JSON.parse(storageUi);
                                        
                                        for (let i = 0; i < localUi.widgets.length; i++) {
                                            if (localUi.widgets[i].id == this.id) {
                                                localUi.widgets[i].top = top;
                                                localUi.widgets[i].left = left;
                                            }
                                        }

                                        let newUi = JSON.stringify(localUi);
                                        localStorage.setItem('ui', newUi);
                                    })

                                })
                                .catch(error => console.error('Error:', error))
                        })
                    
                })

            })

        }
        appendWidget();
    }
    dimensions() {
        if (this.size == 'small') {
            return ['9.5rem', '13.5rem', '1.15rem', '4rem']
        } else if (this.size == 'medium') {
            return ['12rem', '16.5rem', '1.35rem', '5rem']
        } else if (this.size == 'large') {
            return ['15rem', '20rem', '1.75rem', '7rem']
        }
    }

    /**
    * This method gives @this object an id based on what is already in the local
      storage. It gives this object the first number that is available(or not in use).
    */
    getId() {
        let storageUi = localStorage.getItem('ui');
        let localUi = JSON.parse(storageUi);
        let numOfWidgets = localUi.widgets.length;
        let index = 0;

        /**
                index++ happens because everytime the user saves the widget, it gets sorted by
            its id value from smallest to largest, so +1 adds a new widget with an unused id value
            even when the user has deleted certain widgets.
        */
        for (let i = 0; i < numOfWidgets; i++) {
            if (numOfWidgets < 1) {
                index = i;
            } else if (localUi.widgets[i].id == i) { 
                index = i;
                index++;
            }
        }
        let newUi = JSON.stringify(localUi);
        localStorage.setItem('ui', newUi);
        return index;
    }
}