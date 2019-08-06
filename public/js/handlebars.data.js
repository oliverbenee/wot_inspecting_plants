(function () {
  var template = Handlebars.template; var templates = Handlebars.templates = Handlebars.templates || {}
  templates['data'] = template({ '1': function (container, depth0, helpers, partials, data) {
    var helper; var alias1 = depth0 != null ? depth0 : (container.nullContext || {}); var alias2 = helpers.helperMissing; var alias3 = 'function'; var alias4 = container.escapeExpression

    return '   <tr>\r\n <td>' +
    alias4(((helper = (helper = helpers.temperature || (depth0 != null ? depth0.temperature : depth0)) != null ? helper : alias2), (typeof helper === alias3 ? helper.call(alias1, { 'name': 'temperature', 'hash': {}, 'data': data }) : helper))) +
    '</td>\r\n <td>' +
    alias4(((helper = (helper = helpers.humidity || (depth0 != null ? depth0.humidity : depth0)) != null ? helper : alias2), (typeof helper === alias3 ? helper.call(alias1, { 'name': 'humidity', 'hash': {}, 'data': data }) : helper))) +
    '</td>\r\n <td>' +
    alias4(((helper = (helper = helpers.time || (depth0 != null ? depth0.time : depth0)) != null ? helper : alias2), (typeof helper === alias3 ? helper.call(alias1, { 'name': 'time', 'hash': {}, 'data': data }) : helper))) +
    '</td>\r\n </tr>\r\n'
  },
  'compiler': [7, '>= 4.0.0'],
  'main': function (container, depth0, helpers, partials, data) {
    var stack1

    return ((stack1 = helpers.each.call(depth0 != null ? depth0 : (container.nullContext || {}), (depth0 != null ? depth0.tempandhums : depth0), { 'name': 'each', 'hash': {}, 'fn': container.program(1, data, 0), 'inverse': container.noop, 'data': data })) != null ? stack1 : '')
  },
  'useData': true })
})()
