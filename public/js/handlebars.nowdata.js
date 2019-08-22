(function () {
    var template = Handlebars.template; var templates = Handlebars.templates = Handlebars.templates || {}
    templates['nowdata'] = template({ '1': function (container, depth0, helpers, partials, nowdata) {
      var helper; var alias1 = depth0 != null ? depth0 : (container.nullContext || {}); var alias2 = helpers.helperMissing; var alias3 = 'function'; var alias4 = container.escapeExpression
  
      return '   <tr>\r\n <td>' +
      alias4(((helper = (helper = helpers.temperature || (depth0 != null ? depth0.temperature : depth0)) != null ? helper : alias2), (typeof helper === alias3 ? helper.call(alias1, { 'name': 'temperature', 'hash': {}, 'nowdata': nowdata }) : helper))) +
      '</td>\r\n <td>' +
      alias4(((helper = (helper = helpers.humidity || (depth0 != null ? depth0.humidity : depth0)) != null ? helper : alias2), (typeof helper === alias3 ? helper.call(alias1, { 'name': 'humidity', 'hash': {}, 'nowdata': nowdata }) : helper))) +
      '</td>\r\n <td>' +
      alias4(((helper = (helper = helpers.time || (depth0 != null ? depth0.time : depth0)) != null ? helper : alias2), (typeof helper === alias3 ? helper.call(alias1, { 'name': 'time', 'hash': {}, 'nowdata': nowdata }) : helper))) +
      '</td>\r\n </tr>\r\n';
    },
    'compiler': [7, '>= 4.0.0'],
    'main': function (container, depth0, helpers, partials, nowdata) {
      var stack1
  
      return ((stack1 = helpers.each.call(depth0 != null ? depth0 : (container.nullContext || {}), (depth0 != null ? depth0.dhtdata : depth0), { 'name': 'each', 'hash': {}, 'fn': container.program(1, nowdata, 0), 'inverse': container.noop, 'nowdata': nowdata })) != null ? stack1 : '')
    },
    'useData': true })
  })()