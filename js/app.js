$(document).ready(() => {
    if (localStorage.ui) {
        let storageUi = localStorage.getItem('ui');
        let ui = JSON.parse(storageUi);
        getData(ui);
        generateColors();
        console.log(ui)
        $('body').css('background', ui.background);
        $('nav > ul > li').css('color', `${ui.color}`);
    } else {
        const form = new Form('intro');
        form.createForm();
        generateColors();
        $('body').css('background', 'url(img/1.jpg)');

        $('.button').click(() => {
            const name = $('input').get(0).value;
            const location = $('input').get(1).value;
            const ui = new Ui(location, name);

            let userLocation = location.replace(/ |, |,/g, ',+');
            ui.geoLocation = userLocation;
            ui.background = 'url(img/1.jpg)';

            getData(ui);
            let newUi = JSON.stringify(ui);
            localStorage.setItem("ui", newUi);

            $('.intro-form').remove();
            $('body').css('background', 'url(../img/1.jpg)');
        })
    }
}); 

function getNewestLocal() {
    let storageUi = localStorage.getItem('ui');
    let localUi = JSON.parse(storageUi);

    return localUi;
}
function saveLocal(ui) {
    let newUi = JSON.stringify(ui);
    localStorage.setItem('ui', newUi);
}

function appendWidgets(ui) { 
    for (let i = 0; i < ui.widgets.length; i++) {
        let widget = ui.widgets[i];
        let query = () => {
            if (widget.type == 'Humidity') {
                return `${Math.floor(ui.weather.currently.humidity * 100)}`
            } else if (widget.type == 'Visibility') {
                return `${Math.floor(ui.weather.currently.visibility)}`
            } else if (widget.type == 'WindSpeed') {
                return `${Math.floor(ui.weather.currently.windSpeed)}`
            } else if (widget.type == 'Pressure') {
                return `${Math.floor(ui.weather.currently.pressure)}`
            } else if (widget.type == 'Uv-Index') {
                return `${ui.weather.currently.uvIndex}`
            }
        }

        let otherWeatherQuery = (data) => {
            if (widget.type == 'Humidity') {
                return `${Math.floor(data.currently.humidity * 100)}`
            } else if (widget.type == 'Visibility') {
                return `${Math.floor(data.currently.visibility)}`
            } else if (widget.type == 'Windspeed') {
                return `${Math.floor(data.currently.windSpeed)}`
            } else if (widget.type == 'Pressure') {
                return `${Math.floor(data.currently.pressure)}`
            } else if (widget.type == 'Uv-Index') {
                return `${data.currently.uvIndex}`
            } else if (widget.type == 'Temperature') {
                return `${Math.floor(data.currently.temperature)}`
            }
        }
        if (ui.widgets[i].geoLocation) {
                fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${widget.geoLocation},+&key=[key]`)
                    .then((Response) => { return Response.json() })
                    .then((Response) => {
                        let latitude = Response.results[0].geometry.location.lat;
                        let longitude = Response.results[0].geometry.location.lng;

                        fetch(`https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/[key]/${latitude},${longitude}`)
                            .then((data) => { return data.json() })
                            .then((data) => {
                                $('nav').after(`<div class="widget widget-${widget.size}" id="widget-${widget.id}">
                                        <span>
                                            <i class="material-icons widget-clear">clear</i>
                                            <i class="material-icons widget-lock-open">lock_open</i>
                                            <i class="material-icons widget-lock">lock_outline</i>
                                        </span>
                                        <div class="data-container">
                                            <img src=${widget.image}>
                                            <h1> ${widget.type} in ${widget.location}: <br> 
                                            ${otherWeatherQuery(data)} ${widget.unit} </h1>
                                        </div>
                                </div>`)
                                settings();
                            })
                    })
            } else {
                $('nav').after(`<div class="widget widget-${widget.size}" id="widget-${widget.id}">
                            <span>
                                <i class="material-icons widget-clear">clear</i>
                                <i class="material-icons widget-lock-open">lock_open</i>
                                <i class="material-icons widget-lock">lock_outline</i>
                            </span>
                            <div class="data-container">
                                <img src=${widget.image}>
                                <h1> ${widget.type} in ${ui.location}: <br> 
                                ${query()} ${widget.unit} </h1>
                            </div>
                        </div>`)
            settings();
            }


        function settings() {
            $(`#widget-${widget.id}`).delay(650 * i).animate({
                opacity: 1
            }, 1000);
            $(`.widget`).draggable();
        
            $(`#widget-${widget.id}`).css({
                left: `${widget.left}`,
                top: `${widget.top}`,
                width: `${widget.dimensions[0]}`,
                height: `${widget.dimensions[1]}`,
            })
            $(`#widget-${widget.id} > .data-container > h1`).css({
                'font-size': `${widget.dimensions[2]}`,
                'color': `${ui.color}`
            })
            $(`#widget-${widget.id} > .data-container > img`).css({
                'width': `${widget.dimensions[3]}`,
                'height': `${widget.dimensions[3]}`
            })

            $(`.widget`).draggable();

            let openLock = `#widget-${widget.id} > span > .widget-lock-open`;
            let closedLock = `#widget-${widget.id} > span > .widget-lock`;
            let clear = `#widget-${widget.id} > span > .widget-clear`;

            if (widget.locked == true) {
                $(openLock).css('display', 'none');
                $(closedLock).css('display', 'block')
                $(clear).css('visibility', 'hidden')
                $(`#widget-${widget.id}`).draggable('disable')
            } else if (widget.locked == false) {
                $(closedLock).css('display', 'none');
                $(openLock).css('display', 'block')
                $(clear).css('visibility', 'visible')
            }
            $(`#widget-${widget.id}`).mouseup(() => {

                let storageUi = localStorage.getItem('ui');
                let localUi = JSON.parse(storageUi);

                let left = $(`#widget-${widget.id}`).css('left');
                let top = $(`#widget-${widget.id}`).css('top');

                for (let i = 0; i < localUi.widgets.length; i++) {
                    if (localUi.widgets[i].id == widget.id) {
                        localUi.widgets[i].top = top;
                        localUi.widgets[i].left = left;
                    }
                }

                console.log('from widget mouse move')

                let newUi = JSON.stringify(localUi);
                localStorage.setItem('ui', newUi);
            })

            $(`#widget-${widget.id} > span > .widget-clear`).click(() => {
                let localUi = getNewestLocal();
                
                if (localUi.widgets.length == 1 && localUi.widgets[0].id !== 0) {
                    localUi.widgets.splice(0, 1)
                } else {
                    //used this loop to match the widgets id to the widgets id property
                    for (let i = 0; i < localUi.widgets.length; i++) {
                        if (widget.id == localUi.widgets[i].id) {
                            localUi.widgets.splice(i, 1)
                        }
                    }
                }
                $(`#widget-${widget.id}`).remove();
                saveLocal(localUi)
            })

            $(openLock).click(() => {
                $(openLock).css('display', 'none');
                $(closedLock).css('display', 'block')
                $(clear).css('visibility', 'hidden')
                $(`#widget-${widget.id}`).draggable('disable')
                let localUi = getNewestLocal();
                for (let i = 0; i < localUi.widgets.length; i++) {
                    if (widget.id == localUi.widgets[i].id) {
                        localUi.widgets[i].locked = true;
                        console.log(i)
                    }
                }
                saveLocal(localUi)
            })
            $(closedLock).click(() => {
                $(closedLock).css('display', 'none');
                $(openLock).css('display', 'block')
                $(clear).css('visibility', 'visible')
                $(`#widget-${widget.id}`).draggable('enable')
                let localUi = getNewestLocal();
                for (let i = 0; i < localUi.widgets.length; i++) {
                    if (widget.id == localUi.widgets[i].id) {
                        localUi.widgets[i].locked = false;
                    }
                }
                saveLocal(localUi)
            })
        }
    
    };
}
function getData(ui) {
    fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${ui.geoLocation},+&key=[key]`)
        .then((response) => { return response.json() })
        .then((response) => {
            console.log(response)

            let latitude = response.results[0].geometry.location.lat;
            let longitude = response.results[0].geometry.location.lng;

            let storageUi = localStorage.getItem('ui');
            let localUi = JSON.parse(storageUi);

            ui.shortName = response.results[0].address_components[0].short_name;
            localUi.cords = [latitude, longitude];

            let newUi = JSON.stringify(localUi);
            localStorage.setItem('ui', newUi);
    
            fetch(`https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/[key]/${latitude},${longitude}`)
                .then((data) => { return data.json() })
                .then((data) => {
                    let localUi = getNewestLocal();
                    console.log(data);
                    localUi.icon = data.currently.icon;
                    ui.weather = data;
                    dataContent(ui);
                    saveLocal(localUi);
                })
                .catch(error => console.error('Error:', error))
        });
}
function dataContent(ui) {
    let date = new Date().toLocaleString("en-US",
        {
            timeZone: ui.weather.timezone,
            hour: 'numeric',
            minute: '2-digit'
        });

    let strLinks = ''; 
    if (ui.links) {
        for (let i = 0; i < ui.links.length; i++) {
            strLinks += `<a href="${ui.links[i].url}" id="link-${ui.links[i].id}" class="link" target="_blank">
                    ${ui.links[i].name}</a>`
        }
    }
    $('.content').html(`<h1 class="welcome">Welcome, ${ui.name}</h1>`);
    $('.welcome').delay(200).animate({ 'opacity': '1' }, 1000);
    $('.welcome').delay(600).animate({
        'margin-top': '1rem',
        'font-size': '3rem',
        'opacity': '0.9',
    }, 1500);
    $('.content').delay(2600).append(` 
                    <p class="time">${date}</p>
                    <canvas id="WeatherIcon" width="128" height="128"></canvas>
                    <p>${ui.weather.daily.summary}</p>
                    <p>Current Temp in ${ui.shortName} <br>
                    ${Math.floor(ui.weather.currently.temperature)}°F</p>

                    <div class="links">
                        ${strLinks}
                        <div class="new-link">
                        <i class="large material-icons">add</i>
                        </div>
                    </div>`)
    $('p').delay(2600).animate({ 'opacity': '1' }, 2000);
    $('.links').delay(2600).animate({ 'opacity': '1' }, 2000);
    $('#WeatherIcon').delay(2600).animate({'opacity': '1'}, 2000)
    $('p').css('color', `${ui.color}`);
    $('h1').css('color', `${ui.color}`);
    $('body').css('background', `${ui.background}`);

    const skycons = new Skycons({ color: `${ui.color}` })
    const currentIcon = ui.weather.currently.icon;
    const icon = currentIcon.replace(/-/g, '_').toUpperCase();
    skycons.play();
    skycons.set("WeatherIcon", Skycons[icon])

    setInterval(() => {
        let date = new Date().toLocaleString("en-US",
            {
                timeZone: ui.weather.timezone,
                hour: 'numeric',
                minute: '2-digit'
            });
        $('.time').html(`${date}`)
    }, 1000);


    for (let i = 0; i < $('.link').length; i++) {
        let color = ui.links[i].color;;
        document.querySelectorAll('.link')[i]
            .style.border = `2px solid ${color}`
    }

    appendWidgets(ui);
    
    $('.links > .new-link').click(() => {
        let popUp = $(`body > .new-link-popUp`);
        if (popUp) {
            let form = new Form('link');
            form.createForm();
        }
    });
}

$('.bg').click(() => {
    if ($('.background').hasClass('hidden')) {
        $('.background').removeClass('hidden');
        $('.background').animate({ height: 400, opacity: 1 }, 600);
        $('.background').css('z-index', '100');
        $('.bg-arrow').css('transform', 'rotate(180deg)');
    } else {
        $('.background').animate({
            height: 0,
            opacity: 0,
            'z-index': '-1'
        }, 600);
        $('.background').addClass('hidden');
        $('.bg-arrow').css('transform', 'rotate(0deg)');
    }
});

$('.background').click((e) => {
    let pictures = $('.pic');

    let changeBackground = (i) => {
        let storageUi = localStorage.getItem('ui');
        let localUi = JSON.parse(storageUi);
        // +1 becuase the pictures in img folder are just numbers starting off at 1
        let background = `url(../img/${i + 1}.jpg)`

        $('body').css('background', background);
        localUi.background = background;
        let newUi = JSON.stringify(localUi);
        localStorage.setItem('ui', newUi);
    }
    for (let i = 0; i < pictures.length; i++) {
        if (e.target == pictures[i]) {
            changeBackground(i)
        }
    }
});

$('#reset').click(() => {
    if (!document.querySelector('.reset-box')) {
        $('.content').after(`   <div class="reset-box">
                                    <h3>Are you sure you want to reset?</h3>

                                    <span>
                                        <button class="yes">yes</button>
                                        <button class="no">no</button>
                                    </span>
                                </div>`)
    }
    $('.reset-box').animate({
        height: '6rem',
        opacity: 1
    }, 400);

    $('.yes').click(() => {
        localStorage.clear();
        location.reload();
    })
    $('.no').click(() => {
        $('.reset-box').animate({
            height: 0,
            opacity: 0
        }, 200);
    })
});
$('.ct').click(() => {
    if ($('.theme').hasClass('hidden')) {
        $('.theme').removeClass('hidden');
        $('.theme').animate({ height: 350, opacity: 1 }, 600);
        $('.theme').css('z-index', 100);
        $('.theme-arrow').css('transform', 'rotate(180deg)');
    } else {
        $('.theme').animate({ height: 0, opacity: 0, 'z-index': -1}, 600);
        $('.theme-arrow').css('transform', 'rotate(0deg)');
        $('.theme').addClass('hidden');
    }
});
$('.remove-link').click(() => {
    let localUi = getNewestLocal();
    let links = localUi.links;
    let removeLink = document.querySelector('.remove-link');

    if ($(`.close-link`)) {
        $(`.links`).click((e) => {
            e.preventDefault();
        })
    }
    if (links.length >= 1) {
        if (removeLink.style.backgroundColor !== 'tomato') {
            $('.remove-link').css('background-color', 'tomato');

            for (let i = 0; i < links.length; i++) {

                let links = $(`.links > a`)
                let linkId = links[i].id;
                let parsedId = linkId.replace("link-", '');

                $(`#${linkId}`).append(`<i class="large material-icons close-link">close</i>`);
                $('.close-link').animate({ opacity: 1 }, 25)

                $(`#${linkId} > .close-link`).click(() => { 
                    links = $(`.links > a`);
                    if (links.length == 1) {
                        $('.remove-link').css('background-color', 'transparent');
                    }
                    if (localUi.links.length == 1 && localUi.links[0].id !== 0) {
                        localUi.links.splice(0, 1)
                    } else {
                        // Loop to match the clicked link dom id to the stored arr of obj of link's id
                        for (let i = 0; i < localUi.links.length; i++) {
                            if (parsedId == localUi.links[i].id) {
                                localUi.links.splice(i, 1)
                            }
                        }
                    }
                    $(`#${linkId}`).remove();
                    saveLocal(localUi)
                })
            }
        } else if (removeLink.style.backgroundColor == 'tomato') {
            $('.remove-link').css('background-color', 'transparent');
            $(`.links`).find('.close-link').remove();
            $('.close-link').animate({ opacity: 0 }, 100)
    }
}    

})
$('.theme').click((e) => {
    let coloredDiv = $('.color');
    let target = e.target;
    let changeColor = (i) => {
        let color = coloredDiv[i].style.backgroundColor;
        $('p').css('color', `${color}`);
        $('h1').css('color', `${color}`);
        $('nav > ul > li').css('color', `${color}`);

        let localUi = getNewestLocal();
        console.log(localUi)

        $('#WeatherIcon').remove();
        $('#NewWeatherIcon').remove();
        $('.time').after('<canvas id="NewWeatherIcon" width="128" height="128"></canvas>')

        const skycons = new Skycons({ color: `${color}` })
        const currentIcon = localUi.icon;
        const icon = currentIcon.replace(/-/g, '_').toUpperCase();

        skycons.set("NewWeatherIcon", Skycons[icon])
        skycons.play();

        localUi.color = color;
        saveLocal(localUi);
    }

    for (let i = 0; i < coloredDiv.length; i++){
        if (target == coloredDiv[i]) {
            changeColor(i)
        }
    }
});
$('li.name').click(() => {
    $('li.name').css('background-color', 'tomato')
    let span = $('.edit-name-span');
    if (span.length < 1) {
        let storageUi = localStorage.getItem('ui');
        let localUi = JSON.parse(storageUi);
        let color = localUi.color;
        $('.welcome').remove();
        $('.time').before(
            `<span class="edit-name-span">
                <h1>Welcome,</h1>
                <input type="text" class="edit" placeholder ="Name">
                <button> Change Name </button>
                <div>
                    <i class="large material-icons">close</i>
                </div>
            </span> `);
        $('.edit-name-span > h1').css({
            'color': color,
            'font-size': '2rem',
        });

        $('.edit-name-span > button').click(() => {
            $('li.name').css('background-color', 'transparent')
            let value = $('.edit-name-span > input').get(0).value
            localUi.name = value;

            let newUi = JSON.stringify(localUi);
            localStorage.setItem('ui', newUi);

            $('.edit-name-span').remove();
            $('.time').before(
                `<h1 class="welcome">Welcome, ${value} </h1>`)
            $('.welcome').animate({
                'margin-top': '1rem',
                'font-size': '3rem',
                'opacity': '0.9',
                'color': color
            }, 1000);
        })
        $('.edit-name-span > div').click(() => {
            $('li.name').css('background-color', 'transparent')
            $('.edit-name-span').remove();
            $('.time').before(
                `<h1 class="welcome">Welcome, ${localUi.name} </h1>`)
            $('.welcome').animate({
                'margin-top': '1rem',
                'font-size': '3rem',
                'opacity': '0.9',
                'color': color
            }, 1000);
        })
    }
})
function generateColors(type) {
    let resetColors = () => {
        for (let i = 0; i < $('.color').length; i++) {
            let rgb = [];
            for (let i = 0; i < 3; i++) {
                let num = Math.floor(Math.random() * 255);
                rgb.push(num);
            }
            let newColor = rgb.join();
            let colredDiv = $('.color').get(i);
            colredDiv.style.backgroundColor = `rgb(${newColor})`
            rbg = [];
        }
    }
    if ($('.color').length < 1) {
        for (let i = 0; i < 12; i++) {
            let colorDiv = '<div class="color"></div>';
            let rgb = [];

            for (let i = 0; i < 3; i++) {
                let num = Math.floor(Math.random() * 256);
                rgb.push(num);
            }

            let newColor = rgb.join();

            $('.theme').append(colorDiv);
            $('.color').last().css('background-color', `rgb(${newColor})`);

            rbg = [];
        }

        $('.theme').append('<button>New Colors</button>');
        $('.theme > button').addClass('new-color');

    }
    if (type == 'getColor') {
        let color = [];
            for (let i = 0; i < 3; i++) {
                let num = Math.floor(Math.random() * 256);
                color.push(num);
        }
        color = color.join();
        return color;
        }
        $('.new-color').click(() => {
            resetColors();
        })
};

$('nav > ul > #widget').click(() => {
    if (!document.querySelector('.widget-drop-down')) {
        $('.content').after(`   <div class="widget-drop-down">
                                    <h3>What size widget would you like?</h3>
                                    <span>
                                        <button class="small">Small</button>
                                        <button class="medium">Medium</button>
                                        <button class="large">Large</button>
                                    </span>
                                </div>`);
    } 

    if ($(`.widget-drop-down`).css('z-index') == '100'){
        $('.widget-drop-down').animate({
            height: '0rem',
            opacity: 0,
        }, 400).css('z-index', 0);
    } else {
        $('.widget-drop-down').animate({
            height: '6rem',
            opacity: 1,
        }, 400).css('z-index', 100);
    }

    $('.small').click(() => {
        if (!$('.widget').hasClass('new-widget')) {
            let newWidget = new Widget('small');
            newWidget.createWidget();
        }
        $('.widget-drop-down').remove();
    })
    $('.medium').click(() => {
        if (!$('.widget').hasClass('new-widget')) {
            let newWidget = new Widget('medium');
            newWidget.createWidget();
        }
        $('.widget-drop-down').remove();
    })
    $('.large').click(() => {
        if (!$('.widget').hasClass('new-widget')) {
            let newWidget = new Widget('large');
            newWidget.createWidget();
        }
        $('.widget-drop-down').remove();
    })
})








