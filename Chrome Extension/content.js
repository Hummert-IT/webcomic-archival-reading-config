class ComicWebsite {
	constructor(config) {
		try { var prev = config['nav']['prev'] } catch(e) {}
		try { var next = config['nav']['next'] } catch(e) {}

		this['nav'] = {
			'prev': document.querySelector(prev),
			'next': document.querySelector(next)
		}

		try { var comic = config['alt']['comic'] } catch(e) {}
		try { var after = config['alt']['after'] } catch(e) {}
		try { var ignore = config['alt']['ignore'] } catch(e) {}
		try { var a_style = config['alt']['style'] } catch(e) {}

		this['alt'] = {
			'comic': document.querySelectorAll(comic),
			'after': document.querySelector(after),
			'ignore': ignore,
			'style': a_style
		}

		try { var source = config['exp']['source'] } catch(e) {}
		try { var destin = config['exp']['destin'] } catch(e) {}
		try { var e_style = config['exp']['style'] } catch(e) {}
		try { var prefix = config['exp']['prefix'] } catch(e) {}
		try { var suffix = config['exp']['suffix'] } catch(e) {}

		this['exp'] = {
			'source': document.querySelectorAll(source),
			'destin': document.querySelectorAll(destin),
			'prefix': prefix,
			'suffix': suffix,
			'style': e_style
		}
	}

	navigate() {
		var prev = this['nav']['prev']
		var next = this['nav']['next']

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

	copy() {
		if (this['alt']['comic'] !== []) {
			for (var i = this['alt']['comic'].length - 1; i >= 0; i--) {
				var comic = this['alt']['comic'][i]
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
					// comic.parentNode.appendChild(wrapper)
					comic.parentNode.insertBefore(wrapper, comic.nextSibling)
					wrapper.setAttribute('style', 'display:none;')

					if (alt_data) {
						var alt_text = document.createElement('p')
						var alt_text_node = document.createTextNode(alt_data)
						alt_text.appendChild(alt_text_node)
						wrapper.appendChild(alt_text)
						if (this['alt']['style'] !== undefined) {
							alt_text.setAttribute('style', 'text-align:center;' + this['alt']['style'])
						}
					}
					if (this['alt']['after']) {
						wrapper.insertAdjacentHTML('beforeend', this['alt']['after'].outerHTML)
						//comic.parentNode.insertBefore(wrapper, comic.nextSibling)
					}
					
					wrapper.setAttribute('style', 'width:' + comic.width + 'px; margin: 0 auto')
				}
			}
		}
	}

	expand() {
		if (this['exp']['source'].length === this['exp']['destin'].length && this['exp']['source'] !== []) {
			for (var i = this['exp']['source'].length - 1; i >= 0; i--) {
				var source = this['exp']['source'][i]
				var destin = this['exp']['destin'][i]
				var prefix = this['exp']['prefix']
				var suffix = this['exp']['suffix']

				if (this['exp']['style']) { destin.setAttribute('style', this['exp']['style']) }

				if (prefix && suffix) {
					destin.innerHTML = prefix + source.innerHTML + suffix
				} else if (prefix && !suffix) {
					destin.innerHTML = prefix + source.innerHTML
				} else if (!prefix && suffix) {
					destin.innerHTML = source.innerHTML + suffix
				} else {
					destin.innerHTML = source.innerHTML
				}
				

				source.parentNode.removeChild(source)
			}
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

    anHttpRequest.open( "GET", aUrl, true );            
    anHttpRequest.send( null );
  }
}

function processWebsites(supported_data) {
	var supported_sites = Object.keys(supported_data)
	var host = window.location.hostname

	for (var i = supported_sites.length - 1; i >= 0; i--) {
		var supported_site = supported_sites[i]
		if (host.search(supported_site) !== -1) {
			site = new ComicWebsite(supported_data[supported_site])
			site.navigate()
			site.expand()
			window.onload = function() {
				site.copy()
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
			sessionStorage['supported_data'] = response
			processWebsites(JSON.parse(response))
		})
	}
})()
