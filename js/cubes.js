// Simple rotating cubes scene, pure WebGL (no libraries)
(function () {
  const canvas = document.getElementById('foid');
  if (!canvas) return;

  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  if (!gl) {
    console.warn('WebGL not supported');
    return;
  }

  // ---------- Shaders ----------
  const vsSource = `
    attribute vec3 aPosition;
    attribute vec3 aColor;

    uniform mat4 uModel;
    uniform mat4 uView;
    uniform mat4 uProjection;

    varying vec3 vColor;
    varying vec3 vNormalShade;

    void main() {
      vColor = aColor;
      // crude face-based shading using position as a stand-in normal direction
      vNormalShade = normalize(aPosition);
      gl_Position = uProjection * uView * uModel * vec4(aPosition, 1.0);
    }
  `;

  const fsSource = `
    precision mediump float;
    varying vec3 vColor;
    varying vec3 vNormalShade;

    void main() {
      float light = 0.55 + 0.45 * max(dot(vNormalShade, normalize(vec3(0.5, 0.8, 0.6))), 0.0);
      gl_FragColor = vec4(vColor * light, 1.0);
    }
  `;

  function compileShader(type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  const vertexShader = compileShader(gl.VERTEX_SHADER, vsSource);
  const fragmentShader = compileShader(gl.FRAGMENT_SHADER, fsSource);

  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error(gl.getProgramInfoLog(program));
    return;
  }
  gl.useProgram(program);

  const aPosition = gl.getAttribLocation(program, 'aPosition');
  const aColor = gl.getAttribLocation(program, 'aColor');
  const uModel = gl.getUniformLocation(program, 'uModel');
  const uView = gl.getUniformLocation(program, 'uView');
  const uProjection = gl.getUniformLocation(program, 'uProjection');

  // ---------- Cube geometry ----------
  // 24 vertices (4 per face x 6 faces) so each face can have a flat color
  const positions = new Float32Array([
    // front (z+)
    -1,-1, 1,  1,-1, 1,  1, 1, 1, -1, 1, 1,
    // back (z-)
    -1,-1,-1, -1, 1,-1,  1, 1,-1,  1,-1,-1,
    // top (y+)
    -1, 1,-1, -1, 1, 1,  1, 1, 1,  1, 1,-1,
    // bottom (y-)
    -1,-1,-1,  1,-1,-1,  1,-1, 1, -1,-1, 1,
    // right (x+)
     1,-1,-1,  1, 1,-1,  1, 1, 1,  1,-1, 1,
    // left (x-)
    -1,-1,-1, -1,-1, 1, -1, 1, 1, -1, 1,-1,
  ]);

  function faceColor(r, g, b) {
    return [r, g, b, r, g, b, r, g, b, r, g, b];
  }

  const colors = new Float32Array([
    ...faceColor(0.95, 0.35, 0.55), // front  - pink
    ...faceColor(0.35, 0.65, 0.95), // back   - blue
    ...faceColor(0.55, 0.90, 0.55), // top    - green
    ...faceColor(0.95, 0.80, 0.30), // bottom - yellow
    ...faceColor(0.75, 0.45, 0.95), // right  - purple
    ...faceColor(0.95, 0.55, 0.30), // left   - orange
  ]);

  const indices = new Uint16Array([
    0,1,2,  0,2,3,       // front
    4,5,6,  4,6,7,       // back
    8,9,10, 8,10,11,     // top
    12,13,14, 12,14,15,  // bottom
    16,17,18, 16,18,19,  // right
    20,21,22, 20,22,23,  // left
  ]);

  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

  const colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);

  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

  gl.enableVertexAttribArray(aPosition);
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, 0, 0);

  gl.enableVertexAttribArray(aColor);
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, 0, 0);

  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.CULL_FACE);

  // ---------- Minimal matrix math (column-major, like GLSL) ----------
  function mat4Identity() {
    return new Float32Array([1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1]);
  }

  function mat4Multiply(a, b) {
    const out = new Float32Array(16);
    for (let col = 0; col < 4; col++) {
      for (let row = 0; row < 4; row++) {
        let sum = 0;
        for (let k = 0; k < 4; k++) {
          sum += a[k * 4 + row] * b[col * 4 + k];
        }
        out[col * 4 + row] = sum;
      }
    }
    return out;
  }

  function mat4Perspective(fovy, aspect, near, far) {
    const f = 1.0 / Math.tan(fovy / 2);
    const out = mat4Identity();
    out[0] = f / aspect;
    out[5] = f;
    out[10] = (far + near) / (near - far);
    out[11] = -1;
    out[14] = (2 * far * near) / (near - far);
    out[15] = 0;
    return out;
  }

  function mat4Translate(x, y, z) {
    const out = mat4Identity();
    out[12] = x; out[13] = y; out[14] = z;
    return out;
  }

  function mat4RotateX(a) {
    const c = Math.cos(a), s = Math.sin(a);
    const out = mat4Identity();
    out[5] = c; out[6] = s; out[9] = -s; out[10] = c;
    return out;
  }

  function mat4RotateY(a) {
    const c = Math.cos(a), s = Math.sin(a);
    const out = mat4Identity();
    out[0] = c; out[2] = -s; out[8] = s; out[10] = c;
    return out;
  }

  function mat4Scale(s) {
    const out = mat4Identity();
    out[0] = s; out[5] = s; out[10] = s;
    return out;
  }

  // ---------- Cube instances ----------
  const cubes = [
    { x: -2.4, y:  0.8, scale: 0.7, speedX: 0.6,  speedY: 0.9 },
    { x:  0.0, y: -0.4, scale: 1.0, speedX: 0.4,  speedY: -0.7 },
    { x:  2.5, y:  0.6, scale: 0.6, speedX: -0.8, speedY: 0.5 },
    { x: -1.0, y: -1.6, scale: 0.5, speedX: 0.9,  speedY: -0.4 },
    { x:  1.4, y: -1.7, scale: 0.55,speedX: -0.5, speedY: 0.8 },
  ];

  function resize() {
    const parent = canvas.parentElement;
    const w = parent ? parent.clientWidth : window.innerWidth;
    const h = parent ? parent.clientHeight : window.innerHeight;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.max(1, Math.floor(w * dpr));
    canvas.height = Math.max(1, Math.floor(h * dpr));
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    gl.viewport(0, 0, canvas.width, canvas.height);
  }

  window.addEventListener('resize', resize);
  resize();

  const projectionLoc = uProjection;
  let lastTime = 0;

  function render(time) {
    const t = time * 0.001;
    const dt = lastTime ? t - lastTime : 0;
    lastTime = t;

    gl.clearColor(0.06, 0.06, 0.09, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const aspect = canvas.width / canvas.height || 1;
    const projection = mat4Perspective(Math.PI / 4, aspect, 0.1, 100);
    const view = mat4Translate(0, 0, -8);

    gl.uniformMatrix4fv(projectionLoc, false, projection);
    gl.uniformMatrix4fv(uView, false, view);

    cubes.forEach((cube) => {
      cube.rotX = (cube.rotX || 0) + cube.speedX * dt;
      cube.rotY = (cube.rotY || 0) + cube.speedY * dt;

      let model = mat4Translate(cube.x, cube.y, 0);
      model = mat4Multiply(model, mat4RotateY(cube.rotY));
      model = mat4Multiply(model, mat4RotateX(cube.rotX));
      model = mat4Multiply(model, mat4Scale(cube.scale));

      gl.uniformMatrix4fv(uModel, false, model);
      gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
    });

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
})();