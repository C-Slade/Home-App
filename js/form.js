class Form {
    constructor(type) {
        this.type = type;
    }

    createForm() {
        if (this.type == 'intro') {
            $('.content')
                .html(`<div class="intro-form">
                            <input type="text" placeholder="Name">
                            <input type="text" placeholder="Location - e.g. Los Angelas, California">
                            <button class="button">Submit</button>
                        </div>`);
        };
        if (this.type == 'link') {
            $('.content')
                .after(` <div class="new-link-popUp">
                            <i class="material-icons">clear</i>
                            <input type="text" placeholder="Url">
                            <p>Note: For the URL to be successful, 
                            you need to make sure to add 'http://' 
                            or 'https://' before your desired site</p>
                            <input type="text" placeholder="Name">
                            <h3>Pick a Color</h3>
                            <ul class="pick-color">
                                <li></li>
                                <li></li>
                                <li></li>
                                <li></li>
                                <li></li>
                                <li></li>
                                <li></li>
                                <li></li>
                                <li></li>
                                <li></li>
                            </ul>
                            <button class="button">Submit</button>
                        </div>`)

            for (let i = 0; i < $('.pick-color > li').length; i++){
                let coloredButton = $('.pick-color > li').get(i);
                let strColor = generateColors('getColor');
                coloredButton.style.backgroundColor = `rgb(${strColor})`;
            }

            let currentColor;
            $('.pick-color').click((e) => {
                currentColor = e.target.style.backgroundColor;
            });

            $('.new-link-popUp > button').click(() => {
                let url = $('.new-link-popUp > input').get(0).value;
                let name = $('.new-link-popUp > input').get(1).value;
                let color = currentColor;
                let storageUi = localStorage.getItem('ui');
                let localUi = JSON.parse(storageUi);
                let link = new Link(url, name, color);

                localUi.links.push(link)
                let currentLink = localUi.links.slice(-1)[0];

                // Sorts the array from smallest id to largest
                localUi.links.sort(function (a, b) {
                    return a.id - b.id;
                });

                let newUi = JSON.stringify(localUi);
                localStorage.setItem('ui', newUi);

                $('.new-link-popUp').remove();

                $(`<a href = "${url}" id="link-${currentLink.id}" class= "link link-animate" target = "_blank" >
                    ${name}</a>
                `).insertBefore('.new-link').css('border', `2px solid ${color}`)
                    .animate({
                        'opacity': '1',
                    }, 100)
            });
            
            $('.new-link-popUp > i').click(() => {
                $('.new-link-popUp').remove();
                $('.content > p').css('visibility', 'none');
            })
        }
    }
}