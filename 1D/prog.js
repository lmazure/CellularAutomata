// see https://mathworld.wolfram.com/TotalisticCellularAutomaton.html

window.onload = function () {

    const COLORMAP = [
        { 'r': 255, 'g': 255, 'b': 255 },
        { 'r': 127, 'g': 127, 'b': 127 },
        { 'r': 0, 'g': 0, 'b': 0 }
    ]

    let seed = 177;
    const VALEUR = [];
    for (var i = 0; i < 7; i++) {
        VALEUR[i] = seed % 3;
        console.log( VALEUR[i]);
        seed= Math.floor(seed / 3);
    }

    const LOOKUP = [];
    LOOKUP[9 * 0 + 3 * 0 + 0] = VALEUR[0];
    LOOKUP[9 * 1 + 3 * 0 + 0] = VALEUR[1];
    LOOKUP[9 * 2 + 3 * 0 + 0] = VALEUR[2];
    LOOKUP[9 * 0 + 3 * 1 + 0] = VALEUR[1];
    LOOKUP[9 * 1 + 3 * 1 + 0] = VALEUR[2];
    LOOKUP[9 * 2 + 3 * 1 + 0] = VALEUR[3];
    LOOKUP[9 * 0 + 3 * 2 + 0] = VALEUR[2];
    LOOKUP[9 * 1 + 3 * 2 + 0] = VALEUR[3];
    LOOKUP[9 * 2 + 3 * 2 + 0] = VALEUR[4];
    LOOKUP[9 * 0 + 3 * 0 + 1] = VALEUR[1];
    LOOKUP[9 * 1 + 3 * 0 + 1] = VALEUR[2];
    LOOKUP[9 * 2 + 3 * 0 + 1] = VALEUR[3];
    LOOKUP[9 * 0 + 3 * 1 + 1] = VALEUR[2];
    LOOKUP[9 * 1 + 3 * 1 + 1] = VALEUR[3];
    LOOKUP[9 * 2 + 3 * 1 + 1] = VALEUR[4];
    LOOKUP[9 * 0 + 3 * 2 + 1] = VALEUR[3];
    LOOKUP[9 * 1 + 3 * 2 + 1] = VALEUR[4];
    LOOKUP[9 * 2 + 3 * 2 + 1] = VALEUR[5];
    LOOKUP[9 * 0 + 3 * 0 + 2] = VALEUR[2];
    LOOKUP[9 * 1 + 3 * 0 + 2] = VALEUR[3];
    LOOKUP[9 * 2 + 3 * 0 + 2] = VALEUR[4];
    LOOKUP[9 * 0 + 3 * 1 + 2] = VALEUR[3];
    LOOKUP[9 * 1 + 3 * 1 + 2] = VALEUR[4];
    LOOKUP[9 * 2 + 3 * 1 + 2] = VALEUR[5];
    LOOKUP[9 * 0 + 3 * 2 + 2] = VALEUR[4];
    LOOKUP[9 * 1 + 3 * 2 + 2] = VALEUR[5];
    LOOKUP[9 * 2 + 3 * 2 + 2] = VALEUR[6];

    const canvas = document.getElementById("viewport");
    const width = canvas.width;
    const nbGenerations = canvas.height;
    const context = canvas.getContext("2d");
    const imagedata = context.createImageData(width, nbGenerations);

    function defineFirstGenerationPopulationalize(cells) {
        for (var x = 0; x < width; x++) {
            cells[x] = 0;
        }
        cells[width / 2] = 1;
        drawLine(cells, 0)
    }

    function computeNextGeneration(cells, generation) {
        const newCells = new Array(width);
        for (let x = 0; x < width; x++) {
            let beforeX = x - 1;
            if (beforeX == -1) beforeX = width - 1;
            let afterX = x + 1;
            if (afterX == width) afterX = 0;
            newCells[x] = LOOKUP[9 * cells[beforeX] + 3 * cells[x] + cells[afterX]];
        }

        for (let x = 0; x < width; x++) {
            cells[x] = newCells[x];
        }

        drawLine(cells, generation);
    }

    function drawLine(cells, generation) {
        for (var x = 0; x < width; x++) {
            const cellValue = cells[x];
            const pixelindex = (generation * width + x) * 4;
            imagedata.data[pixelindex] = COLORMAP[cellValue].r;
            imagedata.data[pixelindex + 1] = COLORMAP[cellValue].g;
            imagedata.data[pixelindex + 2] = COLORMAP[cellValue].b;
            imagedata.data[pixelindex + 3] = 255;
        }
    }

    function draw() {
        context.putImageData(imagedata, 0, 0);
    }

    const cells = new Array(width);

    defineFirstGenerationPopulationalize(cells);
    
    for (var g = 1; g <= nbGenerations; g++) {
        computeNextGeneration(cells, g)
    }

    window.requestAnimationFrame(draw);
}






























function evolve() {
    const newGeneration = new Array(imagew * imageh);
    for (let y = 0; y < imageh; y++) {
        let beforeY = y - 1;
        if (beforeY == -1) beforeY = imageh - 1;
        let afterY = y + 1;
        if (afterY == imageh) afterY = 0;
        for (let x = 0; x < imagew; x++) {
            let beforeX = x - 1;
            if (beforeX == -1) beforeX = imagew - 1;
            let afterX = x + 1;
            if (afterX == imagew) afterX = 0;
                const v = cell[y * imagew + x];
                let nextV = v + 1;
                if (nextV === NBCOLORS) nextV = 0;
                let total = 0;
                if (cell[beforeY * imagew + beforeX] === nextV) total += KERNEL[0];
                if (cell[beforeY * imagew +       x] === nextV) total += KERNEL[1];
                if (cell[beforeY * imagew +  afterX] === nextV) total += KERNEL[2];
                if (cell[      y * imagew + beforeX] === nextV) total += KERNEL[3];
                if (cell[      y * imagew +       x] === nextV) total += KERNEL[4];
                if (cell[      y * imagew +  afterX] === nextV) total += KERNEL[5];
                if (cell[ afterY * imagew + beforeX] === nextV) total += KERNEL[6];
                if (cell[ afterY * imagew +       x] === nextV) total += KERNEL[7];
                if (cell[ afterY * imagew +  afterX] === nextV) total += KERNEL[8];
                if (total >= THRESHOLD) {
                    newGeneration[y * imagew + x] = nextV;
                } else {
                    newGeneration[y * imagew + x] = v;
                }
        }
    }

    for (let i = 0; i < imageh * imagew; i++) {
        cell[i] = newGeneration[i];
    }
}

// Generate the image
function generateImage() {
    // Iterate over the pixels
    for (var y = 0; y < imageh; y++) {
        for (var x = 0; x < imagew; x++) {
            const cellValue = cell[y * imagew + x];
            const pixelindex = (y * imagew + x) * 4;
            imagedata.data[pixelindex] = COLORMAP[cellValue].r;
            imagedata.data[pixelindex + 1] = COLORMAP[cellValue].g;
            imagedata.data[pixelindex + 2] = COLORMAP[cellValue].b;
            imagedata.data[pixelindex + 3] = 255;
        }
    }
}