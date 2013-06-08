
(function(global, document) {
    if (location.hostname === 'localhost' || ~location.hostname.indexOf('192.168')) {
        var livereload = document.createElement('script');
        livereload.src = 'http://' + location.hostname + ':35729/livereload.js';
        document.body.appendChild(livereload);
    }

    require.config({
        paths : {
            "jquery": "vendor/jquery/jquery",
            "bootstrap": "vendor/bootstrap/docs/assets/js/bootstrap"
        },
        shim: {
            "bootstrap": {
                "deps": ["jquery"]
            }
        },
        map: {
            "*": {
                'can': 'vendor/canjs/amd/can'
            }
        }
    });

    require(['can', 'jquery', 'bootstrap'], function(can, $) {
        var Todo = can.Model({
            findAll: 'GET /todos',
            findOne: 'GET /todos/{id}',
            update: 'PUT /todos/{id}',
            destroy: 'DELETE /todos/{id}'
        }, {});

        var TodoBoard = can.Control({
            init: function() {
                var el = this.element;
                this.element.html(can.view('todoBoard', new Todo.List({})));
            },
            'input[type=checkbox] change': function(el, ev) {
                el.parent().data('todo').attr('done', el.prop('checked')).save();
            },
            '.delete click': function(el, ev) {
                el.parent().data('todo').destroy();
            },
            '.description click': function(el, ev) {
                can.route.attr('id', el.parent().data('todo').id);
            }
        });

        var TodoEditor = can.Control({
            loadTodo: function(todo) {
                this.options.todo = todo;
                this.on();
                this.element.html(can.view('todoEditor', this.options.todo));
            },
            'input change': function(el, ev) {
                this.element.find('.spinner').removeClass('hidden');
                this.options.todo.attr('description', el.val()).save();
            },
            '{todo} updated': function() {
                this.element.find('.spinner').addClass('hidden');
            },
            '{todo} destroyed': function() {
                can.route.removeAttr('id');
            }
        });

        var Routing = can.Control({
            init: function() {
                can.route('todos/:id');
                new TodoBoard($('#board'));
                this.editor = new TodoEditor($('#editor'));
                $('#editor').hide();
            },
            'todos/:id route': function(data) {
                if(data.id) {
                    var editor = this.editor;
                    Todo.findOne({id: data.id}).done(function(todo) {
                        editor.loadTodo(todo);
                        editor.element.show();
                    });
                } else {
                    $('#editor').hide();
                }
            }
        });

        var TODOS = [
            'Download CanJS',
            'Read the guides',
            'Build your app',
            'Become immortal',
            'Haircut @ 2pm'
        ];

        var todoStore = can.fixture.make(TODOS.length, function(i) {
            return {
                id: i + 1,
                description: TODOS[i],
                done: false
            };
        });

        can.fixture({
            'GET /todos': todoStore.findAll,
            'GET /todos/{id}': todoStore.findOne,
            'PUT /todos/{id}': todoStore.update,
            'DELETE /todos/{id}': todoStore.destroy
        });

        can.fixture.delay = 500;

        new Routing(document.body);
    });
})(window, document);
