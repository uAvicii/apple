(function () {
	var c, p;
	/* Get locale from page URL */
	if (c = /^\/([a-z]{2}\-[a-z]{2,4})\/?/i.exec(window.location.pathname)) {
		/* Map of locales that don't have a unique POD */
		var m = {
			"en-afri": "gb~en",
			"fr-afri": "fr~fr",
			"en-emea": "gb~en",
			"en-asia": "ap~en",
			"en-lamr": "la~en",
			"es-lamr": "la~es"
		};
		/* Either get POD from locale map, or convert from locale in URL */
		p = (m[c[1]]) ? m[c[1]] : c[1].split("-").reverse().join("~");
	}
	else {
		p = "us~en";
	}
	var e = new Date();
	/* Set expiry to 28 days */
	e.setDate(e.getDate() + 28);
	/* Write POD cookie for all apple.com subdomains */
	document.cookie = "POD=" + p + "; path=/; domain=.apple.com; expires=" + e.toUTCString();
})();
