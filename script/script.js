let buttonChecker = document.querySelector('#instaButt');
buttonChecker.addEventListener('click', tagChecker);

function tagChecker() {
    $('#root').html("");
    let request = document.querySelector('#inputArea').value;
    request = request.toLowerCase(); // оптовое унижение всех букв
    instaChecker(request);
};

function instaChecker(tag_name) {
    let params = {
        tag_name,
        "first": 10 // на выходе получается в три раза больше, почему-то!
    };

    $.ajax({ // в душе не знаю, как оно работает в других условиях и где может пригодиться
        url: `https://www.instagram.com/graphql/query/?query_hash=174a5243287c5f3a7de741089750ab3b&variables=${JSON.stringify(params)}`, // пробела быть не должно!
        dataType: "json",
        success: function(dannye) {
            let edges = dannye.data.hashtag.edge_hashtag_to_media.edges;
            let result = edges.map(elem => elem.node);
            result.forEach(render);
        }
    });
}

function render(obj) { // сюда отправляются по очереди элементы объекта result

    let parsedImg = obj.display_url;
    let parsedText = obj.accessibility_caption;
    let parsedLikes = obj.edge_liked_by.count;
    let parsedText2;
    let newBox = $('<div>');
    newBox.addClass('newDiv');
    let descriptImage = $('<div>');
    descriptImage.addClass('descriptImage');
    let newTitle = $('<p>');
    newTitle.addClass('newTitle');
    let likeIcons = $('<i>')
    likeIcons.addClass('far fa-thumbs-up'); // иконка лайка из fontavesome
    let newLikes = $('<p>');
    newLikes.addClass('newLikes');

    if (parsedText === undefined) {
        parsedText2 = 'Описание отсутствует.';
    } else {
        if (parsedText.indexOf(':') === -1) {
            parsedText2 = parsedText;
        } else {
            parsedText2 = parsedText.slice(parsedText.indexOf(':') + 2);
        };
        parsedText2 = parsedText2[0].toUpperCase() + parsedText2.slice(1); // делаем первую букву большой
    }

    newBox.css('background-image', `url("${parsedImg}")`);
    newTitle.text(`${parsedText2}`);
    newLikes.text(' ' + `${parsedLikes}`);

    descriptImage.append(newTitle);
    descriptImage.append(likeIcons);
    descriptImage.append(newLikes);
    newBox.append(descriptImage);
    $('#root').append(newBox);
}