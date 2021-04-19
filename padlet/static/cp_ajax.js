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
                console.log(search_query);
                
                $("#search_query_obj").empty();

                for (i = 0; i < search_query.length; i++) {
                    console.log(response.s_query[i])
                    $("#search_query_obj").append("<div>"+ search_query[i] +"</div>");
                }


            }
        });


    });



//end of JQUERY    
});