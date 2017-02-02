class ComicWebsite {
		constructor(config) {
			this.prev = document.querySelector(config.prev)
			this.next = document.querySelector(config.next)
			this.comic = document.querySelector(config.comic)
			this.after = document.querySelector(config.after)
			this.patts = config.patts
			this.style = config.style
		}

		get imageNode() {
			return this.comic
		}

		navigate() {
			// Following snippet adapted from Karl Ding, http://github.com/karlding
			var prev = this.prev
			var next = this.next
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
			if (this.comic !== null) {
				var alt_data = this.comic.getAttribute('title')
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
					this.comic.parentNode.appendChild(wrapper)
					wrapper.setAttribute('style', 'display:none;')

					if (alt_data != null) {
						var alt_text = document.createElement('p')
						var alt_text_node = document.createTextNode(alt_data)
						alt_text.appendChild(alt_text_node)
						wrapper.appendChild(alt_text)
						if (this.style !== undefined) {
							alt_text.setAttribute('style', this.style)
						}
					}
					if (this.after !== null) {
						console.log(this.after)
						wrapper.insertAdjacentHTML('beforeend', this.after.outerHTML)
					}
					
					wrapper.setAttribute('style', 'width:' + this.comic.width + 'px; margin: 0 auto')
				}
			}
		}
	}

(function() {
	var host = window.location.hostname

	// Dinosaur Comics
	if (host.search('qwantz.com') !== -1) {
		var site = new ComicWebsite({
			prev:  'a[rel=prev]',
			next:  'a[rel=next]',
			comic: 'img.comic',
			style: '\
				background:rgba(255,255,255,.8);\
				padding:7px;\
				margin:7px 0;\
				'
		})
	}

	// Daisy Owl
	else if (host.search('daisyowl.com') !== -1) {
		var site = new ComicWebsite({
			prev:  '.nav > a:first-of-type',
			next:  '.nav > a:last-of-type',
			comic: '.main > div:nth-of-type(2) img',
			style: '\
				background:rgba(255,255,255,.8);\
				padding:7px;\
				margin: 0 0 20px;\
				'
		})
	}

	// What If?
	else if (host.search('what-if.xkcd.com') !== -1) {
		var site = new ComicWebsite({
			prev: '.nav-prev > a',
			next: '.nav-next > a'
		})
	}

	// XKCD
	else if (host.search('xkcd.com') !== -1) {
		var site = new ComicWebsite({
			prev:  '.comicNav a[rel=prev]',
			next:  '.comicNav a[rel=next]',
			comic: '#comic > img',
			style: '\
				background:rgba(255,255,255,.8);\
				margin:7px auto 30px;\
				text-decoration: none !important;\
				'
		})
	} 

	// Dr. McNinja
	else if (host.search('drmcninja.com') !== -1) {
		var site = new ComicWebsite({
			prev:  '.prepostnav > a.prev',
			next:  '.prepostnav > a.next',
			comic: '#comic > img',
			patts: [/[0-9]+?p[0-9]+/g],
			style: '\
				background:rgba(255,255,255,.8);\
				margin:0 0 30px;\
				text-decoration: none !important;\
				'
		})
	} 

  // Saturday Morning Breakfast Cereal
	else if (host.search('smbc-comics.com') !== -1) {
		var site = new ComicWebsite({
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
		})
	} 

	// MS Paint Adventures
	else if (host.search('mspaintadventures.com') !== -1) {
		var site = new ComicWebsite({
			prev: 'html > body > center > table > tbody > tr > td > table > tbody > tr > td > table > tbody > tr > td > center > table > tbody > tr > td > table > tbody > tr > td > span > b:nth-of-type(2) > a',
			next: 'html > body > center > table > tbody > tr > td > table > tbody > tr > td > table > tbody > tr > td > center > table > tbody > tr > td > table > tbody > tr > td > font:last-of-type > a'
		})

	// Dialog button cleanup for macOS
		var button_selector = '.button'
		var button_element = document.querySelector(button_selector)
		if (button_element !== null) {
			button_element.removeAttribute('onmouseover')
			button_element.removeAttribute('onmouseout')
			button_element.click()
		}
	} 

	// Alice Grove
	else if (host.search('alicegrove.com') !== -1) {
		var site = new ComicWebsite({
			prev: '.comic-pagination > a:nth-of-type(2)',
			next: '.comic-pagination > a:nth-of-type(3)'
		})
	} 

	// Buttersafe
	else if (host.search('buttersafe.com') !== -1) {
		var site = new ComicWebsite({
			prev: 'a[rel=prev]',
			next: 'a[rel=next]'
		})
	}

	// Dresden Codak
	else if (host.search('dresdencodak.com') !== -1) {
		var site = new ComicWebsite({
			prev: 'a[rel=prev]',
			next: 'a[rel=next]'
		})
	}

	// Dresden Codak
	else if (host.search('extrafabulouscomics.com') !== -1) {
		var site = new ComicWebsite({
			prev: 'a[rel=prev]',
			next: 'a[rel=next]'
		})
	}

	// Gunnerkrigg Court
	else if (host.search('gunnerkrigg.com') !== -1) {
		var site = new ComicWebsite({
			prev: '.extra > .nav > a.left',
			next: '.extra > .nav > a.right'
		})
	}

	// Hark, a Vagrant!
	else if (host.search('harkavagrant.com') !== -1) {
		var site = new ComicWebsite({
			prev: 'html > body > div > center > table > tbody > tr > td > center > a:first-of-type',
			next: 'html > body > div > center > table > tbody > tr > td > center > a:last-of-type'
		})
	}

	// Lackadaisy Cats
	else if (host.search('lackadaisycats.com') !== -1) {
		var site = new ComicWebsite({
			prev: '.prev > a',
			next: '.next > a'
		})
	}

	// Paradox Space
	else if (host.search('paradoxspace.com') !== -1) {
		var site = new ComicWebsite({
			prev: '.prev-page > a',
			next: '.next-page > a'
		})
	}

	// Poorly Drawn Lines
	else if (host.search('poorlydrawnlines.com') !== -1) {
		var site = new ComicWebsite({
			prev: 'a[rel=prev]',
			next: 'a[rel=next]'
		})
	}

	// Prequel
	else if (host.search('prequeladventure.com') !== -1) {
		var site = new ComicWebsite({
			prev: '.previous > a[rel=prev]',
			next: '.next > a[rel=next]'
		})
	}

	// Romantically Apocalyptic
	else if (host.search('romanticallyapocalyptic.com') !== -1) {
		var site = new ComicWebsite({
			prev: 'a[accesskey=p]',
			next: 'a[accesskey=n]'
		})
	}

	// Sam & Fuzzy
	else if (host.search('samandfuzzy.com') !== -1) {
		var site = new ComicWebsite({
			prev: '.prev-page > a',
			next: '.next-page > a'
		})
	}

	// Collected Curios
	else if (host.search('collectedcurios.com') !== -1) {
		var site = new ComicWebsite({
			prev: '#nav > a:nth-of-type(3)',
			next: '#nav > a:nth-of-type(4)'
		})
	}

	// Do the things
	if (site !== undefined) {
		site.navigate()
		window.onload = function() {
			site.copy()
		}
	}
})()
