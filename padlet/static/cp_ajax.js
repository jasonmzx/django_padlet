
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
                console.log("Query received");
                const search_query = response.s_query
                g_search_query = search_query
                console.log(search_query);
                
                query_parser(g_search_query, q_p_page, maxsize);
                
                //This will be removed and replaced by the query_parser func;
                
            }
        });


    });
    //BUTTON CLICK HANDLERS:
    $("#query_next").click(function(){
        if (q_p_page < Math.floor(g_search_query.length/maxsize)){q_p_page += 1}
        query_parser(g_search_query, q_p_page,maxsize);
    });

    $("#query_prev").click(function(){
        if (q_p_page > 0){q_p_page -= 1}
        query_parser(g_search_query, q_p_page,maxsize);
    });

    //Append user:
    $(document).on('click','.user_append_obj', function(){
        console.log($(this).text())
    });


//end of JQUERY    
});

const maxsize = 3
var q_p_page = 0 
var g_search_query = []

query_parser = (search_query, q_p_page, maxsize) => {
    $("#search_query_obj").empty();
    
    const q_p_max =  Math.ceil(search_query.length/maxsize);
    DOM_OBJ = document.querySelector('#search_query_obj');

    //Handler for If or IF NOT to show the [Next] & [Prev] Buttons (Front end)
    if(q_p_max-1 < 1){$(".change_page").hide();} 
    else {$(".change_page").show();}

    //If search query isn't null
    if (search_query.length != 0) {
        
        //Take Returned Search Query and display it
        for (j = 0; j < maxsize; j++) {
            try {
                console.log(search_query[(maxsize*q_p_page)+j]);
                $("#search_query_obj").append("<div class='queryd_user user_append_obj'>"+ search_query[(maxsize*q_p_page)+j] +"</div>");
            } catch(err) {
                continue
            }
        };

    };



    console.log(search_query.length + " & " + q_p_page + " & " + q_p_max)
}