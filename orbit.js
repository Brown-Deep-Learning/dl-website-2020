
// credit for orbiting equations to https://nbodyphysics.com/blog/2016/05/29/planetary-orbits-in-javascript/
const NUM_PLANETS = 7;
const ORBIT_PADDING = 20;
const LARGEST_BODY_LENGTH = 50;
const LOOP_LIMIT = 100000;
const m = 0.5;
const e = 0.00001;
let container_dims = {};

const random = (min, max) => {
    return min + Math.random() * (max - min);
};

window.onresize = () => {
    container_dims = document.getElementById('orbit-container').getBoundingClientRect();
    for (let i = 0; i < NUM_PLANETS; i++) {
        document.getElementById(`orbit${i + 1}`).style.top = `${container_dims.height / 2}px`
    }
}

window.onload = () => {
    container_dims = document.getElementById('orbit-container').getBoundingClientRect();

    const timestepOffset = random(3800, 4000);

    for (let i = 0; i < NUM_PLANETS; i++) {
        const bodyLength = LARGEST_BODY_LENGTH * ((i + 1) / (NUM_PLANETS)) + 30;
        const planet = document.createElement("img");
        planet.id = `orbit${i + 1}`;
        planet.src = `assets/planets/${i + 1}.png`;
        planet.height = bodyLength;
        planet.width = i === 5 ? bodyLength * 1.5 : bodyLength; // account for saturn lol
        planet.style = `position: absolute; top: ${container_dims.height / 2}px; left: 0; right: 0; margin: auto; opacity: 0.8;`;
        planet.draggable = false;
        document.getElementById('orbit-container').appendChild(planet);
        orbitBody(
            `orbit${i + 1}`,
            timestepOffset * i,
            bodyLength,
        );
    }
}

function orbitBody(id, time = 0, bodyLength) {
    const a = container_dims.height / 2 - bodyLength / 2;
    const horizontalStretch = (container_dims.width / 2 - bodyLength / 2 - ORBIT_PADDING) / a;
    const verticalStretch = (container_dims.height / 2 - bodyLength / 2 - ORBIT_PADDING) / a;
    const focus_x = 0;
    const focus_y = -bodyLength / 2;
    const orbitPeriod = 2.0 * Math.PI * Math.sqrt(Math.pow(a, 3) / (Math.pow(m, 2))); // G=1

    // 1) find the relative time in the orbit and convert to Radians
    const M = 2.0 * Math.PI * (time) / orbitPeriod;

    // 2) Seed with mean anomaly and solve Kepler's eqn for E
    let u = M; // seed with mean anomoly
    let u_next = 0;
    let loopCount = 0;
    // iterate until within 10-6
    while (loopCount++ < LOOP_LIMIT) {
        // this should always converge in a small number of iterations - but be paranoid
        u_next = u + (M - (u - e * Math.sin(u))) / (1 - e * Math.cos(u));
        if (Math.abs(u_next - u) < 1E-6)
            break;
        u = u_next;
    }

    const cos_f = (Math.cos(u) - e) / (1 - e * Math.cos(u));
    const sin_f = (Math.sqrt(1 - e * e) * Math.sin(u)) / (1 - e * Math.cos(u));
    const r = a * (1 - e * e) / (1 + e * cos_f);

    // animate
    const position_x = horizontalStretch * (focus_x + r * cos_f);
    const position_y = verticalStretch * (focus_y + r * sin_f);
    document.getElementById(id).style.transform = `translate(${position_x}px, ${position_y}px)`;

    time = time + 1;
    requestAnimationFrame(() => orbitBody(id, time, bodyLength));
}