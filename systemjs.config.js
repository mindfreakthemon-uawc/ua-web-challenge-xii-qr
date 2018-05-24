(function (global) {
	var map = {
		'app': 'build/app',
		'@angular': 'build/vendor/@angular',
		'rxjs': 'build/vendor/rxjs',
		'moment': 'build/vendor/moment/min/moment.min'
	};

	var packages = {
		'app': {
			main: 'main.js',
			defaultExtension: 'js'
		},
		'rxjs': {
			defaultExtension: 'js',
			main: 'bundles/rxjs.umd'
		}
	};

	var ngPackageNames = [
		'common',
		'compiler',
		'core',
		'forms',
		'http',
		'platform-browser',
		'platform-browser-dynamic',
		'router',
		'router-deprecated',
		'upgrade',
	];

	ngPackageNames.forEach(function (pkgName) {
		packages['@angular/' + pkgName] = {
			main: System.packageWithIndex ? 'index.js' : 'bundles/' + pkgName + '.umd.js',
			defaultExtension: 'js'
		};
	});

	var rxjsPackageNames = [
		'operators'
	];

	rxjsPackageNames.forEach(function (pkgName) {
		packages['rxjs/' + pkgName] = {
			main: 'index.js',
			defaultExtension: 'js'
		};
	});


	System.config({
		map: map,
		packages: packages
	});
})(this);

