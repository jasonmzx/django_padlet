
$(document).ready(function(){

    //CSRF TOKEN
    var csrf = $('input[name=csrfmiddlewaretoken]').val();

    $('#search_users').on('input', function SearchUser() {
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
                
                $("#search_query_obj").empty(); //this command will also get removed
                query_parser(g_search_query, q_p_page, maxsize);
                
                //This will be removed and replaced by the query_parser func;
                for (i = 0; i < search_query.length; i++) {
                    //console.log(response.s_query[i])
                    $("#search_query_obj").append("<div>"+ search_query[i] +"</div>");
                }
                
            }
        });


    });

    $("#query_next").click(function(){
        q_p_page += 1;
        query_parser(g_search_query, q_p_page,maxsize);
    });

    $("#query_prev").click(function(){
        if (q_p_page > 0){q_p_page -= 1}
        query_parser(g_search_query, q_p_page,maxsize);
    });
//end of JQUERY    
});

const maxsize = 3
var q_p_page = 0 
var g_search_query = []

query_parser = (search_query, q_p_page, maxsize) => {
    const q_p_max =  Math.ceil(search_query.length/maxsize);


    DOM_OBJ = document.querySelector('#search_query_obj');
    for (j = 0; j < maxsize; j++) {
        try {
            console.log(search_query[(maxsize*q_p_page)+j]);
        } catch(err) {
            console.log(" EMPTY ");
        }
    };


    console.log(search_query.length + " & " + q_p_page + " & " + q_p_max)
}