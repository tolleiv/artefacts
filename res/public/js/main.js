if (!String.prototype.format) {
    String.prototype.format = function () {
        var str = this.toString();
        if (!arguments.length)
            return str;
        var args = typeof arguments[0],
            args = (("string" == args || "number" == args) ? arguments : arguments[0]);
        for (arg in args)
            str = str.replace(RegExp("\\{" + arg + "\\}", "gi"), args[arg]);
        return str;
    }
}

$(document).ready(function () {

    if ($('.jumbotron').size() > 0) {
        $.getJSON('/c/statistics', function (data) {
            var tpl = 'Manages {projects} projects with {pipelines} pipelines and {artefacts} artefacts';
            $('.jumbotron p').html(
                tpl.format(data)
            )
        });
    }
    var sockets = io.connect()
        // project page
    projectList.init({sockets: sockets});
    $('.btn-project-create').click(function () {
        projectForm.initCreateForm();
    });
    
});