// 1. Audio Setup
const pizzaSound = new Audio('pizza.mp3');
const burgerSound = new Audio('chezburger.mp3');
const tacoSound = new Audio('taco.mp3');
const eatSound = new Audio('eating.mp3');

// 2. Matter.js Setup
const { Engine, Render, Runner, Bodies, Composite, MouseConstraint, Mouse, Query } = Matter;

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

// 4. Mode & Food Elements
const modeSelector = document.getElementById('modeSelector');
const foodSelector = document.getElementById('foodSelector');
const summonBtn = document.getElementById('summonBtn');
const deleteBtn = document.getElementById('deleteBtn');

let currentMode = 'drag';
let items = [];

// Handle Mode Change from Dropdown
modeSelector.addEventListener('change', (e) => {
    currentMode = e.target.value;
    if (currentMode === 'drag') {
        mouseConstraint.collisionFilter.mask = 0xFFFFFFFF; // Enable grabbing
    } else {
        mouseConstraint.collisionFilter.mask = 0x00000000; // Disable grabbing for eating
    }
});

// 5. Mouse Interaction
const mouse = Mouse.create(render.canvas);
const mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
        stiffness: 0.08, 
        render: { visible: false }
    }
});
Composite.add(world, mouseConstraint);
render.mouse = mouse;

// 6. Summon Logic
summonBtn.addEventListener('click', () => {
    const selectedFood = foodSelector.value;
    
    // Play correct summon sound
    if (selectedFood === "🍕") {
        pizzaSound.currentTime = 0;
        pizzaSound.play().catch(() => {});
    } else if (selectedFood === "🍔") {
        burgerSound.currentTime = 0;
        burgerSound.play().catch(() => {});
    } else if (selectedFood === "🌮") {
        tacoSound.currentTime = 0;
        tacoSound.play().catch(() => {});
    }

    const size = 65;
    const x = Math.random() * (window.innerWidth - size) + size / 2;
    const y = -size;

    const foodItem = Bodies.circle(x, y, size / 2, {
        restitution: 0.4,
        friction: 0.2,
        frictionAir: 0.04,
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

// 7. Eat Mechanic (Click/Tap on canvas)
render.canvas.addEventListener('mousedown', () => {
    if (currentMode === 'eat') {
        const tappedBodies = Query.point(items, mouse.position);
        if (tappedBodies.length > 0) {
            const target = tappedBodies[0];
            
            eatSound.currentTime = 0;
            eatSound.play().catch(() => {});
            
            Composite.remove(world, target);
            items = items.filter(item => item !== target);
            
            if (items.length === 0) {
                deleteBtn.style.display = 'none';
            }
        }
    }
});

// 8. Clear All
deleteBtn.addEventListener('click', () => {
    items.forEach(item => Composite.remove(world, item));
    items = [];
    deleteBtn.style.display = 'none';
});

// 9. Resize Handling
window.addEventListener('resize', () => {
    render.canvas.width = window.innerWidth;
    render.canvas.height = window.innerHeight;
    Matter.Body.setPosition(ground, { x: window.innerWidth / 2, y: window.innerHeight + 25 });
    Matter.Body.setPosition(rightWall, { x: window.innerWidth + 25, y: window.innerHeight / 2 });
});const eatModeBtn = document.getElementById('eatModeBtn');

function setMode(mode) {
    currentMode = mode;
    if (mode === 'drag') {
        dragModeBtn.classList.add('active');
        eatModeBtn.classList.remove('active');
        // Enable physics grabbing
        mouseConstraint.collisionFilter.mask = 0xFFFFFFFF;
    } else {
        eatModeBtn.classList.add('active');
        dragModeBtn.classList.remove('active');
        // Disable physics grabbing so we don't drag while eating
        mouseConstraint.collisionFilter.mask = 0x00000000;
    }
}

dragModeBtn.addEventListener('click', () => setMode('drag'));
eatModeBtn.addEventListener('click', () => setMode('eat'));

// 5. Mouse Control (Physics Dragging)
const mouse = Mouse.create(render.canvas);
const mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
        stiffness: 0.08, 
        render: { visible: false }
    }
});
Composite.add(world, mouseConstraint);
render.mouse = mouse;

// 6. Summon Logic
const summonBtn = document.getElementById('summonBtn');
const deleteBtn = document.getElementById('deleteBtn');
const foodSelector = document.getElementById('foodSelector');
let items = [];

summonBtn.addEventListener('click', () => {
    const selectedFood = foodSelector.value;
    
    // Choose sound
    if (selectedFood === "🍕") {
        pizzaSound.currentTime = 0;
        pizzaSound.play().catch(() => {});
    } else if (selectedFood === "🍔") {
        burgerSound.currentTime = 0;
        burgerSound.play().catch(() => {});
    } else if (selectedFood === "🌮") {
        tacoSound.currentTime = 0;
        tacoSound.play().catch(() => {});
    }

    const size = 65;
    const x = Math.random() * (window.innerWidth - size) + size / 2;
    const y = -size;

    const foodItem = Bodies.circle(x, y, size / 2, {
        restitution: 0.4,
        friction: 0.2,
        frictionAir: 0.03,
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

// 7. EAT LOGIC (Active only in Eat Mode)
render.canvas.addEventListener('mousedown', () => {
    if (currentMode === 'eat') {
        const tappedBodies = Query.point(items, mouse.position);
        if (tappedBodies.length > 0) {
            const target = tappedBodies[0];
            
            eatSound.currentTime = 0;
            eatSound.play().catch(() => {});
            
            Composite.remove(world, target);
            items = items.filter(item => item !== target);
            
            if (items.length === 0) {
                deleteBtn.style.display = 'none';
            }
        }
    }
});

// 8. Delete All Logic
deleteBtn.addEventListener('click', () => {
    items.forEach(item => Composite.remove(world, item));
    items = [];
    deleteBtn.style.display = 'none';
});

// 9. Handle Resize
window.addEventListener('resize', () => {
    render.canvas.width = window.innerWidth;
    render.canvas.height = window.innerHeight;
    Matter.Body.setPosition(ground, { x: window.innerWidth / 2, y: window.innerHeight + 25 });
    Matter.Body.setPosition(rightWall, { x: window.innerWidth + 25, y: window.innerHeight / 2 });
}); 0) {
        const target = clickedBodies[0];
        
        // Eat the item
        eatSound.currentTime = 0;
        eatSound.play().catch(() => {});
        
        // Remove from world and array
        Composite.remove(world, target);
        items = items.filter(item => item !== target);
        
        if (items.length === 0) {
            deleteBtn.style.display = 'none';
        }
    }
});

// 7. Delete Logic
deleteBtn.addEventListener('click', () => {
    items.forEach(item => Composite.remove(world, item));
    items = [];
    deleteBtn.style.display = 'none';
});

// 8. Handle Resize
window.addEventListener('resize', () => {
    render.canvas.width = window.innerWidth;
    render.canvas.height = window.innerHeight;
    Matter.Body.setPosition(ground, { x: window.innerWidth / 2, y: window.innerHeight + 25 });
    Matter.Body.setPosition(rightWall, { x: window.innerWidth + 25, y: window.innerHeight / 2 });
});
