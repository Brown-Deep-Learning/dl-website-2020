// var root = 'http://cs.brown.edu/courses/cs1470/';
var root = '';

// function randomBowtie(img) {
//     var num_bowties = 5;
//     var i = Math.floor(Math.random() * num_bowties) + 1;
//     img.src = root + "img/bowties/bowties_" + i + ".png";
// }

function randomBowtie(img) {
    var num_bowties = 7;
    var i = Math.floor(Math.random() * num_bowties) + 1;
    img.src = root + 'assets/sparkles/sparkle' + i + '.png';
}

window.onload = function () {
    var img_elements = document.getElementsByClassName('random-earmuffs');
    for (var i = 0; i < img_elements.length; i++) {
        randomBowtie(img_elements[i]);
        img_elements[i].style.visibility = 'visible';
    }
};
