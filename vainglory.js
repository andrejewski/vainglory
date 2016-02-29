
function factorial(n){
	if(n < 0) return undefined;
	if(n == 0) return 1;
	return n * factorial(n - 1);
};

function choose(n, k){
	if (k > n){
		return 0;
	}
	var nFact = factorial(n);
	var kFact = factorial(k);
	var nkFact = factorial(n-k);

	var numerator = nFact;
	var denominator = kFact * nkFact;
	var ans = numerator / denominator;
	return ans;
};

function range(to, from, step) {
  var list = [];
  step = step || 1;
  while(to != from) {
    list.push(to);
    to += step;
  }
  return list;
}

// http://rosettacode.org/wiki/Combinations#JavaScript
function combinations(arr, k){
  var i,
  subI,
  ret = [],
  sub,
  next;
  for(i = 0; i < arr.length; i++){
      if(k === 1){
          ret.push( [ arr[i] ] );
      }else{
          sub = combinations(arr.slice(i+1, arr.length), k-1);
          for(subI = 0; subI < sub.length; subI++ ){
              next = sub[subI];
              next.unshift(arr[i]);
              ret.push( next );
          }
      }
  }
  return ret;
}

_tg = null;
function tournamentGraph() {
  var $tg = $('#tournament-graph')[0];
  $tg.classList.toggle('hidden');
  _tg = !$tg.classList.contains('hidden')
    ? setInterval(renderTournamentGraph(), 40)
    : clearInterval(_tg);
}

function renderTournamentGraph() {
  var t = 0;
  var $tc = $("#tournament-graph canvas")[0];
  var ctx = $tc.getContext('2d');
  var size = {
    width: $tc.width,
    height: $tc.height
  };

  var mag = (Math.min(size.width, size.height)/2) - 10;
  var vCount = 12;
  var nodes = range(0, vCount).map(function(x) {
    var theta = x * ((2 * Math.PI)/vCount);
    var vector = [
      (size.width/2) + (mag * Math.cos(theta)),
      (size.height/2) + (mag * Math.sin(theta))
    ];
    return vector;
  });

  var _color = [128, 128, 128];
  function color() {
    _color = _color.map(function(x, i) {
      x += Math.floor(10/i);
      return x > 255 ? 128 : x;
    });
    return "rgb("+_color.join(',')+")";
  }

  var edges = combinations(range(0, vCount), 2)
    .map(function(combo) {
      return [nodes[combo[0]], nodes[combo[1]]];
    });

  function renderBackground() {
    ctx.strokeStyle = "#234";
    ctx.beginPath();
    nodes.concat([nodes[0]]).forEach(function(p, i) {
      if(i === 0) {
        ctx.moveTo(p[0], p[1]);
      } else {
        ctx.lineTo(p[0], p[1]);
      }
    });
    ctx.stroke();
  }

  function renderProgress(t) {
    // ctx.strokeStyle = color();
    ctx.strokeStyle = "#123";
    ctx.beginPath();
    edges.slice(0, t).forEach(function(e, i) {
      if(i === 0) {
        ctx.moveTo(e[0][0], e[0][1]);
      } else {
        ctx.lineTo(e[0][0], e[0][1]);
      }
      ctx.lineTo(e[1][0], e[1][1]);
    });
    ctx.stroke();
  }

  function randomNode(list) {
    while(true) {
      var node = nodes[Math.floor(Math.random()*nodes.length)];    
      var uniq = true;
      for(var i = 0; i < list.length; i++) {
        var item = list[i];
        uniq = uniq && !(node[0] === item[0] && node[1] === item[1]);
      }
      if(uniq) return node;
    }
  }

  var _path = [];
  function renderPath() {
    ctx.strokeStyle = '#0f0';
    if(_path.length === 0 || _path.length === vCount - 1) {
      ctx.clearRect(0, 0, size.width, size.height);
      renderProgress(tMax);
      _path = [randomNode([])];
    }
    _path.push(randomNode(_path));
    ctx.beginPath();
    var i = _path[_path.length - 2];
    var f = _path[_path.length - 1];
    ctx.moveTo(i[0], i[1]);
    ctx.lineTo(f[0], f[1]);
    ctx.stroke();
  }

  // renderBackground();

  var tMax = choose(vCount, 2);
  return function _renderTournamentGraph() {
    renderPath();
  }
}

function Textarea(el, text) {
  var cursor = '|';
  var c = 0;
  function write(chuck) {
    c += chuck;
    var code = text.slice(0, c).split('\n').join('<br/>');
    if(b) code += cursor;
    el.innerHTML = code;
    el.scrollTop = el.scrollHeight;
  }

  var b = false;
  function blink() {
    if(el.innerHTML.slice(-1) === cursor) {
      b = false;
      el.innerHTML = el.innerHTML.slice(0, -1);
    } else {
      b = true;
      el.innerHTML += cursor;
    }
  }

  return {write: write, blink: blink};
}

function popUpScript() {
  if(!source.loaded()) return;
  var $script = document.createElement('pre');
  $script.className = "pop-up-script";
  $("#pop-up-scripts").append($script);

  var size = 400;

  $script.style.width  = size + "px";
  $script.style.height = size + "px";

  var x = Math.floor(Math.random() * $(window).width()) + 20;
  var y = Math.floor(Math.random() * $(window).height())+ 20;

  if(x + size > $(window).width()) x = Math.max(20, x - size);
  if(y + size > $(window).height()) y = Math.max(20, y - size);

  $script.style.left = x + "px";
  $script.style.top  = y + "px";

  var index = Math.floor(Math.random() * source.files.length);
  var file = source.files[index];

  var textbox;
  var i = setInterval(function() { textbox.write(3); }, 5);
  textbox = Textarea($script, file.slice(50*(i%10)));

  $script.style.zIndex = i;

  setTimeout(function() {
    clearInterval(i);
    $($script).remove();
  }, 2000);
}

function popUpLoader() {
  var $script = document.createElement('div');
  $script.className = "pop-up-loader";
  $("#pop-up-scripts").append($script);

  var $loader = document.createElement('div');
  $script.appendChild($loader);

  var size = 300;
  var innerSize = size - 12;

  $script.style.width  = size + "px";
  $script.style.height = 50 + "px";

  var x = Math.floor(Math.random() * $(window).width()) + 20;
  var y = Math.floor(Math.random() * $(window).height())+ 20;

  if(x + size > $(window).width()) x = Math.max(20, x - size);
  if(y + size > $(window).height()) y = Math.max(20, y - size);

  $script.style.left = x + "px";
  $script.style.top  = y + "px";

  var lifeSpan = Math.floor(Math.random() * 3500) + 500;
  var tickSpan = lifeSpan/100;
  var finishDelay = 200;

  var t = 0;
  var i = setInterval(function() {
    var percent = ((t++ * tickSpan) / lifeSpan);
    if(percent > 1) return;
    $loader.style.width = (innerSize*percent) + 'px';
  }, tickSpan);

  $script.style.zIndex = i;

  setTimeout(function() {
    clearInterval(i);
    $($script).remove();
  }, lifeSpan + finishDelay);
}

var _tl = null;
function tensorLoader() {
  var $tl = $('#tensor-loader')[0];
  $tl.classList.toggle('hidden');
  _tl = !$tl.classList.contains('hidden')
    ? setInterval(renderTensorLoader(), 20)
    : clearInterval(_tl);
}

function renderTensorLoader() {
  var barCount = 10;
  var barDepth = 3;

  var t = 0;
  var tMax = Math.pow(barCount, barDepth);

  function loader(t, max, depth) {
    if(max < 10) return "";
    return range(0, Math.ceil(t / (max / 10)))
      .map(function(x, i) {
        var rest = t % ((i+1) * (max/10));
        var bars = rest 
          ? loader(rest, (max/10), depth + 1)
          : "";
        var barClass = depth % 2
          ? "bar-col"
          : "bar-row";
        return "<div class='bar "+barClass+"'>"+bars+"</div>";
      }).join('');
  }

  // function l(t, tMax, depth) {
  //   return range(0, Math.floor(t / tMax / 10))
  //     .map(function (x) {
  //       return range(0, 10).map(function() );

  //     });
  // }

  function tensor(t, tMax) {
    if(tMax < 10) return t;
    var fullBarCount = Math.floor(t / (tMax / barCount));
    var remainder = t - (fullBarCount * (tMax / barCount));
    var table = range(0, fullBarCount).map(function(x) {
      return tensor(tMax/10, tMax/10);
    });
    if(remainder) {
      table.push(tensor(remainder, tMax/10));
    }
    return table;
  }

  function htmlTensor(tensor, depth) {
    depth = depth || 0;
    var bars = (Array.isArray(tensor) ? tensor : []) 
      .map(function(t) {
        return htmlTensor(t, depth + 1);
      }).join('');
    if(!depth) return bars;
    var barClass = depth % 2
      ? 'bar-col'
      : 'bar-row';
    return "<div class='bar "+barClass+"'>"+bars+"</div>";
  }
  

  var $tl = $('#tensor-loader')[0];
  return function _renderTensorLoader() {
    if(t > tMax) return;
    $tl.innerHTML = htmlTensor(tensor(t++, tMax), 0);
  }
}

var _sb = null;
function soundBarGraph() {
  var $sb = $('#sound-bar-graph')[0];
  $sb.classList.toggle('hidden');
  _sb = !$sb.classList.contains('hidden')
    ? setInterval(renderSoundBarGraph(), 40)
    : clearInterval(_sb);
}

function renderSoundBarGraph() {
  var barCount = 80;
  var barHeight = 40;

  var barMax = 10;

  var bars = range(0,barCount)
    .map(function() {return 0;});

  function updateBars(bars) {
    return bars.map(function(x) {
      if(x === 0) return 1;
      if(x === barMax) return barMax - 9;
      return x + Math.round(Math.random());
    });
  }

  function renderBars(bars) {
    return bars
      .map(function(bar) {
        var x = bar * barHeight;
        return "<div class='sound-bar' style='height:"+x+"px'></div>";
      })
      .join('');
  }

  var $sb = $('#sound-bar-graph')[0];
  return function _renderSoundBarGraph() {
    $sb.innerHTML = renderBars(bars = updateBars(bars));  
  }
}

var _sl = null;
function screenLock() {
  var $sl = $('#screen-lock')[0];
  $sl.classList.toggle('hidden');
  _sl = !$sl.classList.contains('hidden')
    ? setInterval(renderScreenLock(), 80)
    : clearInterval(_sl);
}

function renderScreenLock() {
  var sizeCount = 40;
  var charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
  function randChar() {
    return charset[Math.floor(Math.random() * charset.length)];
  }

  var lock = range(0, sizeCount)
    .map(function(x) {return range(0, sizeCount)
      .map(function(y) {return randChar();});});

  var lockMask = range(0, sizeCount)
    .map(function(x) {return range(0, sizeCount)
      .map(function(y) {return 0;})});

  function maskLine(x, y, size, vertical) {
    if(vertical) {
      for(var i = 0; i < size; i++) {
        lockMask[y+i][x] = 1;
      }
    } else {
      for(var i = 0; i < size; i++) {
        lockMask[y][x+i] = 1;
      }
    } 
  }

  [
    // [2,2,8,true],
    [12,15,14,false],
    [12,15,12,true],
    [26,15,12,true],
    [12,26,14,false],
    [12,24,12,false],
    [12,22,12,false],
    [12,20,14,false],
  ].forEach(function(line) { maskLine.apply(null, line); });

  function updateLock(lock) {
    var lockChar = "&nbsp;";
    for(var i = 0; i < lock.length; i++) {
      for(var j = 0; j < lock[0].length; j++) {
        lock[i][j] = lockMask[i][j] ? lockChar : randChar();
      }
    }
    return lock;
  }

  function renderLock(lock) {
    return lock.map(function(row) {
      return row.join('');
    }).join('<br/>');
  }

  var $sl = $('#screen-lock')[0];
  return function _renderScreenLock() {
    $sl.innerHTML = renderLock(lock = updateLock(lock));
  }
}

var _sf = null;
function serverFarm() {
  var $sf = $('#server-farm')[0];
  $sf.classList.toggle('hidden');
  var rsf = renderServerFarm();
  rsf();
  _sf = !$sf.classList.contains('hidden')
    ? setInterval(rsf, 1000)
    : clearInterval(_sf);
}

function renderServerFarm() {
  var farmSize = 20;
  var farm = range(0, farmSize)
    .map(function(x) {
      return {
        name: 's'+(x+1),
        major: 1,
        minor: 0,
        patch: 0,
      };
    });

  function updateFarm(farm) {
    return farm.map(function(s) {
      s.failing = (Math.random() * 100) < 5;
      if(s.failing) s.patch++;
      if(s.patch > 9) {
        s.minor++;
        s.patch = 0;
      }
      if(s.minor > 9) {
        s.major++;
        s.minor = 0;
      }
      return s;
    });
  }

  function renderFarm(farm) {
    return farm.map(function(s) {
      var serverClass = 'server';
      if(s.failing) serverClass += ' server-failing';
      return [
        "<div class='"+serverClass+"'>",
          "<h4>"+s.name+"</h4>",
          "<span>v"+s.major+"."+s.minor+"."+s.patch+"</span>",
        "</div>"
      ].join('');
    }).join('');
  }

  var $sf = $('#server-farm')[0];
  return function _renderServerFarm() {
    $sf.innerHTML = renderFarm(farm = updateFarm(farm));
  }
}

var _pb = null;
function passwordBreaker() {
  var $pb = $('#password-breaker')[0];
  $pb.classList.toggle('hidden');
  _pb = !$pb.classList.contains('hidden')
    ? setInterval(renderPasswordBreaker(), 50)
    : clearInterval(_pb);
}

function renderPasswordBreaker() {
  var t = 1;
  var tMax = 20;
  var passwordSize = 12;
  var passwordCount = 20;

  var charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
  function randChar() {
    return charset[Math.floor(Math.random() * charset.length)];
  }

  var list = [range(0, passwordSize).map(randChar).join('')];
  function combos(list, prepend) {
    list[0] = range(0, passwordSize).map(randChar).join('');
    if(!prepend) return list;
    return [list[0], list[0]].concat(list.slice(1)).slice(0, passwordCount);
  }

  function renderList(list) {
    return list.map(function(code) {
      return '<div>'+code
        .split('')
        .map(function(x) {return '<i>'+x+'</i>'})
        .join('')+'</div>';
    }).join('');
  }

  var $pb = $('#password-breaker')[0];
  return function _renderPasswordBreaker() {
    t %= tMax;
    $pb.innerHTML = renderList(list = combos(list, !t++));
  }
}

var source = (function() {
  var filenames = [
    "text/kernal-code.cpp",
    "text/vim-makefile.txt",
    "text/vsprintf.c",
    "text/brain-fuck.txt",
  ];

  var files = [,,,];

  var loaded = false;
  var getCount = 0;

  filenames.forEach(function(filename, index) {
    $.get(filename, function(text) {
      files[index] = text;
      loaded = ++getCount === filenames.length;
    });
  });

  return {
    loaded: function() {return loaded;},
    files: files,
  };
})();

var editor = (function() {
  var isVSplit = false;
  var isHSplit = false;

  var sizes = [0,0,0,0];
  var focused = 0;
  var loaded = false;
  var blinking = false;
  var cursor = '|';

  var $editor = $('#editor');

  function setClass($el, className, bool) {
    if(bool) {
      $el.addClass(className);
    } else {
      $el.removeClass(className);
    }
  }

  function drawEditor(untriggered) {
    if(!source.loaded()) return;
    setClass($('.frame'), 'focused', false);
    setClass($('.vsplit'), 'hidden', !isVSplit);
    setClass($('.hsplit'), 'hidden', !isHSplit);
    var focus = $('.frame')[focused];

    var width = $editor.innerWidth() / (isVSplit + 1); 
    var height = $editor.innerHeight() / (isHSplit + 1); 
    $('.frame:not(.hidden)').css({
      width: width,
      height: height,
    });

    focus.classList.add('focused');
    $('.frame').each(function(index, elem) {
      $(elem).text(source.files[index].slice(0, sizes[index]));
    });

    if(!untriggered) return;
    if(blinking = !blinking) focus.innerHTML += cursor;
  }

  setInterval(drawEditor.bind(null, true), 500);
  $editor.on('click', '.frame', function(e) {
    focused = $('.frame', $editor).index(this);
    drawEditor();
  });

  function vsplit() {
    isVSplit = !isVSplit;
    if(!isVSplit && focused % 2 !== 0) focused--; 
  }

  function hsplit() {
    isHSplit = !isHSplit;
    if(!isHSplit && focused > 1) focused -= 2; 
  }

  function focus(i) {
    i = Math.min(Math.max(0, i), sizes.length);
    if(!isHSplit && !isVSplit) {
      i = 0;
    } else if(!isHSplit) {
      if(i === 2) i = 0;
      if(i === 3) i = 1;
    } else if(!isVSplit) {
      if(i === 1) i = 0;
      if(i === 3) i = 2;
    }
    focused = i;
    drawEditor();
  }

  function write(n) {
    sizes[focused] += n;
    drawEditor();
    var el = $('.frame.focused')[0];
    if(el) el.scrollTop = el.scrollHeight;
  }

  function erase(n) {
    sizes[focused] -= n;
    sizes[focused] = Math.max(0, sizes[focused]);
    drawEditor();
  }

  return {
    vsplit: vsplit,
    hsplit: hsplit,
    focus: focus,
    write: write,
    erase: erase,
  };
})();

// tournamentGraph();
window.onkeydown = function control(e) {
  if(e.shiftKey) {
    // console.log(e.keyCode);

    if(e.keyCode === 32) screenLock(); // [space]
    if(e.keyCode === 66) passwordBreaker(); // B
    if(e.keyCode === 70) screenfull.enabled && screenfull.toggle(); // F
    if(e.keyCode === 76) popUpLoader(); // L
    if(e.keyCode === 77) serverFarm(); // M
    if(e.keyCode === 80) popUpScript(); // P
    if(e.keyCode === 83) soundBarGraph(); // S
    if(e.keyCode === 84) tournamentGraph(); // T

    if(e.keyCode === 72) editor.hsplit(); // H
    if(e.keyCode === 86) editor.vsplit(); // V

    if(e.keyCode === 49) editor.focus(0); // 1
    if(e.keyCode === 50) editor.focus(1); // 2
    if(e.keyCode === 51) editor.focus(2); // 3
    if(e.keyCode === 52) editor.focus(3); // 4

  } else {
    if(e.keyCode === 8) { // [Backspace]
      e.preventDefault();
      editor.erase(1);
    } else {
      editor.write(3);
    }
  }
}

