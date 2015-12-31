describe('Terminal utils', function() {
    var command = 'test "foo bar" baz /^asd [x]/ str\\ str 10 1e10';
    var args = '"foo bar" baz /^asd [x]/ str\\ str 10 1e10';
    describe('$.terminal.split_arguments', function() {
        it('should create array of arguments', function() {
            expect($.terminal.split_arguments(args)).toEqual([
                    'foo bar',
                    'baz',
                    '/^asd [x]/',
                    'str str',
                    '10',
                    '1e10'
            ]);
        });
    });
    describe('$.terminal.parse_arguments', function() {
        it('should create array of arguments and convert types', function() {
            expect($.terminal.parse_arguments(args)).toEqual([
                    'foo bar',
                    'baz',
                    /^asd [x]/,
                    'str str',
                    10,
                    1e10
            ]);
        });
    });
    describe('$.terminal.split_command', function() {
        it('Should split command', function() {
            var cmd = jQuery.terminal.split_command(command);
            expect(cmd).toEqual({
                command: command,
                name: 'test',
                args: [
                    'foo bar',
                    'baz',
                    '/^asd [x]/',
                    'str str',
                    '10',
                    '1e10'
                ],
                rest: '"foo bar" baz /^asd [x]/ str\\ str 10 1e10'
            });
        });
    });
    describe('$.terminal.parse_command', function() {
        it('should split and parse command', function() {
            var cmd = jQuery.terminal.parse_command(command);
            expect(cmd).toEqual({
                command: command,
                name: 'test',
                args: [
                    'foo bar',
                    'baz',
                    /^asd [x]/,
                    'str str',
                    10,
                    1e10
                ],
                rest: '"foo bar" baz /^asd [x]/ str\\ str 10 1e10'
            });
        });
    });
    var ansi_string = '\x1b[2;31;46mFoo\x1b[1;3;4;32;45mBar\x1b[0m\x1b[7mBaz';
    describe('$.terminal.from_ansi', function() {
        it('should convert ansi to terminal formatting', function() {
            var string = $.terminal.from_ansi(ansi_string);
            expect(string).toEqual('[[;#640000;#008787]Foo][[biu;#44D544;#F5F]'+
                                   'Bar][[;#000;#AAA]Baz]');
        });
    });
    describe('$.terminal.overtyping', function() {
        var string = 'HELLO TERMINAL'.replace(/./g, function(chr) {
            return chr == ' ' ? chr : chr + '\x08' + chr;
        });
        var result = '[[b;#fff;]HELLO] [[b;#fff;]TERMINAL]';
        it('should convert to terminal formatting', function() {
            expect($.terminal.overtyping(string)).toEqual(result);
        });
    });
    describe('$.terminal.escape_brackets', function() {
        var string = '[[jQuery]] [[Terminal]]';
        var result = '&#91;&#91;jQuery&#93;&#93; &#91;&#91;Terminal&#93;&#93;';
        it('should replace [ and ] with html entities', function() {
            expect($.terminal.escape_brackets(string)).toEqual(result);
        });
    });
    describe('$.terminal.encode', function() {
        var tags = '<hello> </hello>\t<world> </world>';
        var tags_result = '&lt;hello&gt;&nbsp;&lt;/hello&gt;&nbsp;&nbsp;&nbsp;'+
            '&nbsp;&lt;world&gt;&nbsp;&lt;/world&gt;';
        it('should convert < > space and tabs', function() {
            expect($.terminal.encode(tags)).toEqual(tags_result);
        });
        var entites = '& & &amp; &64; &#61; &#91';
        //'&amp;&nbsp;&amp;&nbsp;&amp;&nbsp;&amp;64;&nbsp;&#61;&nbsp;&#91'
        var ent_result = '&amp;&nbsp;&amp;&nbsp;&amp;&nbsp;&amp;64;&nbsp;&#61;'+
            '&nbsp;&amp;#91';
        it('it should convert & but not when used with entities', function() {
            expect($.terminal.encode(entites)).toEqual(ent_result);
        });
    });
    describe('$.terminal.format_split', function() {
    });
    describe('$.terminal.is_formatting', function() {

        it('should detect terminal formatting', function() {
            var formattings = [
                '[[;;]Te[xt]',
                '[[;;]Te\\]xt]',
                '[[;;]]',
                '[[gui;;;class]Text]',
                '[[b;#fff;]Text]',
                '[[b;red;blue]Text]'];
            var not_formattings = [
                '[[;;]Text[',
                '[[Text]]',
                '[[Text[[',
                '[[;]Text]',
                'Text]',
                '[[Text',
                '[;;]Text]'];
            formattings.forEach(function(formatting) {
                expect($.terminal.is_formatting(formatting)).toEqual(true);
            });
            not_formattings.forEach(function(formatting) {
                expect($.terminal.is_formatting(formatting)).toEqual(false);
            });
        });
    });
    describe('$.terminal.escape_regex', function() {
    });
    describe('$.terminal.have_formatting', function() {
    });
    describe('$.terminal.valid_color', function() {
    });
    describe('$.terminal.format', function() {
        var format = '[[biugs;#fff;#000]Foo][[i;;;foo]Bar][[ous;;]Baz]';
        it('should create html span tags with style and classes', function() {
            var string = $.terminal.format(format);
            expect(string).toEqual('<span style="font-weight:bold;text-decorat'+
                                   'ion:underline line-through;font-style:ital'+
                                   'ic;color:#fff;text-shadow:0 0 5px #fff;bac'+
                                   'kground-color:#000" data-text="Foo">Foo</s'+
                                   'pan><span style="font-style:italic;" class'+
                                   '="foo" data-text="Bar">Bar</span><span sty'+
                                   'le="text-decoration:underline line-through'+
                                   ' overline;" data-text="Baz">Baz</span>');
        });
    });
    describe('$.terminal.strip', function() {
        var formatting = '-_-[[biugs;#fff;#000]Foo]-_-[[i;;;foo]Bar]-_-[[ous;;'+
            ']Baz]-_-';
        var result = '-_-Foo-_-Bar-_-Baz-_-';
        it('should remove formatting', function() {
            expect($.terminal.strip(formatting)).toEqual(result);
        });
    });
    describe('$.terminal.split_equal', function() {
        var text = ['[[bui;#fff;]Lorem ipsum dolor sit amet, consectetur adipi',
            'scing elit. Nulla sed dolor nisl, in suscipit justo. Donec a enim',
            ' et est porttitor semper at vitae augue. Proin at nulla at dui ma',
            'ttis mattis. Nam a volutpat ante. Aliquam consequat dui eu sem co',
            'nvallis ullamcorper. Nulla suscipit, massa vitae suscipit ornare,',
            ' tellus] est [[b;;#f00]consequat nunc, quis blandit elit odio eu ',
            'arcu. Nam a urna nec nisl varius sodales. Mauris iaculis tincidun',
            't orci id commodo. Aliquam] non magna quis [[i;;]tortor malesuada',
            ' aliquam] eget ut lacus. Nam ut vestibulum est. Praesent volutpat',
            ' tellus in eros dapibus elementum. Nam laoreet risus non nulla mo',
            'llis ac luctus [[ub;#fff;]felis dapibus. Pellentesque mattis elem',
            'entum augue non sollicitudin. Nullam lobortis fermentum elit ac m',
            'ollis. Nam ac varius risus. Cras faucibus euismod nulla, ac aucto',
            'r diam rutrum sit amet. Nulla vel odio erat], ac mattis enim.'
        ].join('');
        it('should split text that into equal length chunks', function() {
            var cols = [10, 40, 60, 400];
            for (var i=cols.length; i--;) {
                var lines = $.terminal.split_equal(text, cols[i]);
                var success = true;
                for (var j=0; j<lines.length; ++j) {
                    if ($.terminal.strip(lines[j]).length > cols[i]) {
                        success = false;
                        break;
                    }
                }
                expect(success).toEqual(true);
            }
        });
    });
});
function support_animations() {
    var animation = false,
    animationstring = 'animation',
    keyframeprefix = '',
    domPrefixes = 'Webkit Moz O ms Khtml'.split(' '),
    pfx  = '',
    elm = document.createElement('div');
    if (elm.style.animationName) { animation = true; }
    if (animation === false) {
        for (var i = 0; i < domPrefixes.length; i++) {
            var name = domPrefixes[i] + 'AnimationName';
            if (elm.style[ name ] !== undefined) {
                pfx = domPrefixes[i];
                animationstring = pfx + 'Animation';
                keyframeprefix = '-' + pfx.toLowerCase() + '-';
                animation = true;
                break;
            }
        }
    }
    return animation;
}
function enter_text(text) {
    var e;
    var $root = $(document.documentElement || window);
    for (var i=0; i<text.length; ++i) {
        e = $.Event("keypress");
        e.which = text.charCodeAt(i);
        $root.trigger(e);
    }
}
function enter_key() {
    var e = $.Event("keydown");
    e.ctrlKey = false;
    e.which = e.keyCode = 13;
    $(document.documentElement || window).trigger(e);
}
function shortcut(ctrl, alt, which) {
    var e = $.Event("keydown");
    e.ctrlKey = ctrl;
    e.altKey = alt;
    e.which = e.keyCode = which;
    $(document.documentElement || window).trigger(e);
}
$(function() {
    describe('Terminal plugin', function() {
        describe('terminal create / terminal destroy', function() {
            var term = $('<div></div>').appendTo('body').terminal();
            it('should create terminal', function() {
                expect(term.length).toBe(1);
            });
            it('should have proper elements', function() {
                expect(term.hasClass('terminal')).toBe(true);
                expect(term.find('.terminal-output').length).toBe(1);
                expect(term.find('.cmd').length).toBe(1);
                var prompt = term.find('.prompt');
                expect(prompt.length).toBe(1);
                expect(prompt.is('span')).toBe(true);
                expect(prompt.children().length).toBe(1);
                var cursor = term.find('.cursor');
                expect(cursor.length).toBe(1);
                expect(cursor.is('span')).toBe(true);
                expect(cursor.prev().is('span')).toBe(true);
                expect(cursor.next().is('span')).toBe(true);
                term.focus(true);
                if (support_animations()) {
                    expect(cursor.hasClass('blink')).toBe(true);
                }
                expect(term.find('.clipboard').length).toBe(1);
            });
            it('should have signature', function() {
                var sig = term.find('.terminal-output div div').map(function() { return $(this).text(); }).get().join('\n');
                expect(term.signature().replace(/ /g, '\xA0')).toEqual(sig);
            });
            it('should have default prompt', function() {
                var prompt = term.find('.prompt');
                expect(prompt.html()).toEqual("<span>&gt;&nbsp;</span>");
                expect(prompt.text()).toEqual('>\xA0');
            });
            it('should destroy terminal', function() {
                term.destroy();
                expect(term.children().length).toBe(0);
                term.remove();
            });
        });
        describe('exec', function() {
            var interpreter = {
                foo: function() {
                }
            };
            
            var term = $('<div></div>').appendTo('body').terminal(interpreter);
            
            it('should execute function', function() {
                spyOn(interpreter, 'foo').and.callThrough();
                term.exec('foo').then(function() {
                    expect(interpreter.foo).toHaveBeenCalled();
                    term.destroy().remove();
                });
            });
        });
        describe('enter text', function() {
            var interpreter = {
                foo: function() {
                }
            };
            var term = $('<div></div>').appendTo('body').terminal(interpreter);
            it('text should appear and interpreter function should be called', function() {
                term.focus(true);
                spyOn(interpreter, 'foo').and.callThrough();
                enter_text('foo');
                enter_key();
                expect(interpreter.foo).toHaveBeenCalled();
                var last_div = term.find('.terminal-output > div:last-child');
                expect(last_div.hasClass('command')).toBe(true);
                expect(last_div.children().html()).toEqual('<span>&gt;&nbsp;foo</span>');
                term.destroy().remove();
            });
        });
        describe('prompt', function() {
            var term = $('<div></div>').appendTo('body').terminal($.noop, {
                prompt: '>>> '
            });
            it('should return prompt', function() {
                expect(term.get_prompt()).toEqual('>>> ');
                expect(term.find('.prompt').html()).toEqual('<span>&gt;&gt;&gt;&nbsp;</span>');
            });
            it('should set prompt', function() {
                term.set_prompt('||| ');
                expect(term.get_prompt()).toEqual('||| ');
                expect(term.find('.prompt').html()).toEqual('<span>|||&nbsp;</span>');
                function prompt(callback) {
                    callback('>>> ');
                }
                term.set_prompt(prompt);
                expect(term.get_prompt()).toEqual(prompt);
                expect(term.find('.prompt').html()).toEqual('<span>&gt;&gt;&gt;&nbsp;</span>');
            });
            it('should format prompt', function() {
                var prompt = '<span style="font-weight:bold;text-decoration:underline;color:#fff;" data-text=">>>">&gt;&gt;&gt;</span><span>&nbsp;</span>';
                term.set_prompt('[[ub;#fff;]>>>] ');
                expect(term.find('.prompt').html()).toEqual(prompt);
                term.set_prompt(function(callback) {
                    callback('[[ub;#fff;]>>>] ');
                });
                expect(term.find('.prompt').html()).toEqual(prompt);
                term.destroy().remove();
            });
        });
        describe('cmd plugin', function() {
            var term = $('<div></div>').appendTo('body').css('overflow-y', 'scroll').terminal($.noop, {name: 'cmd'});
            var string = '';
            for (var i=term.cols(); i--;) {
                term.insert('M');
            }
            var cmd = term.cmd();
            var line = cmd.find('.prompt').next();
            it('text should have 2 lines', function() {
                expect(line.is('div')).toBe(true);
                expect(line.text().length).toBe(term.cols()-2);
            });
            it('cmd plugin moving cursor', function() {
                cmd.position(-8, true);
                var before = cmd.find('.prompt').next();
                var cursor = cmd.find('.cursor');
                var after = cursor.next();
                expect(before.is('span')).toBe(true);
                expect(before.text().length).toBe(term.cols()-8);
                expect(after.next().text().length).toBe(2);
                expect(after.text().length).toBe(5);
                expect(cursor.text()).toBe('M');
            });
            it('should remove characters', function() {
                cmd['delete'](-10);
                var before = cmd.find('.prompt').next();
                var cursor = cmd.find('.cursor');
                var after = cursor.next();
                expect(before.text().length).toEqual(term.cols()-8-10);
                cmd['delete'](8);
                expect(cursor.text()).toEqual('\xA0');
                expect(after.text().length).toEqual(0);
            });
            var history = cmd.history()
            it('should have one entry in history', function() {
                term.set_command('something').focus(true);
                enter_key();
                expect(history.data()).toEqual(['something']);
            });
            it('should not add item to history if history is disabled', function() {
                history.disable();
                term.set_command('something else');
                enter_key();
                expect(history.data()).toEqual(['something']);
                history.enable();
            });
            it('should remove commands from history', function() {
                spyOn(history, 'purge').and.callThrough();
                cmd.purge();
                expect(history.purge).toHaveBeenCalled();
                expect(history.data()).toEqual([]);
            });
            it('should have name', function() {
                expect(cmd.name()).toEqual('cmd_4');
            });
            it('should return command', function() {
                cmd.set('foo');
                expect(cmd.get()).toEqual('foo');
            });
            it('should not move position', function() {
                var pos = cmd.position();
                cmd.insert('bar', true);
                expect(cmd.position()).toEqual(pos);
            });
            it('should return $.noop for commands', function() {
                expect($.terminal.active().commands()).toEqual($.noop);
            });
            it('should set position', function() {
                cmd.position(0);
                expect(cmd.position()).toEqual(0);
            });
            it('should set and remove mask', function() {
                cmd.mask('•');
                cmd.position(6);
                var before = cmd.find('.prompt').next();
                expect(before.text()).toEqual('••••••');
                expect(cmd.get()).toEqual('foobar');
                cmd.mask(false);
                expect(before.text()).toEqual('foobar');
            });
            it('should execute functions on shortcuts', function() {
                spyOn(cmd, 'position').and.callThrough();
                shortcut(true, false, 65); // CTRL+A
                expect(cmd.position).toHaveBeenCalled();
                spyOn(cmd, 'delete').and.callThrough();
                shortcut(true, false, 75); // CTRL+K
                expect(cmd['delete']).toHaveBeenCalled();
                spyOn(cmd, 'insert').and.callThrough();
                shortcut(true, false, 89); // CTRL+Y
                expect(cmd.insert).toHaveBeenCalled();
                shortcut(true, false, 85); // CTRL+U
                expect(cmd.kill_text()).toEqual('foobar');
            });
        });
    });
});
