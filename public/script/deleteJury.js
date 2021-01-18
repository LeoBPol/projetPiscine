$(document).ready(function() {
    $('#deleteJury').on("click", function(e) {
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