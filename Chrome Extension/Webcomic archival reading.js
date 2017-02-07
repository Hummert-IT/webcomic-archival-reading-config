class ComicWebsite {
	constructor(config) {
		this['nav'] = {}
		try { this['nav']['prev'] = config['nav']['prev'] } catch(e) {}
		try { this['nav']['next'] = config['nav']['next'] } catch(e) {}

		this['alt'] = {}
		try { this['alt']['comic'] = config['alt']['comic'] } catch(e) {}
		try { this['alt']['after'] = config['alt']['after'] } catch(e) {}
		try { this['alt']['ignore'] = config['alt']['ignore'] } catch(e) {}
		try { this['alt']['style'] = config['alt']['style'] } catch(e) {}

		this['exp'] = {}
		try { this['exp']['source'] = config['exp']['source'] } catch(e) {}
		try { this['exp']['destin'] = config['exp']['destin'] } catch(e) {}
		try { this['exp']['style'] = config['exp']['style'] } catch(e) {}
		try { this['exp']['prefix'] = config['exp']['prefix'] } catch(e) {}
		try { this['exp']['suffix'] = config['exp']['suffix'] } catch(e) {}
	}

	navigate() {
		var prev = document.querySelector(this['nav']['prev'])
		var next = document.querySelector(this['nav']['next'])

		// Following snippet adapted from Karl Ding, http://github.com/karlding
		window.addEventListener('keydown', function(e) {
			switch (e.keyCode) {
		    case 74: case 37: // left, j
		    	if (prev !== null) {
		    		prev.click()
		    	}
			    break;
		    case 76: case 39: // right, l
		    	if (next !== null) {
		    		next.click()
		    	}
			    break;
		  }
		})
	}

	copy(site_css) {
		var comics = document.querySelectorAll(this['alt']['comic'])
		if (comics !== []) {
			for (var i = comics.length - 1; i >= 0; i--) {
				var comic = comics[i]
				var alt_data = comic.getAttribute('title')

				if (this['alt']['ignore']) {
					for (var ii = this['alt']['ignore'].length - 1; ii >= 0; ii--) {
						var pattern = new RegExp(this['alt']['ignore'][ii], 'g')
						if (alt_data.search(pattern) !== -1) {
							alt_data = undefined
							break
						}
					}
				}

				if (alt_data || this['alt']['after']) {
					var wrapper = document.createElement('div')
					comic.parentNode.insertBefore(wrapper, comic.nextSibling)
					wrapper.setAttribute('style', 'display:none;')


					if (alt_data) {
						var alt_text = document.createElement('p')
						var alt_text_node = document.createTextNode(alt_data)
						alt_text.appendChild(alt_text_node)
						wrapper.appendChild(alt_text)

						if (this['alt']['style']) {
							// alt_text.setAttribute('style', 'text-align:center;' + this['alt']['style'])
							site_css.build('.webcomic-reading-wrapper > p', this['alt']['style'])
						}
					}
					if (this['alt']['after']) {
						wrapper.insertAdjacentHTML('beforeend', this['alt']['after'].outerHTML)
						//comic.parentNode.insertBefore(wrapper, comic.nextSibling)
					}
					
					wrapper.classList.add('webcomic-reading-wrapper')
					site_css.build('.webcomic-reading-wrapper', 'width:' + comic.width + 'px; margin: 0 auto')
					wrapper.removeAttribute('style')
				}
			}
		}
	}

	expand(site_css) {
		if (this['exp']['source'] && this['exp']['destin']) {
			var sources = document.querySelectorAll(this['exp']['source'])
			var destins = document.querySelectorAll(this['exp']['destin'])

			if (sources.length === destins.length) {
				for (var i = sources.length - 1; i >= 0; i--) {
					var source = sources[i]
					var destin = destins[i]

					destin.innerHTML = [this['exp']['prefix'], source.innerHTML, this['exp']['suffix']].join('')
					source.parentNode.removeChild(source)
					if (this['exp']['style']) {
						// destin.setAttribute('style', this['exp']['style'])
						destin.classList.add('webcomic-reading-expansion')
					}
				}

				if (this['exp']['style']) {
					// destin.setAttribute('style', this['exp']['style'])
					site_css.build('.webcomic-reading-expansion', this['exp']['style'])
				}
			}
		}
	}
}

class SiteCss {
	build(selector, css) {
		this[selector] = [this[selector], css].join('')
	}

	apply() {
		// Following code adapted from Matt Mitchell, http://stackoverflow.com/a/3286307
		var head = document.getElementsByTagName('HEAD')[0]
		var style = head.appendChild(window.document.createElement('style'))
		style.setAttribute('type', 'text/css')
		style.setAttribute('rel', 'stylesheet')

		var selectors = Object.keys(this)
		for (var i = selectors.length -1; i >= 0; i--) {
			var selector = selectors[i]
			var css = this[selector]

			var content = document.createTextNode(selector + ' {' + css + ' }')
			style.appendChild(content)
		}
	}
}

// Following function from tggagne, http://stackoverflow.com/a/22076667
function HttpClient() {
  this.get = function(aUrl, aCallback) {
    var anHttpRequest = new XMLHttpRequest();
    anHttpRequest.onreadystatechange = function() { 
      if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
        aCallback(anHttpRequest.responseText);
    }

    anHttpRequest.open('GET', aUrl, true);            
    anHttpRequest.send(null);
  }
}

function processWebsites(supported_data) {
	var supported_sites = Object.keys(supported_data)
	var host = window.location.hostname

	for (var i = supported_sites.length - 1; i >= 0; i--) {
		var supported_site = supported_sites[i]
		if (host.search(supported_site) !== -1) {
			site = new ComicWebsite(supported_data[supported_site])
			site_css = new SiteCss()
			site.navigate()
			site.expand(site_css)
			window.onload = function() {
				site.copy(site_css)
				site_css.apply()
			}
			break
		}
	}
}

(function() {
	if (sessionStorage['supported_data']) {
		processWebsites(JSON.parse(sessionStorage['supported_data']))

	} else {
		var client = new HttpClient()
		client.get('https://raw.githubusercontent.com/Hummert-IT/webcomic-reading/master/Supported%20sites.json', function(response) {
			try {
				sessionStorage['supported_data'] = response
			} catch(e) {
				console.log('Safari Private Browsing does not support local storage. No queries will be cached.')
			}
			
			processWebsites(JSON.parse(response))
		})
	}
})()
