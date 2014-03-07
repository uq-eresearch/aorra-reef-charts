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
  'grazing',
  'sugarcane',
  'horticulture',
  'groundcover',
  'nitrogen',
  'sediment',
  'pesticides'
];
var viewboxes = {
  'cape-york': '100 50 100 450',
  'wet-tropics': '270 460 300 260',
  'burdekin': '220 640 100 550',
  'mackay-whitsunday': '520 740 100 300',
  'fitzroy': '410 880 100 480',
  'burnett-mary': '700 1120 100 268'
};

var app = Sammy('#main', function() {
    
  // Default lander
  this.get('#/', function() {
    // this context is a Sammy.EventContext
    this.$element() // $('#main')
        .html($('#tmpl-home').html());
    this.trigger('region:show', 'gbr');
  });
  
  this.get('#/marine', function() {
    var context = this;
    this.$element()
        .html($('#tmpl-marine-select').html());
    this.trigger('region:show', 'gbr');
    this.trigger('marine:show');
  });
  
  this.get('#/marine/:indicator', function() {
    this.$element()
        .html($('#tmpl-'+this.params['indicator']+'-info').html());
    this.trigger('indicator:show', this.params['indicator']);
  });
  
  this.get('#/progress', function() {
    this.$element()
        .html($('#tmpl-progress-select').html());
    this.$element().find('button[data-indicator]').click(function(evt) {
      var $button = $(evt.target);
      this.redirect('#', 'progress', $button.attr('data-indicator'));
    }.bind(this));
    this.trigger('region:show', 'gbr');
  });
  
  this.get('#/progress/:indicator', function() {
    this.$element()
        .html($('#tmpl-'+this.params['indicator']+'-info').html());
    this.trigger('indicator:show', this.params['indicator']);
  });
  
  this.get('#/region/:region', function() {
    this.$element()
        .html($('#tmpl-'+this.params['region']+'-info').html());
    this.trigger('region:show', this.params['region']);
    this.trigger('marine:show');
  });
  
  this.bind('indicator:show', function(evt, id) {
    $('#regions').addClass(id);
  });
  
  this.bind('marine:show', function() {
    this.$element().find('.marine-chart #indicators path').click(function(evt) {
      var indicator = evt.target.id;
      //this.redirect('/')
      console.log(indicator);
    }.bind(this));
  });
  
});

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

function getMarineStyle(data) {
  return Object.keys(data).reduce(function(lr, region) {
    var values = data[region];
    return lr.concat(Object.keys(values).reduce(function(li, indicator) {
      var value = values[indicator];
      return li.concat(
        '.marine-chart.'+region+' #'+indicator+" { fill: "+getFill(value).normal+"; pointer-events: all; }",
        '.marine-chart.'+region+' #'+indicator+':hover, .marine-chart.'+region+' #'+indicator+".active { fill: "+getFill(value).active+"; cursor: pointer; }"
      );
    }, []));
  }, []).join("\n");
}

function getRegionStyle(data) {
  return Object.keys(data).reduce(function(lr, region) {
    var values = data[region];
    return lr.concat(Object.keys(values).reduce(function(li, indicator) {
      var value = values[indicator];
      var ruleSelector = '.'+indicator+'#regions #'+region;
      if (value == 'NA') {
        return li.concat(ruleSelector+" { display: none; }");
      }
      return li.concat(
        ruleSelector+" { fill: "+getFill(value).normal+"; }"
      );
    }, []));
  }, []).join("\n");
}

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
  
  [ getMarineStyle(marineData), 
    getRegionStyle(marineData),
    getRegionStyle(progressData) ].forEach(function(styleContent) {
    $('body').append(
        $('<style type="text/css"/>').html(styleContent));
  });

  loadSvg('#regions', 'regions.svg', 'Min').done(function(regions) {
    var setRegionStyle = (function() {
      var style = null;
      var removeStyle = function() {
        if (style) {
          regions.remove(style);
        }
        style = null;
      };
      Sammy('#main', function() {
        this.bind('region:show', function(evt, region) {
          if (region == 'gbr') {
            $('#regions').removeClass();
          }
        });
      });
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
    Sammy('#main', function() {
      this.bind('region:show', function(evt, region) {
        if (region == 'gbr' && zoomed != "gbr") {
          $(regions.root()).animate({
            'svgViewBox': defaultViewbox
          }, 1000);
          zoomed = "gbr";
        }
      });
    });
          
    Object.keys(viewboxes).forEach(function(regionName) {
      var e = regions.getElementById(regionName);
      if (e) {
        Sammy('#main', function() {
          var application = this;
          this.bind('region:show', function(evt, r) {
            if (r == regionName) {
              $(regions.root()).animate({
                'svgViewBox': viewboxes[regionName]
              }, 1000);
              zoomed = regionName;
            }
          });
          $(e).on('click', function() {
            if (zoomed == regionName) {
              application.setLocation('#/');
            } else {
              application.setLocation('#/region/'+regionName);
            }
          });
        });
      }
    });
    
    Object.keys(progressData.gbr).forEach(function(indicator) {
      Sammy('#main', function() {
        var condition = progressData.gbr[indicator];
        var name = indicator.substring(0,1).toUpperCase() + indicator.substring(1);
        var $button = $('<button/>').text(name);
        $button.addClass(condition.toLowerCase().replace(' ', '-'));
        $button.attr('data-indicator', indicator);
        $('#progress-list').append($button);
      });
    });
    
    loadSvg('#marine-chart', 'marine.svg', 'Mid').done(function(marine) {
      $('.marine-chart').html($('#marine-chart').html());
      $('#marine-chart').remove();
      // Run app now that regions & marine are loaded
      app.run('#/');
    });
  });
});