# Fractal Fun

Experiments with the [Mandelbrot set][mandelbrot]. This is based on the
Mandelbrot exercise in chapter 10 of the the [Head First HTML5
Programming][hfhtml5] book. This project uses [Web Workers][webworkers] to
render the fractal in parallel.

## Getting Started

On Firefox, simply open [`fractal.html`][fractal.html] and it will just
work. For Safari and Chrome, you must run a webserver to work around their
security restrictions:

```sh
make
```

[fractal.html]: src/fractal.html
[hfhtml5]: http://shop.oreilly.com/product/0636920010906.do
[mandelbrot]: https://en.wikipedia.org/wiki/Mandelbrot_set
[webworkers]: https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers
