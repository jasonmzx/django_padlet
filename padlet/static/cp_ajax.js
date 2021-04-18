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
                console.log("AJAX sent");
                console.log(response.s_query);
            }
        });


    });



//end of JQUERY    
});