const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const tool_buttons = document.querySelectorAll(".tool");
const fill_color = document.getElementById("fill-color");
const size_slider = document.getElementById("size-slider");
const colors = document.querySelectorAll(".colors .option");
const color_picker = document.getElementById("color-picker");
const clear_canvas = document.querySelector(".clear-canvas");
const save_img = document.querySelector(".save-img");

let is_drawing = false;
let brush_width = 5;
let selected_tool = "brush";
let prevMouseX, prevMouseY;
let snapshot;
let radius;
let selected_color = "#000";

const setCanvasBackground = () => {
    //setting whole canvas backgorund to white, so the downloaded image background will be white
    context.fillStyle = "#fff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = selected_color;
}

window.addEventListener("load", () => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    setCanvasBackground();
});

const drawRect = (f) => {
    if(!fill_color.checked){
        return context.strokeRect(f.offsetX, f.offsetY, prevMouseX - f.offsetX, prevMouseY - f.offsetY);
    }
    context.fillRect(f.offsetX, f.offsetY, prevMouseX - f.offsetX, prevMouseY - f.offsetY);
}
const drawCircle = (f) => {
    if(!fill_color.checked){
        
        context.stroke();
    } else{
        context.fill();
    }
    context.beginPath(); //creating new path to draw circle
    radius = Math.sqrt(Math.pow((prevMouseX - f.offsetX), 2) + Math.pow((prevMouseY - f.offsetY), 2))
    context.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI); 
}
const drawTriangle = (f) => {
    context.beginPath(); 
    context.moveTo(prevMouseX, prevMouseY); //moving triangle to the mouse pointer
    context.lineTo(f.offsetX, f.offsetY); //creating first line according to the mouse pointer
    context.lineTo(prevMouseX * 2 - f.offsetX, f.offsetY);  //creating bottom line of triangle
    context.closePath();
    if(!fill_color.checked){
        context.stroke();
    } else{
        context.fill();
    }
}
const start_draw = (f) => {
    is_drawing = true;
    prevMouseX = f.offsetX;
    prevMouseY = f.offsetY;
    context.strokeStyle = selected_color;
    context.fillStyle = selected_color;
    context.beginPath(); //creating new path
    context.lineWidth = brush_width; //passing brush size as line width
    snapshot = context.getImageData(0, 0, canvas.width, canvas.height);
}
const finish_draw = () => {
    is_drawing = false;
}
const drawing = (f) => {
    if(!is_drawing) return; 
    context.putImageData(snapshot, 0, 0); //adding copied canvas data on to this canvas
    if(selected_tool === "brush" || selected_tool === "eraser"){
        if(selected_tool === "eraser"){
            context.strokeStyle = "#fff";
        } else{
            context.strokeStyle = selected_color;
        }
        context.lineTo(f.offsetX, f.offsetY); //creating line according to the mouse pointer
        context.stroke(); //drawing or filling line with color
    } else if(selected_tool === "rectangle"){
        drawRect(f);
    } else if(selected_tool === "circle"){
        drawCircle(f);
    } else{
        drawTriangle(f);
    }
}
const according = () => {
    brush_width = size_slider.value;
}
const picking = () => {
    color_picker.parentElement.style.background = color_picker.value;
    color_picker.parentElement.click();
}
const clearing = () => {
    context.clearRect(0, 0, canvas.width, canvas.height); //clearing all of canvas
    setCanvasBackground();
}  
const saving = () => {
    const link = document.createElement("a"); //creating <a> element
    link.download = `${Date.now()}.jpg`;
    link.href = canvas.toDataURL();
    link.click(); // clicking link to download image
}
tool_buttons.forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector(".options .active").classList.remove("active");
        btn.classList.add("active");
        selected_tool = btn.id;
        console.log(selected_tool);
    });
});

colors.forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector(".options .selected").classList.remove("selected");
        btn.classList.add("selected");
        selected_color = window.getComputedStyle(btn).getPropertyValue("background-color");
    });
});


canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mousedown", start_draw);
canvas.addEventListener("mouseup", finish_draw);
size_slider.addEventListener("change", according);
color_picker.addEventListener("change", picking);
clear_canvas.addEventListener("click", clearing);
save_img.addEventListener("click", saving);