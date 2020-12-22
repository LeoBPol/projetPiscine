$(document).ready(function() {
    $("#show_hide_password a").on('click', function(event) {
        event.preventDefault();
        if($('#show_hide_password input').attr("type") == "text"){
            $('#show_hide_password input').attr('type', 'password');
            $('#show_hide_password i').addClass( "fa-eye-slash" );
            $('#show_hide_password i').removeClass( "fa-eye" );
        }else if($('#show_hide_password input').attr("type") == "password"){
            $('#show_hide_password input').attr('type', 'text');
            $('#show_hide_password i').removeClass( "fa-eye-slash" );
            $('#show_hide_password i').addClass( "fa-eye" );
        }
    });
});

$(document).ready(function() {
    $("#confirm_password a").on('click', function(event) {
        event.preventDefault();
        if($('#confirm_password input').attr("type") == "text"){
            $('#confirm_password input').attr('type', 'password');
            $('#confirm_password i').addClass( "fa-eye-slash" );
            $('#confirm_password i').removeClass( "fa-eye" );
        }else if($('#confirm_password input').attr("type") == "password"){
            $('#confirm_password input').attr('type', 'text');
            $('#confirm_password i').removeClass( "fa-eye-slash" );
            $('#confirm_password i').addClass( "fa-eye" );
        }
    });
});