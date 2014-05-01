var projectList = {
    init: function (settings) {
        projectList.config = {
            sockets: { on: function () {
            } },
            container: $('.project-overview'),
            url: '/projects',
            bodyTemplate: '<table class="table table-striped">' +
                '   <thead><tr>' +
                '       <th width="60%">Title</th><th width="10%">Pipelines</th><th colspan="2"></th>' +
                '   </tr></thead>' +
                '   <tbody></tbody>' +
                '</table>',
            itemTemplate: '<tr>' +
                '<th>{title}</th>' +
                '<td>{size}</td>' +
                '<td><button data-project="{id}" data-role="edit" class="btn btn-xs btn-info">Edit</button>' +
                '&nbsp;<button data-project="{id}" data-role="delete" class="btn btn-xs btn-warning">Delete</button></td>' +
                '<td><a href="/ui/project/{id}/pipelines" role="button" class="btn btn-xs btn-off">Pipelines</a>' +
                '<button data-project="{id}" data-role="pipeline" title="New pipeline" class="btn btn-xs">+</button></td>' +
                '</tr>'
        };
        $.extend(projectList.config, settings);

        projectList.setup();
    },
    setup: function () {
        projectList.config.container.each(projectList.createList);
        projectList.config.sockets.on('object-created', projectList.updateList);
        projectList.config.sockets.on('object-updated', projectList.updateList);
        projectList.config.sockets.on('object-deleted', projectList.updateList);
    },
    createList: function () {
        $(this).html(projectList.config.bodyTemplate)
        projectList.updateList();
    },
    updateList: function () {
        $.getJSON(projectList.config.url, function (data) {
            projectList.config.container.find('tbody').empty();
            $.each(data, projectList.processItemData);
        });
    },
    processItemData: function (index, item) {
        var data = {
            id: item.id,
            title: item.title,
            size: Object.keys(item.pipelines).length
        };
        projectList.extendList(data)
    },
    extendList: function (data) {
        projectList.config.container.find('tbody')
            .append(projectList.config.itemTemplate.format(data))
        projectList.config.container.find('tbody')
            .find("button[data-role='delete'][data-project='" + data.id + "']")
            .click(projectList.deleteProject)
        projectList.config.container.find('tbody')
            .find("button[data-role='edit'][data-project='" + data.id + "']")
            .click(projectList.editProject)
    },
    editProject: function () {
        var pId = $(this).data('project');
        $.getJSON('/project/' + pId,
            function (project) {
                $('.project-edit').unserializeForm($.param(project))
                projectForm.init({
                    title: "Edit project",
                    form: $('.project-edit'),
                    url: '/project/' + pId,
                    method: 'PUT',
                    resetCallback: function () {
                        $('#editProject').modal('hide')
                    }
                });
                $('#editProject').modal('show')
            });
    },
    deleteProject: function () {
        var that = this;
        $("#deleteProject button[data-role='confirm']").click(function () {
            $.ajax({
                url: '/project/' + $(that).data('project'),
                type: 'DELETE',
                success: function () {
                    $('#deleteProject').modal('hide');
                },
                error: function (ajax, message) {
                    console.log(message)
                    $('#deleteProject').modal('hide');
                }
            })
        });
        $('#deleteProject').modal('show');
    }
};

var projectForm = {
    init: function (settings) {
        projectForm.config = {
            title: 'Action project',
            url: '/project',
            form: $('.project-form'),
            data: {},
            method: 'POST',
            resetCallback: function () {
            }
        };
        $.extend(projectForm.config, settings);

        projectForm.setup();
    },
    setup: function () {
        projectForm.config.form.each(projectForm.registerActions)
    },
    registerActions: function () {
        $(this).find('.modal-title').html(projectForm.config.title)
        $(this).submit(function (event) {
            var btn = $(this).find('.btn-primary');
            btn.button('loading');
            $.ajax({
                type: projectForm.config.method,
                url: projectForm.config.url,
                data: $(this).serialize(),
                dataType: 'json'
            })
                .done(function (data) {
                    btn.removeClass('btn-primary').addClass('btn-success');
                })
                .fail(function () {
                    btn.removeClass('btn-primary').addClass('btn-danger')
                })
                .always(function () {
                    setTimeout(function () {
                        projectForm.resetForm();
                        btn.removeClass('btn-success btn-danger').addClass('btn-primary').button('reset')
                    }, 500)
                });

            event.preventDefault();
        })
    },
    resetForm: function () {
        projectForm.config.form.each(function (i, form) {
            form.reset();
        })
        projectForm.config.resetCallback();
    }
}

