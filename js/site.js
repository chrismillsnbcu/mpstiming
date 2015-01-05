/***** MPS Demo - Waterfall details *****/
// Populate results.
function populateResults(d) {
  var data = d;
  // Calculate load times for ads.

  // Populate results.
  var results = '<ul>';
  results += '<li>MPS was loaded to the DOM after being blocked for <strong>' + data.mpsBlocked + ' milliseconds</strong> and waiting for <strong>' + d.mpsWait + ' milliseconds</strong>, with a load time of <strong>' + data.mps + ' milliseconds</strong>.</li>';
  results += '<li>GPT was loaded to the DOM after being blocked for <strong>' + data.libBlocked + ' milliseconds</strong> and waiting for <strong>' + d.libWait + ' milliseconds</strong>, with a load time of <strong>' + data.lib + ' milliseconds</strong> .</li>';
  results += '<li>Doubleclick Ad code was loaded to the DOM after being blocked for <strong>' + data.adBlocked + ' milliseconds</strong> and waiting for <strong>' + d.adWait + ' milliseconds</strong>, with a load time of <strong>' + data.adLoad + ' milliseconds</strong> .</li>';
  results += '</ul>';
  $('.panel-results').html(results);

  // Enable Sorting.
  $("#chart-all").tablesorter();
  $("#chart-js").tablesorter();

  // Show Table.
  $('#content').removeClass('none');
}
// Build JS graph.
function buildGraphJS(d) {

  var colors = Highcharts.getOptions().colors,
  categories = ['Javascript'],
  data = [{
      y: 100,
      color: colors[0],
      drilldown: {
          name: 'Javascript',
          categories: ['All Javasript'],
          data: [50, 50]
      }
  }],
  urls = [],
  i,
  brightness;

  for(var i=0; i< d.urls.length; i++) {
    var time = (d.urls[i].time / d.js) * 100;
    time = time.toFixed(2) / 1;
    urls.push({
        name: d.urls[i].url,
        y: time
    });
  }

$('#graph-js').highcharts({
        chart: {
            plotBackgroundColor: null,
            plotShadow: false
        },
        title: {
            text: 'Javascript Load Times'
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        marginLeft: 30,
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    formatter: function () {
                      if(this.y > 1 || this.point.name.indexOf('mps') > -1) {
                        return '<b>' + this.point.name + ':</b><br />' + this.y + '%';
                      }
                    },
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    }
                }
            }
        },
        series: [{
          type: 'pie',
          name: 'Size',
          data: urls,
          size: '80%',
          innerSize: '60%',
          dataLabels: {
            formatter: function () {
              return '<b>' + this.point.name + ':</b><br />' + this.y + '%';
            }
          }
        }]
    });

  populateResults(d);

}
// Build graph.
function buildGraph(d) {

  var data = d;
  var miscTot = data.flash + data.font + data.html + data.misc + data.text;

  // Total perentages per category.
  var percJs = (data.jsObj.js / data.total) * 100;
  var percCss = (data.css / data.total) * 100;
  var percImages = (data.image / data.total) * 100;
  var percMisc = (miscTot / data.total) * 100;

  // JS and MPS percentages.
  var percAllJs = data.jsObj.js - data.jsObj.mps;
  percAllJs = (percAllJs / data.jsObj.js) * percJs;
  var percMps = (data.jsObj.mps / data.jsObj.js) * percJs;

  // Misc percentages.
  var percFlash = (data.flash / miscTot) * percMisc;
  var percFont = (data.font / miscTot) * percMisc;
  var percHtml = (data.html / miscTot) * percMisc;
  var percText = (data.text / miscTot) * percMisc;
  var percMiscOther = (data.misc / miscTot) * percMisc;

  percJs = percJs.toFixed(2) / 1;
  percCss = percCss.toFixed(2) / 1;
  percImages = percImages.toFixed(2) / 1;
  percMisc = percMisc.toFixed(2) / 1;
  percAllJs = percAllJs.toFixed(2) / 1;
  percMps = percMps.toFixed(2) / 1;
  percFlash = percFlash.toFixed(2) / 1;
  percFont = percFont.toFixed(2) / 1;
  percHtml = percHtml.toFixed(2) / 1;
  percText = percText.toFixed(2) / 1;
  percMiscOther = percMiscOther.toFixed(2) / 1;

  var colors = Highcharts.getOptions().colors,
  categories = ['Javascript', 'CSS', 'Images', 'Misc.'],
  data = [{
      y: percJs,
      color: colors[0],
      drilldown: {
          name: 'Javascript',
          categories: ['All Javasript', 'MPS Javascript'],
          data: [percAllJs, percMps],
          color: colors[0]
      }
  }, {
      y: percCss,
      color: colors[1],
      drilldown: {
          name: 'CSS',
          categories: ['CSS'],
          data: [percCss],
          color: colors[1]
      }
  }, {
      y: percImages,
      color: colors[2],
      drilldown: {
          name: 'Images',
          categories: ['Images'],
          data: [percImages],
          color: colors[2]
      }
  }, {
      y: percMisc,
      color: colors[4],
      drilldown: {
          name: 'Misc',
          categories: ['Text', 'Font', 'HTML', 'Flash', 'Other'],
          data: [ percFlash, percFont, percHtml, percText, percMiscOther],
          color: colors[3]
      }
  }],
  browserData = [],
  versionsData = [],
  i,
  j,
  dataLen = data.length,
  drillDataLen,
  brightness;


  // Build the data arrays
  for (i = 0; i < dataLen; i += 1) {

    // add browser data
    browserData.push({
        name: categories[i],
        y: data[i].y,
        color: data[i].color
    });

    // add version data
    drillDataLen = data[i].drilldown.data.length;
    for (j = 0; j < drillDataLen; j += 1) {
        brightness = 0.2 - (j / drillDataLen) / 5;
        versionsData.push({
            name: data[i].drilldown.categories[j],
            y: data[i].drilldown.data[j],
            color: Highcharts.Color(data[i].color).brighten(brightness).get()
        });
    }
  }

  $('#graph').removeClass('loading');

  // Graph.
  $('#graph-all').highcharts({
    chart: {
        type: 'pie'
    },
    title: {
        text: mpsDemo.site + ' Site Waterfall Load Times'
    },
    plotOptions: {
        pie: {
            shadow: false,
            center: ['50%', '50%']
        }
    },
    tooltip: {
        valueSuffix: '%'
    },
    series: [{
        name: 'Size',
        data: browserData,
        size: '60%',
        dataLabels: {
            formatter: function () {
                //return this.y > 5 ? this.point.name : null;
                return '<b>' + this.point.name + ':</b><br />' + this.y + '%';
            },
            color: 'white',
            distance: -30
        }
    }, {
        name: 'Size: ',
        data: versionsData,
        size: '80%',
        innerSize: '60%',
        dataLabels: {
            formatter: function () {
                // display only if larger than 1
                //return this.y > .5 ? this.y + '%'  : null;
                return '<b>' + this.point.name + ':</b><br />' + this.y + '%';
            }
        }
    }]
  });
  // Settimeout for smooth animation
  setTimeout(function() {
    buildGraphJS(d.jsObj);
  },250);
}

// Manually format urls.
function formatUrl(d) {
  var _url = d;
  if(_url.indexOf('.com') > -1) {
    _url = _url.split('.com');
    _url = _url[0] + '.com';
  } else if(_url.indexOf('.net') > -1) {
   _url = _url.split('.net');
   _url = _url[0] + '.net';
  }
  _url = _url.replace('http://', '');
  _url = _url.replace('https://', '');
  return _url;
}
// Append to chart all.
function appendChartAll(_this, _thisUrl, _thisMimeType, _thisWait, _thisBlocked, _thisMPS) {
  var tbody = $('#chart-all tbody');
  var mpsClass = '';
  if(_thisMPS) {
    mpsClass = ' alert';
  }
  $(tbody).append('<tr"><td width="705" class="loadUrl' + mpsClass + '"><span class="hoverUrl none">' + _thisUrl + '</span>' + _thisUrl + '</td><td width="250" class="' + mpsClass + '">' + _thisMimeType + '</td><td width="50" class="' + mpsClass + '">' + _thisBlocked + '</td><td width="50" class="' + mpsClass + '">' + _thisWait + '</td><td width="100" align="right" class="loadTime' + mpsClass + '"><span>' + _this.download_ms + '</span></td></tr>');
}
// Append to chart js.
function appendChartJS(_this, _thisUrl, _thisMimeType, _thisWait, _thisBlocked, _thisMPS) {
  var tbody = $('#chart-js tbody');
  var mpsClass = '';
  if(_thisMPS) {
    mpsClass = ' alert';
  }
  $(tbody).append('<tr"><td width="705" class="loadUrl' + mpsClass + '"><span class="hoverUrl none">' + _thisUrl + '</span>' + _thisUrl + '</td><td width="250" class="' + mpsClass + '">' + _thisMimeType + '</td><td width="50" class="' + mpsClass + '">' + _thisBlocked + '</td><td width="50" class="' + mpsClass + '">' + _thisWait + '</td><td width="100" align="right" class="loadTime' + mpsClass + '"><span>' + _this.download_ms + '</span></td></tr>');
}

// Parse speed test results.
function parseData(data) {
  var jsUrl = [];
  var jsUrls = [];
  // Total vars.
  var totalJSLoad = 0;
  var totalCSSLoad = 0;
  var totalXMLLoad = 0;
  var totalImageLoad = 0;
  var totalFontLoad = 0;
  var totalHtmlLoad = 0;
  var totalFlashLoad = 0;
  var totalTextLoad = 0;
  var totalMiscLoad = 0;
  var totalVal = 0;
  // MPS Specific Totals.
  var totalMPSLoad = 0;
  var totalMPSWait = 0;
  var totalMPSBlocked = 0;
  // Ad Network Library Totals.
  var totalAdLibLoad = 0;
  var totalAdLibWait = 0;
  var totalAdLibBlocked = 0;
  // Ad Network Specific Totals.
  var totalAdLoad = 0;
  var totalAdWait = 0;
  var totalAdBlocked = 0;
  // MPS Demo vars.
  var adLibrary = mpsDemo.adLibrary + '.js';
  adLibrary = adLibrary.toLowerCase();
  var adNetwork = mpsDemo.adNetwork;
  adNetwork = adNetwork.toLowerCase();
console.log(data);
  var d = data.runs[1].firstView.requests;
  console.log(d);
  for(var i=0; i<d.length; i++) {
    var _this = d[i];
    console.log(_this);
    var _thisUrl = _this.full_url;
    var _thisMimeType = _this.contentType;
    if(_thisMimeType) {
      var _thisWait = parseInt(_this.connect_ms);
      console.log(_thisWait);
      var _thisBlocked = parseInt(_this.connect_start);
      // Append to all chart.
      appendChartAll(_this, _thisUrl, _thisMimeType, _thisWait, _thisBlocked, _thisMPS);
      // Increment total values based on file type, used for graph.
      totalVal = totalVal + _this.download_ms;
      // Append to js table, increment totals.
      if(_thisMimeType.indexOf('javascript') > -1) {
        totalJSLoad = totalJSLoad + _this.download_ms;
        var jsUrl = {
          url: formatUrl(_thisUrl),
          name: _this.full_url,
          time: _this.download_ms,
          wait: _thisWait,
          blocked: _thisBlocked,
          type: _thisMimeType
        };
        console.log(typeof _this.download_ms, typeof _thisWait, typeof _thisBlocked);
        jsUrls.push(jsUrl);
        // Increment ad totals.
        var _thisMPS = _thisUrl.indexOf('mps.') > -1;
        var _thisAdLibrary = _thisUrl.indexOf(adLibrary) > -1;
        var _thisAdNetwork = _thisUrl.indexOf(adNetwork) > -1;
        if(_thisMPS) {
          totalMPSLoad = parseInt(totalMPSLoad + _this.download_ms);
          totalMPSWait = parseInt(totalMPSWait + _this.connect_ms);
          totalMPSBlocked = totalMPSBlocked + parseInt(_this.connect_start);
        }
        if(_thisAdLibrary) {
          totalAdLibLoad = parseInt(totalAdLibLoad + _this.download_ms);
          totalAdLibWait = parseInt(totalAdLibWait + _this.connect_ms);
          totalAdLibBlocked = totalAdLibBlocked + parseInt(_this.connect_start);
        }
        if(_thisAdNetwork) {
          totalAdLoad = parseInt(totalAdLoad + _this.download_ms);
          totalAdWait = parseInt(totalAdWait + _this.connect_ms);
          totalAdBlocked = totalAdBlocked + parseInt(_this.connect_start);
        }
        appendChartJS(_this, _thisUrl, _thisMimeType, _thisWait, _thisBlocked, _thisMPS);
      } else if(_thisMimeType.indexOf('css') > -1) {
        totalCSSLoad = totalCSSLoad + _this.download_ms;
      } else if(_thisMimeType.indexOf('xml') > -1) {
        totalXMLLoad = totalXMLLoad + _this.download_ms;
      } else if(_thisMimeType.indexOf('plain') > -1) {
        totalTextLoad = totalTextLoad + _this.download_ms;
      } else if(_thisMimeType.indexOf('html') > -1) {
        totalHtmlLoad = totalHtmlLoad + _this.download_ms;
      } else if(_thisMimeType.indexOf('flash') > -1) {
        totalFlashLoad = totalFlashLoad + _this.download_ms;
      } else if(_thisMimeType.indexOf('font') > -1) {
        totalFontLoad = totalFontLoad + _this.download_ms;
      } else if(_thisMimeType.indexOf('image') > -1) {
        totalImageLoad = totalImageLoad + _this.download_ms;
      } else {
        totalMiscLoad = totalMiscLoad + _this.download_ms;
      }
    }
  }
  // Build graph.
  var graph = {
    css: totalCSSLoad,
    image: totalImageLoad,
    font: totalFontLoad,
    html: totalHtmlLoad,
    image: totalImageLoad,
    flash: totalFlashLoad,
    text: totalTextLoad,
    misc: totalMiscLoad,
    total: totalVal,
    jsObj: {
      js: totalJSLoad,
      mps: totalMPSLoad,
      mpsWait: totalMPSWait,
      mpsBlocked: totalMPSBlocked,
      adLoad: totalAdLoad,
      adWait: totalAdWait,
      adBlocked: totalAdBlocked,
      lib: totalAdLibLoad,
      libWait: totalAdLibWait,
      libBlocked: totalAdLibBlocked,
      urls: jsUrls
    }
  };
  buildGraph(graph);
}

// GET page speed test results.
function pageSpeedResults(_url) {
  $.ajax({
    type: 'GET',
    url: _url,
    dataType: 'jsonp',
    callback: 'pageTestCallback',
    success: function(d) {
      //$('#graph p').remove();
      parseData(d.data);
    },
    error: function(d) {
      console.log(d, 'Error!');
      $('#graph p').html('A server error occurred, please try again later.');
      $('#graph').removeClass('loading');
    }
  });
}

// Check page speed test status.
function pageSpeedStatus(_url, _testId) {
  console.log('ping status');
  $.ajax({
    type: 'GET',
    url: 'http://www.webpagetest.org/testStatus.php?f=json&test=' + _testId,
    dataType: 'jsonp',
    callback: 'pageTestCallback',
    success: function(d) {
      if(d.statusCode === 200) {
        $('#graph p').html('Page speed test complete, getting results.');
        pageSpeedResults(_url);
      } else if(d.statusCode === 100 || d.statusCode === 101) {
        setTimeout(function() {
          $('#graph p').html('Running site speed test, this may take up to 30 seconds.<br />' + d.statusText);
          pageSpeedStatus(_url, _testId)
        }, 1000);
      } else {
        console.log(d);
        console.log('Error!');
        $('#graph p').html('An error occurred, please try again later.');
        $('#graph').removeClass('loading');
      }
    },
    error: function(d) {
      console.log(d, 'Error!');
      $('#graph p').html('A server error occurred, please try again later.');
      $('#graph').removeClass('loading');
    }
  });
}

$(document).ready(function() {

  // Chart toggling.
  $('.button.tabs-js').on('click', function(e) {
    $('#chart-all').addClass('none');
    $('.tabs-all').addClass('secondary');
    $('.tabs-js').removeClass('secondary');
    $('#chart-js').removeClass('none');
    e.preventDefault();
  });
  $('.button.tabs-all').on('click', function(e) {
    $('#chart-all').removeClass('none');
    $('.tabs-all').removeClass('secondary');
    $('.tabs-js').addClass('secondary');
    $('#chart-js').addClass('none');
    e.preventDefault();
  });

  // Init.
  //$('body').append('<script id="siteHar" src="' + mpsDemo.harUrl +'"></script>');
});
/*
$(document).ready(function() {
  $('#chart .loadUrl').on('hover', function() {
    $(this + ' .hoverUrl').show();
  }).function() {
    $(this + ' .hoverUrl').show();
  });
});*/

/***** Google Page Speed API
var API_KEY = 'AIzaSyB3UqVfUuWfpv_ij5ukSpirv8SaVsvZeqs';
var URL_TO_GET_RESULTS_FOR = 'http://www.nbcnews.com';

var API_URL = 'https://www.googleapis.com/pagespeedonline/v1/runPagespeed?';
var CHART_API_URL = 'http://chart.apis.google.com/chart?';

var callbacks = {}

function runPagespeed() {
  var s = document.createElement('script');
  s.type = 'text/javascript';
  s.async = true;
  var query = [
    'url=' + URL_TO_GET_RESULTS_FOR,
    'callback=runPagespeedCallbacks',
    'key=' + API_KEY,
  ].join('&');
  s.src = API_URL + query;
  document.head.insertBefore(s, null);
}

function runPagespeedCallbacks(result) {
	console.log('result',result,'/result');
  if (result.error) {
    var errors = result.error.errors;
    for (var i = 0, len = errors.length; i < len; ++i) {
      if (errors[i].reason == 'badRequest' && API_KEY == 'yourAPIKey') {
        alert('Please specify your Google API key in the API_KEY variable.');
      } else {
        alert(errors[i].message);
      }
    }
    return;
  }

  for (var fn in callbacks) {
    var f = callbacks[fn];
    if (typeof f == 'function') {
      callbacks[fn](result);
    }
  }

}

setTimeout(runPagespeed, 0);*****/