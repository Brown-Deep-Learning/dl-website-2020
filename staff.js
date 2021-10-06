
function changeImage(login) {
  const imagePath = `img/hover/${login.id}.jpg`;
  $(login).css(
    'background-image',
    `url(${imagePath}), url(assets/blueno_staff.png)`
  );
}

function restoreImage(login) {
  const imagePath = `img/portrait/${login.id}.jpg`;
  $(login).css(
    'background-image',
    `url(${imagePath}), url(assets/blueno_staff.png)`
  );
}

function createStaffCard(staffObject) {
  let {
    name, login, pronouns, hometown, year, blurb, quote
  } = staffObject;

  // Formatting and seeting defaults
  pronouns = pronouns.toLowerCase();
  if (hometown === '') { hometown = 'Earth'; }
  if (year === '') { year = 'The future'; }
  if (blurb === '') { blurb = `I'm a human on planet Earth!`; }
  if (quote === '') { quote = 'The world may never know!'; }

  const imagePath = `img/portrait/${login}.jpg`;
  return (`
    <div class="staff">
      <div class="staff-img-container">
        <div
          id=${login}
          class="staff-pic"
          style="background-image:url(${imagePath}), url(assets/blueno_staff.png)"
          alt="${name} is doing something fun!"
          onmouseover="changeImage(this)"
          onmouseout="restoreImage(this)" >
        </div>
      </div>
      <div class="staff-text">
        <p><strong>${name}</strong> (${login}) </p>
        <p><strong>Pronouns:</strong> ${pronouns} </p>
        <p><strong>Year:</strong> ${year} </p>
        <p><strong>Hometown:</strong> ${hometown} </p>
        <p><strong>About:</strong> ${blurb} </p>
        <p><strong>What will Blueno do in space?</strong> ${quote} </p>
      </div>
    </div>
  `);
}

$(document).ready(function () {
  const instructors = ['dritchi1'];
  const htas = ['kdu3', 'bblinn', 'glee43', 'kpal1'];
  $.ajax({
    type: "GET",
    url: "./staff_info.csv",
    dataType: "text",
    success: function (response) {
      const table = $.csv.toArrays(response).splice(1);
      table.forEach(row => {
        const [name, login, email, pronouns, hometown, year, blurb, quote] = row;
        const staffObject = { name, login, email, pronouns, hometown, year, blurb, quote };
        if (instructors.includes(login)) {
          $('#instructors').append(createStaffCard(staffObject));
        } else if (htas.includes(login)) {
          $('#htas').append(createStaffCard(staffObject));
        } else {
          $('#tas').append(createStaffCard(staffObject));
        }
      });
    }
  });
});
