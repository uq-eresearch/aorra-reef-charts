var indicatorImage = (function() {
  function img(imgName) {
    return $('<img />').attr('src', 'images/'+imgName+'.png')[0].outerHTML;
  }
  return {
    'grazing': img('grazing'),
    'sugarcane': img('cane'),
    'horticulture': img('banana'),
    'groundcover': img('groundcover'),
    'nitrogen': img('beaker'),
    'sediment': img('beaker'),
    'pesticides': img('beaker')
  };
})();

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
  
  this.get('#/management', function() {
    this.$element()
        .html($('#tmpl-management-select').html());
    this.trigger('region:show', 'gbr');
    this.trigger('management:show');
  });
  
  this.get('#/management/:indicator', function() {
    this.$element()
        .html($('#tmpl-'+this.params['indicator']+'-info').html());
    this.trigger('region:show', 'gbr');
    this.trigger('indicator:show', this.params['indicator']);
  });
  
  this.get('#/catchment', function() {
    this.$element()
        .html($('#tmpl-catchment-select').html());
    this.trigger('region:show', 'gbr');
    this.trigger('catchment:show');
  });
  
  this.get('#/catchment/:indicator', function() {
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
    this.trigger('catchment:show');
    this.trigger('management:show');
  });
  
  this.bind('marine:show', function() {
    this.$element().find('.marine-chart #indicators path').click(function(evt) {
      var indicator = evt.delegateTarget.id;
      this.redirect('#', 'marine', indicator);
    }.bind(this));
  });
  
  ['catchment', 'management'].forEach(function(arg) {
    this.bind(arg + ':show', function() {
      this.$element().find('button[data-indicator]').click(function(evt) {
        var $button = $(evt.delegateTarget);
        this.redirect('#', arg, $button.attr('data-indicator'));
      }.bind(this));
    });
  }.bind(this));
  
});

var getFill = (function IIFE() {
  var fills;
  function getFillsFromCSS() {
    function getFillFromCSS(conditionClasses) {
      var $testEl = $('<div/>').addClass('condition '+conditionClasses);
      $testEl.appendTo('body');
      var bgc = $testEl.css('background-color');
      $testEl.remove();
      return bgc;
    };
    return {
      'Very Good': {
        'normal': getFillFromCSS('very-good'),
        'active': getFillFromCSS('very-good active')
      },
      'Good': {
        'normal': getFillFromCSS('good'),
        'active': getFillFromCSS('good active'),
      },
      'Moderate': {
        'normal': getFillFromCSS('moderate'),
        'active': getFillFromCSS('moderate active'),
      },
      'Poor': {
        'normal': getFillFromCSS('poor'),
        'active': getFillFromCSS('poor active'),
      },
      'Very Poor': {
        'normal': getFillFromCSS('very-poor'),
        'active': getFillFromCSS('very-poor active')
      }
    };
  }
  return function getFillImpl(v) {
    if (!fills) {
      fills = getFillsFromCSS();
    }
    if (fills[v]) {
      return fills[v];
    } else {
      return { normal: '#e5e5e5', active: '#e5e5e5' };
    }
  }
})();

function getMarineStyle(data) {
  return Object.keys(data).reduce(function(lr, region) {
    var values = data[region];
    return lr.concat(Object.keys(values).reduce(function(li, indicator) {
      var value = values[indicator].qualitative;
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
  
    map.setView(new L.LatLng(-18.83, 147.68), 6);
    map.addLayer(osm);
    // Detect low-res device and use simpler regions
    var regionsUrl = 768 < window.screen.width ?
      "./regions.geojson" :
      "./regions-simplified.geojson";
    $.get(regionsUrl, function(data) {
      var regionsGeo = L.geoJson(data, {
        style: function (feature) {
          return {
            weight: 1 
          };
        }
      });
      // Fast hash-based lookups
      var regionLookup = (function regionLookupInit() {
        function getRegionId(region) {
          return region.feature.properties.OBJECTID;
        }
        var regionById = regionsGeo.getLayers().reduce(function(h, region) {
          h[getRegionId(region)] = region;
          return h;
        }, {});
        var regionNameToId = {};
        var regionIdToName = {};
        regionsGeo.getLayers().forEach(function(region) {
          var displayName = region.feature.properties.Region;
          var regionName = displayName.toLowerCase().replace(' ', '-');
          regionNameToId[regionName] = getRegionId(region);
          regionIdToName[getRegionId(region)] = regionName;
        });
        return {
          nameToRegion: function nameToRegion(regionName) {
            return regionById[regionNameToId[regionName]];
          },
          regionToName: function regionToName(region) {
            return regionIdToName[getRegionId(region)];
          }
        }
      })();
      var zoomed = regionsGeo;
      regionsGeo.getLayers().forEach(function(region) {
        var regionName = regionLookup.regionToName(region);
        region.setStyle({
          className: regionName
        });
        region.onClickHandler = function() {
          if (zoomed == region) {
            app.setLocation('#/');
          } else {
            app.setLocation('#/region/'+regionName);
          }
        };
        region.on('click', region.onClickHandler);
      });
      Sammy('#main', function() {
        this.bind('region:show', function(evt, regionName) {
          if (regionName == 'gbr') {
            zoomed = regionsGeo;
          } else {
            zoomed = regionLookup.nameToRegion(regionName);
          }
          map.fitBounds(zoomed.getBounds());
        })
      }); 
      regionsGeo.addTo(map);
      regionsGeo.getLayers().forEach(function(region) {
        var displayName = region.feature.properties.Region;
        var labelDir = displayName == 'Burdekin' ? 'left' : 'right';
        var label = new L.Label({
          clickable: true,
          direction: labelDir,
          noHide: true
        });
        region.setQuantitativeValue = function setContent(newContent) {
          label.setContent( newContent ?
            displayName + "<br />" + newContent : displayName );
        };
        region.setQuantitativeValue(null);
        label.setLatLng(region.getBounds().getCenter());
        label.on('click', region.onClickHandler);
        map.showLabel(label);
      });
      map.fitBounds(regionsGeo.getBounds());
      $(window).resize(function() {
        map.fitBounds(zoomed.getBounds());
      });

      function clearRegionFills() {
        $('.leaflet-label')
          .removeAttr('title')
          .removeClass('condition na very-good good moderate poor very-poor');
        Object.keys(marineData).forEach(function(regionName) {
          var region = regionLookup.nameToRegion(regionName);
          if (region != null) {
            region.setQuantitativeValue(null);
          }
        });
      }
      
      function setRegionFills(indicator) {
        var data;
        if (marineData.gbr[indicator]) {
          data = marineData;
        } else if (managementData.gbr[indicator]) {
          data = managementData;
        } else if (catchmentData.gbr[indicator]) {
          data = catchmentData;
        } else {
          clearRegionFills();
          return;
        }
        Object.keys(data).forEach(function(regionName) {
          var region = regionLookup.nameToRegion(regionName);
          if (region != null) {
            var displayName = region.feature.properties.Region;
            var condition = data[regionName][indicator].qualitative;
            var value = data[regionName][indicator].quantitative;
            if (condition == null) {
              $('.leaflet-label:contains("'+displayName+'")')
                .addClass('condition na');
              region.setQuantitativeValue(null);
            } else {
              var conditionClass = condition.toLowerCase().replace(' ','-');
              $('.leaflet-label:contains("'+displayName+'")')
                .attr('title', condition)
                .addClass('condition '+conditionClass);
              region.setQuantitativeValue(value);
            }
          }
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
      
      var progressData = {
        'catchment' : catchmentData,
        'management': managementData
      };
      Object.keys(progressData).forEach(function(dataType) {
        var data = progressData[dataType];
        Object.keys(data).forEach(function(regionName) {
          var region = data[regionName];
          Object.keys(region).forEach(function(indicator) {
            Sammy('#main', function() {
              var condition = region[indicator].qualitative || 'NA';
              var value = region[indicator].quantitative || '';
              var target = region[indicator].target || '';
              var name = indicator.substring(0,1).toUpperCase() + indicator.substring(1);
              var $button = $('<button/>')
                .addClass('progress-indicator')
                .addClass('condition')
                .addClass(condition.toLowerCase().replace(' ', '-'))
                .attr('title', condition)
                .attr('data-indicator', indicator)
                .append($('<div/>').addClass('name').text(name))
                .append(indicatorImage[indicator])
                .append($('<div/>').text(value))
                .append($('<div/>').addClass('target').html("Target &rarr; "+target));
              $('.'+dataType+'-data.'+regionName).append($button);
            });
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

    var imageBounds = [[-24.444389342999955,153.2289409640001], [-9.999868392999815,142.6685123440003]];
    L.imageOverlay('reef.svg', imageBounds, {opacity: 1}).addTo(map);
  })();
});