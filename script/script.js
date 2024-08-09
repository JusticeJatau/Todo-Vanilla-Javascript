alert("hi")
const mode = document.querySelector(".mode")
var body, background, todo_search, todo_body, mode_element, sort_el, count, count_el, check_el, input, clear, active, completed
    body = document.querySelector("body")
    background = document.querySelector(".desktop_bck")
    mobile_background = document.querySelector(".mobile_bck")
    todo_search = document.querySelector(".add")
    todo_body = document.querySelector(".todo-body")
    sort_el = document.querySelectorAll(".sort span")
    count = document.querySelector(".count")
    input = document.querySelector(".input")

    clear = document.querySelector(".clear")
    active = document.querySelector(".sort-active")
    completed = document.querySelector(".sort-completed")

    mode_element = [body, background, todo_search, todo_body]
    count.textContent = 0

    count_el = document.querySelector(".todo-body .content").children

    updateCount()

var dark = "true"
var angle = 0

alert("check 2")

loadSetting()

mode.addEventListener('click', ()=>{
    if(dark === "true"){
        dark = "false"
    }else{
        dark = "true"
    }
    saveSetting()
    Refresh()
})
alert("check 3")

function updateCount(){
    count.textContent = "0"
    Array.from(count_el).forEach(e=>{ //or var arr = [..._count] then arr.forEach()
        if(!(e.children[0].children[1].classList.contains('done'))){
            count.textContent = parseInt(count.textContent) + 1 // or Number(count.textContent)
        }
    })
}
alert("check 4")

function saveSetting(){
    localStorage.setItem("mode", dark)
    localStorage.setItem("content", todo_body.children[0].innerHTML)
}

function loadSetting(){
    dark = localStorage.getItem("mode")
    todo_body.children[0].innerHTML = localStorage.getItem("content")

    var allTask = document.querySelectorAll(".content span")
    allTask.forEach(_task =>{
        if(_task.classList.contains("done")){
            _task.previousElementSibling.firstChild.checked = "true"
        }
    })

    Refresh()
    updateCount()
}

function Refresh(){
    
    angle += 360
    mode.style.transform = `rotate(${angle}deg)`
    setTimeout(()=>{
        mode.src = (dark === "true")? "../images/icon-sun.svg":"../images/icon-moon.svg"

        if(dark === "true"){
            mode_element.forEach(element =>{
                element.classList.remove('light')
            })
            background.src = `../images/bg-desktop-dark.jpg`
            mobile_background.src = '../images/bg-mobile-dark.jpg'
        }else{
            mode_element.forEach(element =>{
                element.classList.add('light')
            })

            background.src = `../images/bg-desktop-light.jpg`
            mobile_background.src = '../images/bg-mobile-light.jpg'
        }
    
    }, 250)
}

todo_body.addEventListener('click',(e)=>{
    if(e.target.tagName === "IMG"){
        e.target.parentElement.remove()
        updateCount()
        saveSetting()
    }
})

sort_el.forEach(element =>{
    element.addEventListener('click', ()=>{
        sort_el.forEach(e =>{
            e.classList.remove('active')
        })
        element.classList.add('active')
    })
})

// Creating Of Element
input.addEventListener('keydown', (event)=>{
    if(event.key === "Enter"){
        if(input.value != ""){
            createTask(input.value)
            input.value = ""
        }
    }
})

function createTask(text){
    let task = document.createElement("div")
    task.className = 'task'
    task.draggable = "true"
    task.innerHTML =    `<div>
                            <div class="cb-wr"><input class="check" type="checkbox"></div>
                            <span>${text}</span>
                        </div>
                        <img class="close" src="images/icon-cross.svg" alt="close">`
                        
    todo_body.children[0].appendChild(task)

    updateCount()
    saveSetting()
}

var task = document.querySelector(".content")
task.addEventListener('click', (e)=>{
    if(e.target.tagName === "INPUT"){
        
        var parentElement = e.target.parentElement;
        var sibling = parentElement.nextElementSibling;
        sibling.classList = e.target.checked? 'done':'';
        saveSetting()
        updateCount()
    }
})

//Clear all done todos
clear.addEventListener('click', ()=>{
    document.querySelectorAll(".done").forEach((e)=>{
        e.parentElement.parentElement.remove()
        saveSetting()
        updateCount()
    })
})

function sortTodo(id){
    var allTodo = document.querySelectorAll(".task")
    allTodo.forEach(todo =>{
        if(id === 'done'){
            todo.style.display = "none"
            if(todo.children[0].children[1].classList.contains(id)){
                todo.style.display = "flex"
            }
        }else if(id === 'active'){
            todo.style.display = "none"
            if(!(todo.children[0].children[1].classList.contains("done"))){
                todo.style.display = "flex"
            }
        }else if(id === ''){
            todo.style.display = "flex"
        }
    })
}

//Drag and Drop functionality
const draggables = document.querySelectorAll(".task")
const todo_container = todo_body.querySelector(".content")
let dragInterval
let isDragging = false

draggables.forEach(draggable =>{
    draggable.addEventListener('dragstart', ()=>{
        draggable.classList.add("dragging")
    })
    draggable.addEventListener('dragend', ()=>{
        draggable.classList.remove("dragging")
        saveSetting()
    })
    //Mobile touch start and end
    draggable.addEventListener('touchstart', ()=>{
        dragInterval = setInterval(()=>{
            draggable.classList.add("dragging")
            isDragging = true
        }, 500)
    })
    draggable.addEventListener('touchend', ()=>{
        clearInterval(dragInterval)
        if(isDragging){
            isDragging = false
            draggable.classList.remove("dragging")
        }
        saveSetting()
    })
})
//Desktop 
todo_container.addEventListener('dragover', (e)=>{
    e.preventDefault()
    const drag_element = document.querySelector(".dragging")
    const siblings = Array.from(todo_body.querySelectorAll(".task"))
    
    const nextSibling = siblings.find(sibling =>{
        return e.clientY <= sibling.offsetTop + sibling.offsetHeight/2
    })

    todo_container.insertBefore(drag_element, nextSibling)
})
//Mobile touch move
todo_container.addEventListener('touchmove', (e)=>{
    if(!isDragging){
        clearInterval(dragInterval)
    }else{
        e.preventDefault()
        const draggable = document.querySelector(".dragging")
        const touch = e.touches[0]

        const siblings = Array.from(todo_body.querySelectorAll(".task"))
        const nextSibling = siblings.find(sibling =>{
            return touch.clientY <= sibling.offsetTop + sibling.offsetHeight/2
        })
        todo_container.insertBefore(draggable, nextSibling)
    }
})