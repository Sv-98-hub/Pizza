// 1. Audio Setup
const pizzaSound = new Audio('pizza.mp3');
const burgerSound = new Audio('chezburger.mp3');

// 2. Matter.js Setup
const { Engine, Render, Runner, Bodies, Composite, MouseConstraint, Mouse } = Matter;

const engine = Engine.create();
const world = engine.world;

const render = Render.create({
    element: document.body,
    engine: engine,
    options: {
        width: window.innerWidth,
        height: window.innerHeight,
        wireframes: false,
        background: 'transparent'
    }
});

Render.run(render);
const runner = Runner.create();
Runner.run(runner, engine);

// 3. Boundaries
let ground = Bodies.rectangle(window.innerWidth / 2, window.innerHeight + 25, window.innerWidth, 50, { isStatic: true });
let leftWall = Bodies.rectangle(-25, window.innerHeight / 2, 50, window.innerHeight, { isStatic: true });
let rightWall = Bodies.rectangle(window.innerWidth + 25, window.innerHeight / 2, 50, window.innerHeight, { isStatic: true });
Composite.add(world, [ground, leftWall, rightWall]);

// 4. Mouse Control (Touch/Drag)
const mouse = Mouse.create(render.canvas);
const mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
        stiffness: 0.2,
        render: { visible: false }
    }
});
Composite.add(world, mouseConstraint);
render.mouse = mouse;

// 5. Summon Logic
const summonBtn = document.getElementById('summonBtn');
const deleteBtn = document.getElementById('deleteBtn');
const foodSelector = document.getElementById('foodSelector');
let items = [];

summonBtn.addEventListener('click', () => {
    const selectedFood = foodSelector.value;
    
    // Choose and play the correct sound
    if (selectedFood === "🍕") {
        pizzaSound.currentTime = 0;
        pizzaSound.play().catch(() => {});
    } else if (selectedFood === "🍔") {
        burgerSound.currentTime = 0;
        burgerSound.play().catch(() => {});
    }

    const size = 65;
    const x = Math.random() * (window.innerWidth - size) + size / 2;
    const y = -size;

    const foodItem = Bodies.circle(x, y, size / 2, {
        restitution: 0.5,
        friction: 0.1,
        render: {
            sprite: {
                texture: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="70" height="70" viewBox="0 0 100 100"><text y="75" x="5" font-size="75">${selectedFood}</text></svg>`,
                xScale: 1,
                yScale: 1
            }
        }
    });

    items.push(foodItem);
    Composite.add(world, foodItem);
    deleteBtn.style.display = 'block';
});

// 6. Delete Logic
deleteBtn.addEventListener('click', () => {
    items.forEach(item => Composite.remove(world, item));
    items = [];
    deleteBtn.style.display = 'none';
});

// 7. Handle Resize
window.addEventListener('resize', () => {
    render.canvas.width = window.innerWidth;
    render.canvas.height = window.innerHeight;
    Matter.Body.setPosition(ground, { x: window.innerWidth / 2, y: window.innerHeight + 25 });
    Matter.Body.setPosition(rightWall, { x: window.innerWidth + 25, y: window.innerHeight / 2 });
});

