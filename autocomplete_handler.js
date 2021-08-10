function apply_autocomplete(main_lang) {
    au = main_lang
    read_dictionary(au,
        function (availableTags) {
            console.log(availableTags)
            $("#searchfield").autocomplete({
                source: availableTags,
                delay: 100,
                minLength: 3
            })
        }
    )
}


function read_dictionary(name, fnc) {
    var rawFile = new XMLHttpRequest();
    lines = []
    rawFile.open("GET", "dictionaries//" + name + "_lemmas_compact.txt", true);
    rawFile.onreadystatechange = function () {
        if (rawFile.readyState === 4) {
            if (rawFile.status === 200 || rawFile.status == 0) {
                var allText = rawFile.responseText;
                let lines = allText.split(/\r?\n/);
                fnc(lines)
            }
        }
    }

    rawFile.send(null);
    return;
}
