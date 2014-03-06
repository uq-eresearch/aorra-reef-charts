var conditions = ["Very Good", "Good", "Moderate", "Poor", "Very Poor"];
var regions = [
  'gbr',
  'cape-york',
  'wet-tropics',
  'burdekin',
  'mackay-whitsunday',
  'fitzroy',
  'burnett-mary'
];
var marineIndicators = [
  'overall',
  'water-chlorophyll',
  'coral-change',
  'coral-juvenile',
  'coral-macroalgae',
  'coral-cover',
  'seagrass-abundance',
  'seagrass-reproduction',
  'seagrass-nutrient',
  'water',
  'coral',
  'seagrass',
  'water-solids'
];
var progressIndicators = [
  'Grazing',
  'Sugarcane',
  'Horticulture',
  'Groundcover',
  'Nitrogen',
  'Sediment',
  'Pesticides'
];
var viewboxes = {
  'cape-york': '100 50 100 450',
  'wet-tropics': '270 460 300 260',
  'burdekin': '220 640 100 550',
  'mackay-whitsunday': '520 740 100 300',
  'fitzroy': '410 880 100 480',
  'burnett-mary': '700 1120 100 268'
}

var marineData = regions.reduce(function(hr, vr) {
  hr[vr] = marineIndicators.reduce(function(hi, vi) {
    var randomIndex = Math.floor(Math.random()*conditions.length);
    if (vi.indexOf('coral') == 0 && (vr == 'cape-york' || vr == 'burnett-mary')) {
      hi[vi] = 'NA';
    } else {
      hi[vi] = conditions[randomIndex];
    }
    return hi;
  }, {});
  return hr;
}, {});

var progressData = regions.reduce(function(hr, vr) {
  hr[vr] = progressIndicators.reduce(function(hi, vi) {
    var randomIndex = Math.floor(Math.random()*conditions.length);
    if (vr == 'cape-york' && ['Sugercane', 'Groundcover', 'Pesticides'].indexOf(vi) > -1) {
      hi[vi] = 'NA';
    } else {
      hi[vi] = conditions[randomIndex];
    }
    return hi;
  }, {});
  return hr;
}, {});

function getFill(v) {
  var fills = {
    'Very Good': {
      'normal': '#7aff66',
      'active': '#22ff00'
    },
    'Good': {
      'normal': '#cfff66',
      'active': '#b0ff00'
    },
    'Moderate': {
      'normal': '#fff666',
      'active': '#fff000'
    },
    'Poor': {
      'normal': '#ffc766',
      'active': '#ffa200'
    },
    'Very Poor': {
      'normal': '#ff6966',
      'active': '#ff0400'
    }
  };
  if (fills[v]) {
    return fills[v];
  } else {
    return { normal: '#e5e5e5', active: '#e5e5e5' };
  }
}

function getRegionData(data, indicator) {
  return Object.keys(data).reduce(function(h, k) {
    h[k] = data[k][indicator];
    return h;
  }, {});
}

function getMarineStyle(values) {
  return Object.keys(values).map(function(key) {
    var value = values[key];
    return '#'+key+" { fill: "+getFill(value).normal+"; pointer-events: all; }\n" +
           '#'+key+":hover, #"+key+".active { fill: "+getFill(value).active+"; cursor: pointer; }";
  }).join("\n");
}

function getRegionStyle(values) {
  return Object.keys(values).map(function(key) {
    var value = values[key];
    if (value == 'NA') {
      return '#'+key+" { display: none; }";
    }
    return '#'+key+" { fill: "+getFill(value).normal+"; }";
  }).join("\n");
}

var handlers = { onLeave: function() {} };
$(document).ready(function() {
  
  function loadSvg(containerSelector, url, align) {
    $(containerSelector).svg();
    var svg = $(containerSelector).svg('get');
    var d = $.Deferred();
    svg.load(url, { 
      onLoad: function() {
        svg.configure({
          'height': '100%',
          'width': '100%',
          'preserveAspectRatio': 'x'+align+'Y'+align+' meet'
        }, false);
        d.resolve(svg);
      }
    });
    return d.promise();
  }
  
  var setFocus = (function() {
    var focused = null;
    return function (element) {
      if (focused) {
        $(focused).attr('class', 
          $(focused).attr('class').replace(' active', ''));
      }
      focused = element;
      $(focused).attr('class', $(focused).attr('class')+' active');
    };
  })();

  loadSvg('#regions', 'regions.svg', 'Min').done(function(regions) {
    var setRegionStyle = (function() {
      var style = null;
      var removeStyle = function() {
        if (style) {
          regions.remove(style);
        }
        style = null;
      };
      handlers['onLeave'] = removeStyle;
      return function (styleContent) {
        removeStyle();
        style = regions.style(styleContent);
      };
    })();
    var defaultViewbox = (function() {
      var b = regions.root().viewBox.baseVal;
      return [b.x, b.y, b.width, b.height].join(' ');
    })();
    var zoomed = "gbr";
    Object.keys(viewboxes).forEach(function(regionName) {
      var e = regions.getElementById(regionName);
      if (e) {
        $(e).on('click', function() {
          if (zoomed == regionName) {
            $(regions.root()).animate({
              'svgViewBox': defaultViewbox
            }, 1000);
            switchTab('home');
            zoomed = "gbr";
          } else {
            $(regions.root()).animate({
              'svgViewBox': viewboxes[regionName]
            }, 1000);
            switchTab(regionName+'-info');
            zoomed = regionName;
          }
        });
      }
    });
    Object.keys(progressData.gbr).forEach(function(name) {
      var condition = progressData.gbr[name];
      var $button = $('<button/>').text(name);
      $button.addClass(condition.toLowerCase().replace(' ', '-'));
      $button.on('click', function(evt) {
        //setFocus(evt.delegateTarget);
        console.log(name.toLowerCase()+'-info');
        switchTab(name.toLowerCase()+'-info');
        setRegionStyle(getRegionStyle(getRegionData(progressData, name)));
      });
      $('#progress-list').append($button);
    });    
    loadSvg('#marine', 'marine.svg', 'Mid').done(function(marine) {
      marine.style(getMarineStyle(marineData.gbr));
      Object.keys(marineData.gbr).forEach(function(id) {
        var e = marine.getElementById(id);
        if (e) {
          $(e).on('click', function(evt) {
            //setFocus(evt.delegateTarget);
            switchTab(id+'-info');
            setRegionStyle(getRegionStyle(getRegionData(marineData, id)));
          });
        }
      });
    });
  });
});
  
function switchTab(id) {
  $('.inset-paper').find('.tab-pane').removeClass('active');
  $('.inset-paper').find('.tab-pane#'+id).addClass('active');
  handlers.onLeave();
}