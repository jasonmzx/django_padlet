
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

    //Adding Event Listener for Text Element(AfterMathElement):
        span_after.addEventListener("click", function(e){
        const current_pos = positionGetter()
        console.log(current_pos);
        });    
        
        span_after.addEventListener("keydown", function(e){
        var current_pos = 0
        if (e.key == "ArrowRight"){
            current_pos = positionGetter() +1
            //Limits current_pos to MAX LENGTH
            if (current_pos > span_after.innerHTML.length){current_pos = span_after.innerHTML.length}

        } else if (e.key = "ArrowLeft") {
            current_pos = positionGetter() -1
           //Limits Current_pos to MIN LENGTH
           if (current_pos < 0){current_pos = 0}
        }
        console.log(current_pos);
        })

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




function positionGetter(val, step) {
    var selection = window.getSelection();
    return selection.anchorOffset

    // for (var i = 0; i < step; i += 1) {
    //   selection.modify('extend', 'backward', 'character');
    // }
  }