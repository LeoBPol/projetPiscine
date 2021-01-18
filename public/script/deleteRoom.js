$(document).ready(function() {
    $('#deleteRoom').on("click", function(e) {
        e.preventDefault();
        var id = $('#id').text();
        $.ajax({
            type: 'DELETE',
            url: '/admin/manageRoom/' + id,
            success: (data) => {
                console.log(data);
            },
            error: (err) => {
                console.log(err);
            }
        });
        $('#juryElement').attr('style', 'display: none');
    });
});