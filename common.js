// keeps navbar visible at all times no matter how much the window is scrolled
window.onscroll = function() {
    var header = document.getElementsByTagName("header")[0];
    var nav = document.getElementById('navbar');
    var top = header.clientHeight - nav.clientHeight;
    if (window.pageYOffset >= top) {
        nav.classList.add('fixed');
        nav.style["background-position-y"] = (-top + "px");
    } else {
        nav.classList.remove('fixed');
    }
};

// handles clicks on mobile menu
function toggleMobileMenu(element) {
    element.classList.toggle('menu-open');
    document.querySelectorAll('.nav-link').forEach(link => {
        if (element.classList.contains('menu-open')) {
            link.style.display = 'block';
        } else {
            link.style.display = 'none';
        }
    })
}


// Automatically release assignments and labs on website
function hideAssignmentContent(hwNumber) {
    const baseSelector = `.hw${hwNumber}-content`;

    // hide content on assignment page
    $(`main${baseSelector}`).css('text-align', 'center').html(
        '<h1>This assignment is not released yet!</h1>'
    );

    // disable links in assignments page
    $(`${baseSelector} a`).removeAttr("href").css({
        'text-decoration': 'none',
        'color': 'inherit',
        'cursor': 'not-allowed',
        'pointer-events': 'none',
    });
}
function hideLabContent(labNumber) {
    const baseSelector = `.lab${labNumber}-content`;

    // disable links in lab page
    $(`${baseSelector} a`).removeAttr("href").css({
        'text-decoration': 'none',
        'color': 'inherit',
        'cursor': 'not-allowed',
        'pointer-events': 'none',
    });
}
$(document).ready(function() {
    // disable assignment hiding until after the website launch date or if
    // debug search param in url is set
    const currentDate = new Date();
    const searchParams = new URLSearchParams(window.location.search);
    if (currentDate > (new Date('2020-09-08')) && !searchParams.has('debug')) {
        // assignments
        if (currentDate < (new Date('Sep 14 2020 00:00:00 EDT'))) { hideAssignmentContent(1); }
        if (currentDate < (new Date('Sep 28 2020 00:00:00 EDT'))) { hideAssignmentContent(2); }
        if (currentDate < (new Date('Oct 14 2020 00:00:00 EDT'))) { hideAssignmentContent(3); }
        if (currentDate < (new Date('Oct 26 2020 00:00:00 EDT'))) { hideAssignmentContent(4); }
        if (currentDate < (new Date('Nov 04 2020 00:00:00 EST'))) { hideAssignmentContent(5); }
        if (currentDate < (new Date('Nov 13 2020 00:00:00 EST'))) { hideAssignmentContent(6); }
        if (currentDate < (new Date('Nov 24 2020 00:00:00 EST'))) { hideAssignmentContent(7); }
        
        // labs
        if (currentDate < (new Date('Sep 09 2020 00:00:00 EDT'))) { hideLabContent(0); }
        if (currentDate < (new Date('Sep 21 2020 00:00:00 EDT'))) { hideLabContent(1); }
        if (currentDate < (new Date('Sep 28 2020 00:00:00 EDT'))) { hideLabContent(2); }
        if (currentDate < (new Date('Oct 05 2020 00:00:00 EDT'))) { hideLabContent(3); }
        if (currentDate < (new Date('Oct 12 2020 00:00:00 EDT'))) { hideLabContent(4); }
        if (currentDate < (new Date('Oct 19 2020 00:00:00 EDT'))) { hideLabContent(5); }
        if (currentDate < (new Date('Oct 26 2020 00:00:00 EDT'))) { hideLabContent(6); }
        if (currentDate < (new Date('Nov 02 2020 00:00:00 EST'))) { hideLabContent(7); }
        if (currentDate < (new Date('Nov 16 2020 00:00:00 EST'))) { hideLabContent(8); }
        if (currentDate < (new Date('Nov 23 2020 00:00:00 EST'))) { hideLabContent(9); }
    }
});
