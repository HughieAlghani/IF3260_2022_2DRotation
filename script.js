"use strict";

function main() {
    var canvas = document.querySelector("#canvas");
    var gl = canvas.getContext("webgl");
    if (!gl) {
        return;
    }

    var program = webglUtils.createProgramFromScripts(gl, ["vertex-shader-2d", "fragment-shader-2d"]);

    var positionLocation = gl.getAttribLocation(program, "a_position");

    var resolutionLocation = gl.getUniformLocation(program, "u_resolution");
    var colorLocation = gl.getUniformLocation(program, "u_color");
    var translationLocation = gl.getUniformLocation(program, "u_translation");
    var rotationLocation = gl.getUniformLocation(program, "u_rotation");

    var positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    setGeometry(gl);

    var translation = [0, 0];
    var rotation = [0, 1];
    var color = [Math.random(), Math.random(), Math.random(), 1];

    drawScene();

    webglLessonsUI.setupSlider("#x", {value: translation[0], slide: updatePosition(0), max: gl.canvas.width });
    webglLessonsUI.setupSlider("#y", {value: translation[1], slide: updatePosition(1), max: gl.canvas.height});
    webglLessonsUI.setupSlider("#angle", {slide: updateAngle, max: 360});

    function updatePosition(index) {
        return function(event, ui) {
        translation[index] = ui.value;
        drawScene();
        };
    }

    function updateAngle(event, ui) {
        var angleInDegrees = 360 - ui.value;
        var angleInRadians = angleInDegrees * Math.PI / 180;
        rotation[0] = Math.sin(angleInRadians);
        rotation[1] = Math.cos(angleInRadians);
        drawScene();
    }

    function drawScene() {
        webglUtils.resizeCanvasToDisplaySize(gl.canvas);

        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        // Clear canvas.
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.useProgram(program);

        // Turn on the attribute
        gl.enableVertexAttribArray(positionLocation);

        // Bind the position buffer.
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

        var size = 2;          
        var type = gl.FLOAT;   
        var normalize = false; 
        var stride = 0;       
        var offset = 0;        
        gl.vertexAttribPointer(positionLocation, size, type, normalize, stride, offset);

        // set resolution
        gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);

        // set warna
        gl.uniform4fv(colorLocation, color);

        // Set translasi
        gl.uniform2fv(translationLocation, translation);

        // Set rotasi
        gl.uniform2fv(rotationLocation, rotation);

        var primitiveType = gl.TRIANGLES;
        var offset = 0;
        var count = 18; 
        gl.drawArrays(primitiveType, offset, count);
    }
}

function setGeometry(gl) {
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([
            // Kolom kiri
            0, 0,
            30, 0,
            0, 150,
            0, 150,
            30, 0,
            30, 150,

            // baris atas
            30, 0,
            100, 0,
            30, 30,
            30, 30,
            100, 0,
            100, 30,

            // baris tengah
            30, 60,
            67, 60,
            30, 90,
            30, 90,
            67, 60,
            67, 90,
        ]),
        gl.STATIC_DRAW);
}

main();
