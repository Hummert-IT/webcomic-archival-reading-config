class ComicWebsite {
		constructor(config) {
			this.prev = document.querySelector(config.prev)
			this.next = document.querySelector(config.next)
			this.comic = document.querySelectorAll(config.comic)
			this.after = document.querySelector(config.after)
			this.patts = config.patts
			this.style = config.style
		}

		get imageNode() {
			return this.comic
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
					var alt_data = this.comic[i].getAttribute('title')
					if (this.patts !== undefined) {
						for (var i = this.patts.length - 1; i >= 0; i--) {
							if (alt_data.search(this.patts[i]) !== -1) {
								alt_data = null
								break
							}
						}
					}

					if (alt_data != null || this.after !== null) {
						var wrapper = document.createElement('div')
						// this.comic[i].parentNode.appendChild(wrapper)
						this.comic[i].parentNode.insertBefore(wrapper, this.comic[i].nextSibling)
						wrapper.setAttribute('style', 'display:none;')

						if (alt_data != null) {
							var alt_text = document.createElement('p')
							var alt_text_node = document.createTextNode(alt_data)
							alt_text.appendChild(alt_text_node)
							wrapper.appendChild(alt_text)
							if (this.style !== undefined) {
								alt_text.setAttribute('style', 'text-align:center;' + this.style)
							}
						}
						if (this.after !== null) {
							wrapper.insertAdjacentHTML('beforeend', this.after.outerHTML)
							//this.comic[i].parentNode.insertBefore(wrapper, this.comic[i].nextSibling)
						}
						
						wrapper.setAttribute('style', 'width:' + this.comic[i].width + 'px; margin: 0 auto')
					}
				}
			}
		}
	}

(function() {
	var host = window.location.hostname
	var supported_data = {
		'qwantz.com': {
			prev:  'a[rel=prev]',
			next:  'a[rel=next]',
			comic: 'img.comic',
			style: '\
				background:rgba(255,255,255,.8);\
				padding:7px;\
				margin:7px 0;\
				'
			},
		'daisyowl.com': {
			prev:  '.nav > a:first-of-type',
			next:  '.nav > a:last-of-type',
			comic: '.main > div:nth-of-type(2) img',
			style: '\
				background:rgba(255,255,255,.8);\
				padding:7px;\
				margin: 0 0 20px;\
				'
		},
		'xkcd.com': {
			prev:  '.comicNav a[rel=prev]',
			next:  '.comicNav a[rel=next]',
			comic: '#comic > img',
			style: '\
				background:rgba(255,255,255,.8);\
				margin:7px auto 30px;\
				text-decoration: none !important;\
				'
		},
		'what-if.xkcd.com': { // Must be loaded after xkcd.com due to reversed 'for' loop
			prev: '.nav-prev > a',
			next: '.nav-next > a',
			comic: 'img.illustration',
			style: '\
				margin:0 auto;\
				text-decoration: none !important;\
				font-style: oblique;\
				'
		},
		'drmcninja.com': {
			prev:  '.prepostnav > a.prev',
			next:  '.prepostnav > a.next',
			comic: '#comic > img',
			patts: [/[0-9]+?p[0-9]+/g],
			style: '\
				background:rgba(255,255,255,.8);\
				margin:0 0 30px;\
				text-decoration: none !important;\
				'
		},
		'smbc-comics.com': {
			prev:  '.nav > a[rel=prev]',
			next:  '.nav > a[rel=next]',
			comic: '#cc-comic',
			after: '#aftercomic img',
			patts: [/[0-9][0-9][0-9][0-9]-[0-1][0-9]-[0-3][0-9]/g],
			style: '\
				background:rgba(255,255,255,.8);\
				margin:0 0 16px;\
				text-decoration: none !important;\
				'
		},
		'mspaintadventures.com': {
			prev: 'html > body > center > table > tbody > tr > td > table > tbody > tr > td > table > tbody > tr > td > center > table > tbody > tr > td > table > tbody > tr > td > span > b:nth-of-type(2) > a',
			next: 'html > body > center > table > tbody > tr > td > table > tbody > tr > td > table > tbody > tr > td > center > table > tbody > tr > td > table > tbody > tr > td > font:last-of-type > a'
		},
		'alicegrove.com': {
			prev: '.comic-pagination > a:nth-of-type(2)',
			next: '.comic-pagination > a:nth-of-type(3)'
		},
		'buttersafe.com': {
			prev: 'a[rel=prev]',
			next: 'a[rel=next]'
		},
		'dresdencodak.com': {
			prev: 'a[rel=prev]',
			next: 'a[rel=next]'
		},
		'extrafabulouscomics.com': {
			prev: 'a[rel=prev]',
			next: 'a[rel=next]'
		},
		'gunnerkrigg.com': {
			prev: '.extra > .nav > a.left',
			next: '.extra > .nav > a.right'
		},
		'harkavagrant': {
			prev: 'html > body > div > center > table > tbody > tr > td > center > a:first-of-type',
			next: 'html > body > div > center > table > tbody > tr > td > center > a:last-of-type'
		},
		'lackadaisycats.com': {
			prev: '.prev > a',
			next: '.next > a'
		},
		'paradoxspace.com': {
			prev: '.prev-page > a',
			next: '.next-page > a'
		},
		'poorlydrawnlines.com': {
			prev: 'a[rel=prev]',
			next: 'a[rel=next]'
		},
		'prequeladventure.com': {
			prev: '.previous > a[rel=prev]',
			next: '.next > a[rel=next]'
		},
		'romanticallyapocalyptic.com': {
			prev: 'a[accesskey=p]',
			next: 'a[accesskey=n]'
		},
		'samandfuzzy.com': {
			prev: '.prev-page > a',
			next: '.next-page > a'
		},
		'collectedcurios.com': {
			prev: '#nav > a:nth-of-type(3)',
			next: '#nav > a:nth-of-type(4)'
		}
	}
	var supported_sites = Object.keys(supported_data)

	// Dialog button cleanup for macOS
	//	var button_selector = '.button'
	//	var button_element = document.querySelector(button_selector)
	//	if (button_element !== null) {
	//		button_element.removeAttribute('onmouseover')
	//		button_element.removeAttribute('onmouseout')
	//		button_element.click()
	//	}
	//}

	for (var i = supported_sites.length - 1; i >= 0; i--) {
		var supported_site = supported_sites[i]
		if (host.search(supported_site) !== -1){
			site = new ComicWebsite(supported_data[supported_site])
			site.navigate()
			window.onload = function() {
				site.copy()
			}
			break
		}
	}
})()
