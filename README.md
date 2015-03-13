# MetaPlatform's MetaJS UI Framework

## Warning
MetaJS is using experimental HTML5 WebComponent features which are not part of living standard and is not fully suported by web browsers.

**MetaJS currently works only in Google Chrome.**

## meta-view
Meta view is smart template component which implements [Handlebars](http://handlebarsjs.com/) templating engine and supports dynamic event binding with basic object observer.

```
<template is="meta-view" name="my-view">
	<p>This is meta-view template content where X = {{x}}</p>
	<p>
		<button>Try to click me!</button>
	</p>
</template>
```

See demos for working example and advanced usage.

## meta-fragment
Meta fragment implements view-logic.

```
<!-- DEFINE FRAGMENT VIEW -->
<template is="meta-view" name="my-fragment-view">
	<p>Iam lazy fragment!</p>
	<button>You've pushed me {{x}} times!</button>
</template>

<!-- DEFINE FRAGMENT -->
<script type="text/javascript">

	/*
	 * Register fragment
	 */
	Meta.Fragment('my-fragment', {

		view: 'my-fragment-view',

		constructor: function(){

			this.view.model.x = 0;

			this.view.on("click", "button", function(){
				this.model.x++;
			});

		}

	});

</script>

<!-- USE FRAGMENT -->
<meta-fragment name="my-fragment"></meta-fragment>
```

See demos for working example and advanced usage.

## License
MIT