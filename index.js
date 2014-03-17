var regionFill = {
  'Cape York': '#ca6722',
  'Wet Tropics': '#82be40',
  'Burdekin': '#686a57',
  'Mackay-Whitsunday': '#dca256',
  'Fitzroy': '#833e15',
  'Burnett-Mary': '#e4ac24'
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
    this.trigger('region:show', 'gbr');
    this.trigger('indicator:show', this.params['indicator']);
  });
  
  this.get('#/progress', function() {
    this.$element()
        .html($('#tmpl-progress-select').html());
    this.trigger('region:show', 'gbr');
    this.trigger('progress:show');
  });
  
  this.get('#/progress/:indicator', function() {
    this.$element()
        .html($('#tmpl-'+this.params['indicator']+'-info').html());
    this.trigger('region:show', 'gbr');
    this.trigger('indicator:show', this.params['indicator']);
  });
  
  this.get('#/region/:region', function() {
    this.$element()
        .html($('#tmpl-'+this.params['region']+'-info').html());
    this.trigger('region:show', this.params['region']);
    this.trigger('marine:show');
    this.trigger('progress:show');
  });
  
  this.bind('marine:show', function() {
    this.$element().find('.marine-chart #indicators path').click(function(evt) {
      var indicator = evt.target.id;
      this.redirect('#', 'marine', indicator);
    }.bind(this));
  });
  
  this.bind('progress:show', function() {
    this.$element().find('button[data-indicator]').click(function(evt) {
      var $button = $(evt.target);
      this.redirect('#', 'progress', $button.attr('data-indicator'));
    }.bind(this));
  });
  
});

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
  
  $('body').append(
    $('<style type="text/css"/>').html(getMarineStyle(marineData)));
    
  (function initmap() {
    // set up the map
    var map = new L.Map('map');
  
    // create the tile layer with correct attribution
    var osmUrl='http://otile1.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png';
    var osmAttrib='Tiles Courtesy of <a href="http://www.mapquest.com/" target="_blank">MapQuest</a> <img src="http://developer.mapquest.com/content/osm/mq_logo.png">';
    var osm = new L.TileLayer(osmUrl, {minZoom: 2, maxZoom: 12, attribution: osmAttrib});		
  
    map.setView(new L.LatLng(-18.00, 150.00), 6);
    map.addLayer(osm);
    $.get("./regions.geojson", function(data) {
      var regionsGeo = L.geoJson(data, {
        style: function (feature) {
          return { color: regionFill[feature.properties.Region] };
        }
      });
      function getRegionName(region) {
        return region.feature.properties
            .Region.toLowerCase().replace(' ', '-');
      }
      var zoomed = regionsGeo;
      regionsGeo.getLayers().forEach(function(region) {
        region.on('click', function() {
          var regionName = getRegionName(region);
          if (zoomed == region) {
            app.setLocation('#/');
          } else {
            app.setLocation('#/region/'+regionName);
          }
        });
      });
      Sammy('#main', function() {
        this.bind('region:show', function(evt, region) {
          if (region == 'gbr') {
            zoomed = regionsGeo;
          } else {
            regionsGeo.getLayers().forEach(function(r) {
              if (region == getRegionName(r)) {
                zoomed = r;
              }
            });
          }
          map.fitBounds(zoomed.getBounds());
        })
      }); 
      regionsGeo.addTo(map);
      map.fitBounds(regionsGeo.getBounds());
      $(window).resize(function() {
        map.fitBounds(zoomed.getBounds());  
      });

      function clearRegionFills() {
        Object.keys(marineData).forEach(function(region) {
          regionsGeo.getLayers().forEach(function(r) {
            if (region == getRegionName(r)) {
              r.setStyle({
                color: regionFill[r.feature.properties.Region]
              });
            }
          });
        });
      }
      
      function setRegionFills(indicator) {
        var data;
        if (marineData.gbr[indicator]) {
          data = marineData;
        } else if (progressData.gbr[indicator]) {
          data = progressData;
        } else {
          clearRegionFills();
          return;
        }
        Object.keys(data).forEach(function(region) {
          regionsGeo.getLayers().forEach(function(r) {
            if (region == getRegionName(r)) {
              var value = data[region][indicator];
              if (value == 'NA') {
                r.setStyle({ color: '#dddddd'});
              } else {
                r.setStyle({ color: getFill(value).active });
              }
            }
          });
        });
      }
  
      Sammy('#main', function() {
        this.bind('indicator:show', function(evt, id) {
          setRegionFills(id);
        });
        this.bind('region:show', function(evt, id) {
          if (id == 'gbr') {
            clearRegionFills();
          }
        });
      });
      
      Object.keys(progressData).forEach(function(regionName) {
        var region = progressData[regionName];
        Object.keys(region).forEach(function(indicator) {
          Sammy('#main', function() {
            var condition = region[indicator];
            var name = indicator.substring(0,1).toUpperCase() + indicator.substring(1);
            var $button = $('<button/>').addClass('condition').text(name);
            $button.addClass(condition.toLowerCase().replace(' ', '-'));
            $button.attr('data-indicator', indicator);
            $('.progress-list.'+regionName).append($button);
          });
        });
      });
      
      loadSvg('#marine-chart', 'marine.svg', 'Mid').done(function(marine) {
        $('.marine-chart').html($('#marine-chart').html());
        $('#marine-chart').remove();
        // Run app now that regions & marine are loaded
        app.run('#/');
      });
    }, 'json');
  })();
});