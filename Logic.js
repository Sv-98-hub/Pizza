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

// 4. Mouse Control (Physics Dragging)
const mouse = Mouse.create(render.canvas);
const mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
        stiffness: 0.1, 
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
    
    // Play appropriate sound
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
        frictionAir: 0.04, // Heavier feel
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

// 6. TAP TO DELETE (EAT) MECHANIC
let mousedownPos = { x: 0, y: 0 };

// Capture where the click started
render.canvas.addEventListener('mousedown', () => {
    mousedownPos = { x: mouse.position.x, y: mouse.position.y };
});

// Check on mouseup if it was a tap or a drag
render.canvas.addEventListener('mouseup', () => {
    const mouseupPos = mouse.position;
    
    // Calculate distance between press and release
    const dist = Math.sqrt(
        Math.pow(mouseupPos.x - mousedownPos.x, 2) + 
        Math.pow(mouseupPos.y - mousedownPos.y, 2)
    );

    // If moved less than 10 pixels, consider it a "Tap" to eat
    if (dist < 10) {
        const tappedBodies = Query.point(items, mouseupPos);
        
        if (tappedBodies.length > 0) {
            const target = tappedBodies[0];
            
            // Play Eating Sound
            eatSound.currentTime = 0;
            eatSound.play().catch(() => {});
            
            // DELETE ITSELF
            Composite.remove(world, target);
            items = items.filter(item => item !== target);
            
            // Hide delete button if screen is empty
            if (items.length === 0) {
                deleteBtn.style.display = 'none';
            }
        }
    }
});

// 7. Delete All Logic
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
});    mouse: mouse,
    constraint: {
        stiffness: 0.1, // Smooth dragging
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
    
    // Fixed Sound Logic: Explicitly check emoji value
    if (selectedFood === "🍕") {
        pizzaSound.currentTime = 0;
        pizzaSound.play().catch(e => console.log("Sound error:", e));
    } else if (selectedFood === "🍔") {
        burgerSound.currentTime = 0;
        burgerSound.play().catch(e => console.log("Sound error:", e));
    } else if (selectedFood === "🌮") {
        tacoSound.currentTime = 0;
        tacoSound.play().catch(e => console.log("Sound error:", e));
    }

    const size = 65;
    const x = Math.random() * (window.innerWidth - size) + size / 2;
    const y = -size;

    const foodItem = Bodies.circle(x, y, size / 2, {
        restitution: 0.4,
        friction: 0.2,
        frictionAir: 0.03, // Prevent items from flinging too fast
        label: 'food',
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

// 6. IMPROVED EAT MECHANIC
// We listen for the 'mousedown' (start click) and 'mouseup' (end click) 
// to see if you just clicked without moving the mouse too much.
let startPos = { x: 0, y: 0 };

render.canvas.addEventListener('mousedown', () => {
    startPos = { x: mouse.position.x, y: mouse.position.y };
});

render.canvas.addEventListener('mouseup', () => {
    const endPos = mouse.position;
    const dist = Math.sqrt(Math.pow(endPos.x - startPos.x, 2) + Math.pow(endPos.y - startPos.y, 2));

    // If the movement was small (less than 10 pixels), it's a tap/click, not a drag!
    if (dist < 10) {
        const clickedBodies = Query.point(items, endPos);
        if (clickedBodies.length > 0) {
            const target = clickedBodies[0];
            
            // Play Eat Sound
            eatSound.currentTime = 0;
            eatSound.play().catch(() => {});
            
            // Remove from physics and internal list
            Composite.remove(world, target);
            items = items.filter(item => item !== target);
            
            if (items.length === 0) {
                deleteBtn.style.display = 'none';
            }
        }
    }
});

// 7. Delete All Logic
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
});    mouse: mouse,
    constraint: {
        stiffness: 0.05, // Much lower stiffness for smoother dragging
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
        frictionAir: 0.02, // Added air friction so it doesn't fly away too fast
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

// 6. Eat Mechanic (Click/Tap to Eat)
// We detect a click that isn't a drag
let lastClickTime = 0;
render.canvas.addEventListener('mousedown', (event) => {
    const mousePosition = mouse.position;
    // Find if we clicked on any food items
    const bodies = items;
    const clickedBodies = Query.point(bodies, mousePosition);

    if (clickedBodies.length > 0) {
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
