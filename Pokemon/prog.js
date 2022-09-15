window.onload = function () {

    const queryString = window.location.search;
    const params = new URLSearchParams(queryString);
    const NB_COLORS = params.has('nb_generations') ? parseInt(params.get('nb_generations'), 10) : 4;
    const THRESHOLD = params.has('threshold') ? parseInt(params.get('threshold'), 10) : 3;

    const COLORMAP = [];
    for (let i = 0; i < NB_COLORS; i++) {
        const val = (i * 511) / (NB_COLORS - 1);
        const r = Math.floor(Math.min(255, val));
        const g = Math.floor(Math.max(val - 256, 0));
        const b = 0;
        COLORMAP[i] = { 'r': r, 'g': g, 'b': b };
    }

    const KERNEL = [
        1, 1, 1,
        1, 0, 1,
        1, 1, 1,
        ];

    // Get the canvas and context
    const canvas = document.getElementById("viewport");
    canvas.width = params.has('width') ? parseInt(params.get('width'), 10) : (window.innerWidth - 0);
    canvas.height = params.has('height') ? parseInt(params.get('height'), 10) : (window.innerHeight - 0);
    const imagew = canvas.width;
    const imageh = canvas.height;
    const context = canvas.getContext("2d");
    const imagedata = context.createImageData(imagew, imageh);

    const cell = new Array(imagew * imageh);

    // Initialize the arena
    function init() {
        for (let i = 0; i < imageh * imagew; i++) {
            cell[i] = Math.floor(Math.random() * NB_COLORS);
        }
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
                    if (nextV === NB_COLORS) nextV = 0;
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

    function main() {
        window.requestAnimationFrame(main);
    
        evolve();
        generateImage();

        context.putImageData(imagedata, 0, 0);
    }

    init();
    main();
}