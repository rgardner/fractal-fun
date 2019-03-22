const NUM_WORKERS = 8;
var workers = [];
/** @type ImageData */
var rowData;
var nextRow = 0;
var generation = 0;

window.onload = init;

function init() {
  setupGraphics();

  canvas.onclick = function(event) {
    handleClick(event.clientX, event.clientY, event.shiftKey);
  };

  window.onresize = function() {
    resizeToWindow();
  };

  // Populate workers array with initialized workers.
  for (var i = 0; i < NUM_WORKERS; i++) {
    var worker = new Worker("worker.js");

    worker.onmessage = function(event) {
      processWork(event.target, event.data);
    };

    worker.idle = true;
    workers.push(worker);
  }

  startWorkers();
}

/**
 * Resets the workers to start working at the top of the fractal.
 *
 * Loops through all the workers in the workers array and assigns each worker a
 * task to compute a row.
 */
function startWorkers() {
  generation++;
  nextRow = 0;
  for (var i = 0; i < workers.length; i++) {
    var worker = workers[i];
    if (worker.idle) {
      const task = createTask(nextRow);
      worker.idle = false;
      worker.postMessage(task);
      nextRow++;
    }
  }
}

/**
 * Draws the worker results if still needed.
 *
 * If a new fractal generation has been requested, then discard these worker
 * results.
 * @param {Worker} worker
 * @param {any} workerResults
 */
function processWork(worker, workerResults) {
  if (workerResults.generation === generation) {
    drawRow(workerResults);
  }
  reassignWorker(worker);
}

/**
 * Gives an idle worker its next task.
 * @param {!Worker} worker
 */
function reassignWorker(worker) {
  var row = nextRow++;
  if (row >= canvas.height) {
    worker.idle = true;
  } else {
    const task = createTask(row);
    worker.idle = false;
    worker.postMessage(task);
  }
}

/**
 * Sets new parameters for fractals and starts the workers.
 * @param {number} x X position where the user clicked
 * @param {number} y Y position where the user clicked
 * @param {boolean} shiftKey Was the shift key held down?
 */
function handleClick(x, y, shiftKey) {
  if (shiftKey) {
    zoomOut(x, y);
  } else {
    zoomIn(x, y);
  }
}

/**
 * @param {number} x X position where the user clicked
 * @param {number} y Y position where the user clicked
 */
function zoomIn(x, y) {
  const width = r_max - r_min;
  const height = i_min - i_max;
  const click_r = r_min + (width * x) / canvas.width;
  const click_i = i_max + (height * y) / canvas.height;

  const zoom = 8;

  r_min = click_r - width / zoom;
  r_max = click_r + width / zoom;
  i_max = click_i - height / zoom;
  i_min = click_i + height / zoom;

  startWorkers();
}

/**
 * @param {number} x X position where the user clicked
 * @param {number} y Y position where the user clicked
 */
function zoomOut(x, y) {
  const width = r_max - r_min;
  const height = i_min - i_max;
  const click_r = r_min + (width * x) / canvas.width;
  const click_i = i_max + (height * y) / canvas.height;

  const zoom = 2;

  r_min = click_r - width * zoom;
  r_max = click_r + width * zoom;
  i_max = click_i - height * zoom;
  i_min = click_i + height * zoom;

  startWorkers();
}

/**
 * Resizes the canvas, resets fractal parameters, and runs the workers.
 *
 * Changes the extent of the boundary and maintains the new aspect ratio of the
 * window.
 */
function resizeToWindow() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  var width = ((i_max - i_min) * canvas.width) / canvas.height;
  var r_mid = (r_max + r_min) / 2;
  r_min = r_mid - width / 2;
  r_max = r_mid + width / 2;
  rowData = ctx.createImageData(canvas.width, 1);

  startWorkers();
}
