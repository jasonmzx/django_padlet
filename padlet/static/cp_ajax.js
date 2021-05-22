
$(document).ready(function(){


    //CSRF TOKEN
    var csrf = $('input[name=csrfmiddlewaretoken]').val();

    $('#search_users').on('input', function SearchUser() {
        q_p_page = 0;
        $.ajax({
            url: 'search_user_method',
            type: 'get',
            data: {
                searched: $('#search_users').val().toLowerCase()
            },
            success: function(response){
                const search_query = response.s_query
                g_search_query = search_query

                
                query_parser(g_search_query, q_p_page, maxsize);
                
                //This will be removed and replaced by the query_parser func;
                
            }
        });


    });


//end of JQUERY    

});

var MQ = MathQuill.getInterface(2);
//var problemSpan = document.getElementById('problem');
//MQ.StaticMath(problemSpan);


//Defining WYSIWIG Elements
const w_elm = document.querySelectorAll(".w_elm");

//const text_button = document.querySelector("#wysi_text");

const editor = document.querySelector("#math_wysiwig")

//CURRENTLY SELECTED ELEMENT GLOBAL VARIABLE
// 0: class , 1: reference to element itself
let currentlySelectedElm = ['',null]


//Creation of the Math Element 
function create_wysi_math() {
    //Math Element
        var new_eq = document.createElement("span");
        const random_id = Math.floor(Math.random()*16777215).toString(16);
        new_eq.setAttribute("class", "math_box")
        new_eq.setAttribute("id", random_id)

        mathEventListener(new_eq);

        const current_pos = positionGetter()
        console.log("[c_math]:"+current_pos)
        //If no specific position is selected, append NEW_EQ element (to the end)
        //if (current_pos == 0){
        if (currentlySelectedElm[1] == null){
        editor.appendChild(new_eq);
        } else {
            console.log("[c_math]:"+currentlySelectedElm);
            //Currently selected Element Split (Based on length and current position of cursor element within CSE)
            const CSE_split = [currentlySelectedElm[1].innerHTML.slice(0,current_pos) ,
                             currentlySelectedElm[1].innerHTML.slice(current_pos,currentlySelectedElm[1].innerHTML.length) ]
            console.log("[c_math]:"+CSE_split)
            
            //Creation / manipulation of elements to fit MATH_BOX in the middle of previous text:
            currentlySelectedElm[1].innerHTML = CSE_split[0]
            $(new_eq).insertAfter(currentlySelectedElm[1])
            
            //Second part of split text:
            let span_after = document.createElement("span")
            span_after.innerHTML = CSE_split[1]
            span_after.setAttribute("class","text_box");
            span_after.setAttribute("contenteditable","");
            textEventListener(span_after);

            $(span_after).insertAfter(new_eq)

        }
        // editor.appendChild(span_after); Keeping this here to show that there previous was a Text Element appended after the Math Element.

        run_mq(random_id)    
}

//Creation of Text Element
function create_wysi_text(customString){
    
    function createTextElement(customString){
        //Text Element:
        let span_after = document.createElement("span")
        //Usage of customString to dynamically create default text elements E.G -> (Type math here:)
        if(customString == undefined){
            span_after.innerHTML = "Insert text here...";
       } else {
           span_after.innerHTML = customString;
       }
        span_after.setAttribute("class","text_box");
        span_after.setAttribute("contenteditable","");

        textEventListener(span_after);

        //Appending Element into Main DIV

        editor.appendChild(span_after);
    }

    try{
        lastChildClass = editor.lastChild.getAttribute("class")

        if (lastChildClass == "text_box"){
            console.log("Useless")
            return
        } else {
            createTextElement(customString);
        }
    
    } catch(err) {
        createTextElement(customString);
    }


};

//Creation of Image Element:
function create_wysi_img(){
    const menu_element = document.getElementById("insert_wysiwig");
    menu_element.style.backgroundColor = "pink";
    menu_element.style.display = "block";
    $("#insert_wysiwig").empty();
    //Creation of Image insertion menu:
    
    //URL tab
    $("#insert_wysiwig").append(`
    <span class="insert_box" >Link:</span><input id="img_input" class="insert_box" onchange="img_input(this.id)"></input> <br>
    <span class="insert_box" >Or, upload the image file here:</span>  <input type="file" id="img_input_upload" onchange="img_input(this.id)" class="insert_box" name="img" accept="image/*">`)
    document.getElementById("vert_cont").style.gridTemplateRows = "40% 60%"
}



//DEFAULT SETTINGS OF THE WYSIWIG's INPUT
create_wysi_text("Type math here!");



//Create box
for (const w of w_elm) {
    w.addEventListener('click', function(e){
        if (w.id == "wysi_math"){
            create_wysi_math();
        }
        
        if(w.id == "wysi_text"){
            create_wysi_text();
        }

        if(w.id == "wysi_img"){
            create_wysi_img();
        }
    
    });

}



function run_mq(name) {
var mathFieldSpan = document.getElementById(name);
var latexSpan = document.getElementById('latex');

var MQ = MathQuill.getInterface(2); // for backcompat
var mathField = MQ.MathField(mathFieldSpan, {
  spaceBehavesLikeTab: true, // configurable
  handlers: {
    edit: function() { // useful event handlers
      latexSpan.textContent = mathField.latex(); // simple API
    }
  }
});
}

//Event Listeners
function img_input(e){

    if (e == "img_input"){
    let url = document.querySelector("#img_input").value 
    try{ 
        url = new URL(url);
        console.log("[II]: Valid URL")
        return url
    } catch(_){
        console.log("[II]: URL is invalid...")
        return false
     }
    } else {
        const img_file_upload = document.querySelector("#img_input_upload").files[0];
        console.log(img_file_upload);
        
        const toBase64 = file => new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });

        console.log(toBase64(img_file_upload));
    }

}

function textEventListener(element) {
    //Adding Event Listener for Text Element(AfterMathElement):
    element.addEventListener("click", function(e){
        const current_pos = positionGetter()
        insertionMenu(element,element.getAttribute("class"),current_pos)
        });    
        
        element.addEventListener("keydown", function(e){
        var current_pos = 0
        if (e.key == "ArrowRight"){
            current_pos = positionGetter() +1
            //Limits current_pos to MAX LENGTH
            if (current_pos > element.innerHTML.length){current_pos = element.innerHTML.length}

        } else if (e.key = "ArrowLeft") {
            current_pos = positionGetter() -1
           //Limits Current_pos to MIN LENGTH
           if (current_pos < 0){current_pos = 0}
        }
        insertionMenu(element,element.getAttribute("class"),current_pos)
        })
}

function mathEventListener(element){
    element.addEventListener("click",function(e){
        insertionMenu(element,element.getAttribute("class"),null)
    });
}


function wysi_optimize() {
    wysi = $("#math_wysiwig .text_box,.math_box")
    for (i = 0; i < wysi.length; i++){
        wysi = $("#math_wysiwig .text_box,.math_box")
        console.log(wysi[i]);
        console.log(`ID: ${i}`)

        if ($(wysi[i]).attr("class") == "text_box") {
            if ($(wysi[i+1]).attr("class") == "text_box") {
                const combined_text = wysi[i].innerHTML + wysi[i+1].innerHTML
                console.log(combined_text);
                editor.removeChild(wysi[i])
                editor.removeChild(wysi[i+1])

            //New combined span element:
                var com_elm = document.createElement("span");
                com_elm.innerHTML = combined_text
                com_elm.setAttribute("class","text_box");
                com_elm.setAttribute("contenteditable","");

                textEventListener(com_elm);


                if(i == 0){

                    editor.prepend(com_elm);
                    i -= 1
                } else {
                    $(com_elm).insertAfter(wysi[i-1])

                }

            }

        }
    }
    console.log(wysi.length)
    console.log(wysi)
};

//Global event listener:
document.addEventListener("click", function(e) {
    const clickedElement = e.target.getAttribute("class")
    let firstClassGetter = ""

    if (clickedElement != undefined) { 
        firstClassGetter = clickedElement.split(' ')[0] 
    }

    console.log(clickedElement)



    let insertionSend = null

    //Essentially checks if Element is within the class:"math_box" elements, if so it sets insertionSend to the element.
    if (clickedElement == null){
        //Searchs for Select_cursor, if exists, set insertion menu to trigger with the element's parent math_box obj
        const select_cursor = document.getElementsByClassName("mq-cursor")[0]
        if (select_cursor != undefined){
        // insertionMenu(select_cursor.closest(".math_box"),"math_box",null)
        insertionSend = select_cursor.closest(".math_box")
        }
        //Else, simply locate parent element
    } else{
    console.log(e.target.closest(".math_box"))
    insertionSend = e.target.closest(".math_box")
    // insertionMenu(e.target.closest(".math_box"),"math_box",null)

    }

    //Sending the object found from above to the insertionMenu function, which generates the menu
    if (insertionSend != null){
        insertionMenu(insertionSend,"math_box",null)
        firstClassGetter = "bypass"
    }
    
    //CurrentlySelectedElm setter
    if(firstClassGetter == "text_box"){
        currentlySelectedElm = ["text_box",e.target]
    }

    //Class Name being referencing in validation 



    console.log(firstClassGetter);
    //Class Validation
    valid_bypass = ["text_box","mq-root-block","mq-hasCursor","math_box","bypass","insert_box","wysi_img"]
    if (valid_bypass.includes(firstClassGetter) == false ) {
        document.getElementById("vert_cont").style.gridTemplateRows = "15% 85%"
        console.log("No bypass, clearing insertion Menu")
        //resetting currentlySelectedElm to null
        currentlySelectedElm = ['',null]
        window.getSelection().empty();
        const menu_element = document.getElementById("insert_wysiwig");
        menu_element.style.display = "none";
        console.log(window.getSelection())
    }
    //Other Elements that can trigger 


})

function insertionMenu(thiselement, element_type, cursor_position){
    const menu_element = document.getElementById("insert_wysiwig");
    console.log(`${thiselement} , ${element_type}, ${cursor_position}`)
    //Insertion Text Menu
    const insert_menu = document.querySelector("#insert_wysiwig");

    if (element_type == "text_box"){
        menu_element.style.backgroundColor = "red";
        menu_element.style.display = "block";
        //Creation of the Insertion Menu for Textboxes:
        $("#insert_wysiwig").empty();

        
        //Creation of the Delete button:
        const deleteButton = document.createElement("button");
        deleteButton.innerHTML = "Delete"

        deleteButton.onclick = function(element){
            thiselement.remove()
        }

        insert_menu.appendChild(deleteButton);
        

    } 
    const valid_math_box = ["math_box mq-editable-field mq-math-mode mq-focused","math_box"]
    if (valid_math_box.includes(element_type)){
        menu_element.style.backgroundColor = "blue";
        menu_element.style.display = "block";
        $("#insert_wysiwig").empty();
        const deleteButton = document.createElement("button");
        deleteButton.innerHTML = "Delete"

        deleteButton.onclick = function(element){
            thiselement.remove()
            wysi_optimize()
        }

        insert_menu.appendChild(deleteButton);
        

    }

    //element.remove();
}


function positionGetter(val, step) {
    var selection = window.getSelection();
    console.log(selection)
    return selection.anchorOffset

    // for (var i = 0; i < step; i += 1) {
    //   selection.modify('extend', 'backward', 'character');
    // }
  }