function get_tag_level(name) {
    // console.log(name);
    if (name[0].toLowerCase() != 'h') {
        return 0;
    }
    var i = parseInt(name.substr(1));
    if (isNaN(i)) {
        throw 'invalid tag name ' + name;
    }
    return i;
}

function create_toc() {
    var all_headers = $('h1, h2, h3, h4, h5, h6');
    // console.log(all_headers);
    var container_element = $('aside');
    var previous_element_name = "";
    var tag_level = 0;
    for (var i = 0; i < all_headers.length; i++) {
        var current_header = all_headers[i];
        var current_tag_level = get_tag_level($(current_header).prop("tagName"));
        // console.log("Current Tag Level: " + current_tag_level);
        // If this is a sub-heading
        if (current_tag_level > tag_level) {
            var new_container = $("<ul></ul>")
            container_element.append(new_container);
            container_element = new_container;
        }
        // If this is a heading on a parent level, go up to the container's parent.
        else if (current_tag_level < tag_level) {
            container_element = container_element.parent();
        }
        tag_level = current_tag_level;


        var list_entry = $("<li></li>");
        container_element.append(list_entry);
        // Set up ID's for header and corresponding TOC element
        var entry_id = $(current_header).prop("tagName") + "_" + i;
        $(current_header).attr('id', entry_id);
        list_entry.attr('id', "toc_" + entry_id);
        // Create link
        var entry_link = $('<a></a>').attr('href', "#" + entry_id);
        list_entry.append(entry_link);
        // Set TOC entry content
        entry_link.text($(current_header).text());
    }
}

function update_toc_highlight() {
    var all_headers = $('h1, h2, h3, h4, h5, h6');
    var scroll = $(document).scrollTop();
    var highlight_id = null;
    for (var i = 0; i < all_headers.length; i++) {
        var current_element = all_headers[i];
        var toc_id = '#toc_' + $(current_element).attr('id');
        var elem_ypos = $(current_element).offset().top;
        if (elem_ypos < scroll + 10) {
            highlight_id = toc_id;
        }
        $(toc_id).removeClass('active');
    }
    // Only highlight *last* element that is above the window's scroll position.
    $(highlight_id).addClass('active');

}

$(document).ready(create_toc);
$(window).scroll(update_toc_highlight)
