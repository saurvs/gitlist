var cm_viewer;
    $('.dropdown-toggle').dropdown();

        var value = $('#sourcecode').text();
        var mode = $('#sourcecode').attr('language');
        var pre = $('#sourcecode').get(0);
        cm_viewer = CodeMirror(function(elt) {
            pre.parentNode.replaceChild(elt, pre);
            elt.setAttribute('id','sourcecode')
        }, {
            value: value,
            lineNumbers: true,
            matchBrackets: true,
            lineWrapping: true,
            readOnly: true,
            mode: mode,
            lineNumberFormatter: function(ln) {
                return '<a name="L'+ ln +'"></a><a href="#L'+ ln +'">'+ ln +'</a>';
            }
        });

    if ($('#md-content').length) {
        var converter = new Showdown.converter({extensions: ['table']});
        $('#md-content').html(converter.makeHtml($('#md-content').text()));
    }

    var clonePopup = $('#clone-popup')
    var cloneButtonShow = $('#clone-button-show');
    var cloneButtonHide = $('#clone-button-hide');
    var cloneButtonSSH = $('#clone-button-ssh');
    var cloneButtonHTTP = $('#clone-button-http');
    var cloneInputSSH = $('#clone-input-ssh');
    var cloneInputHTTP = $('#clone-input-http');

    cloneButtonShow.click(function()
    {
        clonePopup.fadeIn();
    });

    cloneButtonHide.click(function()
    {
        clonePopup.fadeOut();
    });

    cloneButtonSSH.click(function()
    {
        if(cloneButtonSSH.hasClass('active'))
            return;

        cloneButtonSSH.addClass('active');
        cloneInputSSH.show();

        cloneButtonHTTP.removeClass('active');
        cloneInputHTTP.hide();
    });

    cloneButtonHTTP.click(function()
    {
        if(cloneButtonHTTP.hasClass('active'))
            return;

        cloneButtonHTTP.addClass('active');
        cloneInputHTTP.show();

        cloneButtonSSH.removeClass('active');
        cloneInputSSH.hide();
    });

    function paginate() {
        var $pager = $('.pager');

        $pager.find('.next a').one('click', function (e) {
            e.preventDefault();
            $.get(this.href, function (html) {
                $pager.after(html);
                $pager.remove();
                paginate();
            });
        });

        $pager.find('.previous').remove();
    }
    paginate();

    $.get(TREEJSON_PATH, function(tree) {
        
        function convert(tree) {
            if (tree === undefined) return;
            for (const i in tree) {
                const arrayNode = tree[i]
                const objectNode = {}

                objectNode['text'] = arrayNode[0]

                if (arrayNode[1] !== undefined) {
                    convert(arrayNode[1])
                    objectNode['nodes'] = arrayNode[1]

                    objectNode['selectable'] = false
                }

                tree[i] = objectNode
            }
        }
        convert(tree)

        var readme_node, nondot_node

        for (const node of tree) {
            if (node['nodes'] === undefined) {
                const filename = node['text']
                if (filename.startsWith('readme') || filename.startsWith('README')) {
                    readme_node = node
                } else if (!filename.startsWith('.')) {
                    nondot_node = node
                }
            }
        }

        if (readme_node) {
            readme_node['state'] = {'selected': true}
        } else if (nondot_node) {
            nondot_node['state'] = {'selected': true}
        }

        function showFile(node) {
            if (!node['path']) {
                var path = '/' + node['text']
                var parent = $('#tree').treeview('getParent', node['nodeId'])
                while (parent.nodeId !== undefined) {
                    path = '/' + parent['text'] + path
                    parent = $('#tree').treeview('getParent', parent)
                }
                node['path'] = path
            }
            $.get(RAW_BLOB_BASEPATH + node['path'], function(raw_blob) {
                cm_viewer.setValue(raw_blob)

                var ftype = getFileType(node.text)
                cm_viewer.setOption('mode', ftype)
            })
        }

        $('#tree')
            .treeview({ data: tree })
            .treeview('collapseAll')
            .on('nodeSelected', function(event, node) {
                showFile(node)
            })
        var selected_node = $('#tree').treeview('getSelected')[0]
        showFile(selected_node)
    });