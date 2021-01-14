$(document).ready(function() {
    console.log("test")
    $('#deleteJury').on("click", function(e) {
        console.log("deleting")
        e.preventDefault();
        var id = $('#id').text();
        $.ajax({
            type: 'DELETE',
            url: '/admin/manageTeachers/' + id,
            success: (data) => {
                console.log(data);
            },
            error: (err) => {
                console.log(err);
            }
        });
        $('#jury').attr('style', 'display: none');
    });
});