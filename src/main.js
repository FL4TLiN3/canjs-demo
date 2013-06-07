
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
    });
})(window, document);
