class ComicWebsite {
	constructor(config) {
		this.prev = document.querySelector(config.prev)
		this.next = document.querySelector(config.next)

		this.comic = document.querySelectorAll(config.comic)
		this.after = document.querySelector(config.after)
		this.patts = []
		if (config.patts !== undefined) {
			for (var i = config.patts.length - 1; i >= 0; i--) {
				this.patts.push(new RegExp(config.patts[i], 'g'))
			}
		}
		this.style = config.style

		this.expand_s = document.querySelectorAll(config.expand_s)
		this.expand_d = document.querySelectorAll(config.expand_d)
		this.expand_c = config.expand_c

		this.addtl = config.addtl
	}

	additionalCommands() {
		return this.addtl
	}

	navigate() {
		var prev = this.prev
		var next = this.next

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
		if (this.comic !== []) {
			for (var i = this.comic.length - 1; i >= 0; i--) {
				var comic = this.comic[i]
				var alt_data = comic.getAttribute('title')

				if (this.patts !== []) {
					for (var ii = this.patts.length - 1; ii >= 0; ii--) {
						if (alt_data.search(this.patts[ii]) !== -1) {
							alt_data = undefined
							break
						}
					}
				}

				if (alt_data || this.after) {
					var wrapper = document.createElement('div')
					// comic.parentNode.appendChild(wrapper)
					comic.parentNode.insertBefore(wrapper, comic.nextSibling)
					wrapper.setAttribute('style', 'display:none;')

					if (alt_data) {
						var alt_text = document.createElement('p')
						var alt_text_node = document.createTextNode(alt_data)
						alt_text.appendChild(alt_text_node)
						wrapper.appendChild(alt_text)
						if (this.style !== undefined) {
							alt_text.setAttribute('style', 'text-align:center;' + this.style)
						}
					}
					if (this.after) {
						wrapper.insertAdjacentHTML('beforeend', this.after.outerHTML)
						//comic.parentNode.insertBefore(wrapper, comic.nextSibling)
					}
					
					wrapper.setAttribute('style', 'width:' + comic.width + 'px; margin: 0 auto')
				}
			}
		}
	}

	expand() {
		if (this.expand_s.length === this.expand_d.length && this.expand_s !== []) {
			for (var i = this.expand_s.length - 1; i >= 0; i--) {
				var source = this.expand_s[i]
				var destin = this.expand_d[i]

				if (this.expand_c) { destin.setAttribute('style', this.expand_c) }
				destin.innerHTML = ' [' + source.innerHTML + '] '
				source.parentNode.removeChild(source)
			}
		}
	}
}

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
	// Following class from tggagne, http://stackoverflow.com/a/22076667

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
