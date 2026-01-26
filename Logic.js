// 1. Audio Setup
const pizzaSound = new Audio('pizza.mp3');

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

// 4. Mouse Control (Making things touchable)
const mouse = Mouse.create(render.canvas);
const mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
        stiffness: 0.2,
        render: { visible: false }
    }
});

Composite.add(world, mouseConstraint);
// Keep the mouse in sync with rendering
render.mouse = mouse;

// 5. Summon Logic
const summonBtn = document.getElementById('summonBtn');
const deleteBtn = document.getElementById('deleteBtn');
let pizzas = [];

summonBtn.addEventListener('click', () => {
    pizzaSound.currentTime = 0;
    pizzaSound.play().catch(() => {});

    const size = 60;
    const x = Math.random() * window.innerWidth;
    const y = -size;

    const pizza = Bodies.circle(x, y, size / 2, {
        restitution: 0.6,
        friction: 0.1,
        render: {
            sprite: {
                texture: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 100 100"><text y="80" font-size="80">🍕</text></svg>`,
                xScale: 1,
                yScale: 1
            }
        }
    });

    pizzas.push(pizza);
    Composite.add(world, pizza);
    deleteBtn.style.display = 'block';
});

// 6. Delete Logic
deleteBtn.addEventListener('click', () => {
    pizzas.forEach(p => Composite.remove(world, p));
    pizzas = [];
    deleteBtn.style.display = 'none';
});

// 7. Handle Resize
window.addEventListener('resize', () => {
    render.canvas.width = window.innerWidth;
    render.canvas.height = window.innerHeight;
    Matter.Body.setPosition(ground, { x: window.innerWidth / 2, y: window.innerHeight + 25 });
    Matter.Body.setPosition(rightWall, { x: window.innerWidth + 25, y: window.innerHeight / 2 });
});// 5. Summon Pizza Function
function summonPizza() {
    // Play sound effect
    pizzaSound.currentTime = 0; 
    pizzaSound.play().catch(err => console.log("Audio waiting for interaction"));

    const size = 50;
    const randomX = Math.random() * window.innerWidth;
    const startY = -size;

    const pizzaBody = Bodies.circle(randomX, startY, size / 2, {
        restitution: 0.6,
        friction: 0.1,
        render: {
            sprite: {
                // Inline SVG to represent the pizza emoji
                texture: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 100 100"><text y="80" font-size="80">🍕</text></svg>`,
                xScale: 1,
                yScale: 1
            }
        }
    });

    pizzas.push(pizzaBody);
    Composite.add(world, pizzaBody);

    // Show delete button on first summon
    if (pizzas.length > 0) {
        deleteBtn.style.display = 'block';
    }
}

// 6. Delete Pizzas Function
function clearAllPizzas() {
    pizzas.forEach(pizza => {
        Composite.remove(world, pizza);
    });
    pizzas = [];
    deleteBtn.style.display = 'none';
}

// 7. Event Listeners
summonBtn.addEventListener('click', summonPizza);
deleteBtn.addEventListener('click', clearAllPizzas);

window.addEventListener('resize', () => {
    render.canvas.width = window.innerWidth;
    render.canvas.height = window.innerHeight;
    
    // Reposition boundaries on window resize
    Matter.Body.setPosition(ground, { x: window.innerWidth / 2, y: window.innerHeight + 25 });
    Matter.Body.setPosition(rightWall, { x: window.innerWidth + 25, y: window.innerHeight / 2 });
});
