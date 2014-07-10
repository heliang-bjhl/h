var util = {
    GuideData : {},
    uwalk: function(path, op) {
        "use strict";
        var walk = require('walk'),
            fs = require('fs'),
            options, walker;
        // To be truly synchronous in the emitter and maintain a compatible api,
        // the listeners must be listed before the object is created
        options = {
            listeners: {
                names: function(root, nodeNamesArray) {
                    nodeNamesArray.sort(function(a, b) {
                        if (a > b) return 1;
                        if (a < b) return -1;
                        return 0;
                    });
                },
                errors: function(root, nodeStatsArray, next) {
                    next();
                }
            }
        };
        if (op.type == 'dir') {
            options.listeners.directories = function(root, dirStatsArray, next) {
                
                dirStatsArray.forEach(function(item) {
                    if(item.name == '_g' || /svn/.test(item.name)){ //_g是通用模版文件,过滤掉
                        return
                    }
                    util.GuideData[item.name] = [];
                    
                    util.uwalk(path + '/' + item.name, {
                        type: 'file',
                        childPach: item.name
                    })
                })
            }
        }
        if (op.type == 'file') {
            options.listeners.file = function(root, fileStats, next) {
                if(/svn/.test(fileStats.name) || fileStats.name == 'entries'){
                    return
                }
                util.GuideData[op.childPach].push({
                    level2 : fileStats.name.replace(/\.ejs/,'')
                });


            }
        }
        walker = walk.walkSync(path, options);

    }
}

module.exports = {
    util : util
};