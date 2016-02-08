
(function() {

// function $(selector, context) {
//   context = context || document;
//   return Array.prototype.slice.call(context.querySelectorAll(selector), 0);
// }

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
  var nodes = range(0, vCount - 1).map(function(x) {
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

  var edges = combinations(range(0, vCount - 1), 2)
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

var textareas = {};
var _textarea = "source";
function getTextarea() {
  return textareas[_textarea];
}

var KERNAL_CODE = null;
var CRYPTIC_CODE = null;

function initialize() {
  $.get("text/kernal-code.cpp", function(kText) {
  $.get("text/cryptic-code.txt", function(cText) {
    KERNAL_CODE = kText;
    CRYPTIC_CODE = cText;
    textareas.source = Textarea($('#source-code')[0], KERNAL_CODE);
    // range(0, 50).map(function(x) {
    //   textareas.source.write(3);
    // });
    setInterval(textareas.source.blink, 500);
  });
  });
}
initialize();

function popUpScript() {
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

  var textbox;
  var i = setInterval(function() { textbox.write(3); }, 5);
  textbox = Textarea($script, CRYPTIC_CODE.slice(50*(i%10)));

  $script.style.zIndex = i;

  setTimeout(function() {
    clearInterval(i);
    $($script).remove();
  }, 2000);
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
    t %= tMax;
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


// tournamentGraph();
window.onkeypress = function control(e) {
  if(e.shiftKey) {
    console.log(e.keyCode);
    // run effect
    if(e.keyCode === 84) { // T
      tournamentGraph();
    }

    if(e.keyCode === 80) { // P
      popUpScript();
    }

    if(e.keyCode === 76) { // L
      tensorLoader();
    }
    
    if(e.keyCode === 70) { // F
      if(screenfull.enabled) {
        screenfull.request();
      }
    }

    if(e.keyCode === 83) { // S
      soundBarGraph();
    }

    if(e.keyCode === 32) { // [space]
      screenLock();
    }

  } else {
    // write code
    getTextarea().write(3);
  }
}

}).call(this);

