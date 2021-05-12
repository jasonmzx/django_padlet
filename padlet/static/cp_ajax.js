
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
var problemSpan = document.getElementById('problem');
MQ.StaticMath(problemSpan);


//Defining WYSIWIG Elements
const w_elm = document.querySelectorAll(".w_elm");

const text_button = document.querySelector("#wysi_text");

const editor = document.querySelector("#math_wysiwig")

//Creation of the Math Element 
function create_wysi_math() {
    //Math Element
        var new_eq = document.createElement("span");
        const random_id = Math.floor(Math.random()*16777215).toString(16);
        new_eq.setAttribute("class", "math_box")
        new_eq.setAttribute("id", random_id)

        mathEventListener(new_eq);


        editor.appendChild(new_eq);
        // editor.appendChild(span_after); Keeping this hear to show that there previous was a Text Element appended after the Math Element.

        run_mq(random_id)    
}

//Creation of Text Element
function create_wysi_text(customString){
    
    function createTextElement(customString){
        //Text Element:
        var span_after = document.createElement("span")
        //Usage of customString to dynamically create default text elements E.G -> (Type math here:)
        if(customString == undefined){
            span_after.innerHTML = "c";
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

function textEventListener(element) {
    //Adding Event Listener for Text Element(AfterMathElement):
    element.addEventListener("click", function(e){
        const current_pos = positionGetter()
        console.log(current_pos);
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
    


    //Class Name being referencing in validation 



    console.log(firstClassGetter);
    //Class Validation
    valid_bypass = ["text_box","mq-root-block","mq-hasCursor","math_box","bypass"]
    if (valid_bypass.includes(firstClassGetter) == false ) {
        console.log("bypassing")
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
    if (element_type == "text_box"){
        menu_element.style.backgroundColor = "red";
        menu_element.style.display = "block";
        //Creation of the Insertion Menu for Textboxes:
        $("#insert_wysiwig").empty();
        const insert_menu = document.querySelector("#insert_wysiwig")
        
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