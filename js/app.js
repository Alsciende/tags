(function ($) {

    var availableTags = [];
    var availableChampions = [];
    var sortingAttribute = "name";

    var tagsReceived = $.get('json/data.json').then(function (data) {
        var uniqueTags = {};
        data.forEach(function (champion) {
           champion.tags.forEach(function (tag) {
               uniqueTags[tag] = 1;
           })
        });
        availableTags = Object.keys(uniqueTags).sort();
        availableChampions = data;
    });

    var documentReady = new Promise(function (resolve, reject) {
        $(resolve);
    });

    Promise.all([documentReady, tagsReceived]).then(function () {
        availableTags.forEach(function (tag) {
            $('#tags').append('<option>'+tag+'</option>');
        });
        $('#tags').multiselect({
            nonSelectedText: "Select some tags",
            enableCaseInsensitiveFiltering: true,
            onChange: refreshList
        });
        $('#sorting').click(function (e) {
          sortingAttribute = $(e.target).attr('id');
          refreshList();
        });
        refreshList();
    });

    function refreshList() {
        var selectedOptions = $('#tags option:selected');
                var selectedTags = [];
                selectedOptions.each(function (index, elt) {
                    selectedTags.push($(elt).val());
                });
                var filteredChampions = availableChampions
                  .sort(function (a, b) {
                      return a[sortingAttribute].localeCompare(b[sortingAttribute]);
                  })
                  .filter(function (champion) {
                    return selectedTags.every(function (selectedTag) {
                        return champion.tags.includes(selectedTag);
                    });
                });
                displayList(filteredChampions, selectedTags);
    }

    function displayList(list, selectedTags) {
        $('#list').empty();
        list.forEach(function (champion) {
            displayChampion(champion, selectedTags);
        });
        $('#counter').text(list.length);
    }

    function displayChampion(champion, selectedTags) {
        var $div = $('<div class="champion">');
        $div.addClass(champion.class);

        $img = $('<img class="portrait">').attr('src', 'https://hook.github.io/champions/images/champions/portrait_'+champion.code+'.png');
        $div.prepend($img);

        // $text = $('<div class="text">').appendTo($div);
        $name = $('<div class="name">').text(champion.name).appendTo($div);

        $tags = $('<div class="tags">').appendTo($div);
        champion.tags.forEach(function (tag) {
            $span = $('<span class="tag">').text('#'+tag).appendTo($tags);
            if(selectedTags.includes(tag)) {
                $span.addClass('matched');
            }
        });
        $('#list').append($div);
    }

})(jQuery);
