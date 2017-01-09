var cookie = require('cookie');

module.exports = function () {
	return function (req, res, next) {
		res.setCookie = function (name, val, options) {
			options = options || {};
			if ('object' === typeof val) {
				val = JSON.stringify(val);
			}
			if (!(options.expires instanceof Date)) {
				options.expires = parseInt(options.expires, 10);
				if (isNaN(options.expires)) {
					delete(options.expires);
				}
				else {
					options.expires = new Date(Date.now() + options.expires);
				}
			}
			if (!options.path) {
				options.path = '/';
			}
			res.setHeader('Set-Cookie', cookie.serialize(name, val, options));
		};

		res.clearCookie = function (name, options) {
			options = options || {};
			options.expires = new Date(1);
			if (!options.path) {
				options.path = '/';
			}
			res.setCookie(name, '', options);
		};

		res.text = function (text, status, contentType, charset) {
			contentType = contentType || 'text/plain';
			charset = charset || 'utf-8';
			res.statusCode = status || 200;
			res.setHeader('Content-Type', contentType + '; charset=' + charset);
			res.end(text);
		};

		res.html = function (html, charset) {
			res.text(html, 200, 'text/html', charset || 'utf-8');
		};

		res.xml = function (xml, charset) {
			res.text(xml, 200, 'text/xml', charset || 'utf-8');
		};

		res.json = function (json, charset) {
			res.text(JSON.stringify(json), 200, 'application/json', charset || 'utf-8');
		};

		res.redirect = function (url, status) {
			res.statusCode = status || 302;
			res.setHeader('Location', url);
			res.end();
		};

		res.back = function (status) {
			var url = req.headers.referer || req.headers.referrer || '/';
			res.redirect(url, status);
		};

		next();
	};
};